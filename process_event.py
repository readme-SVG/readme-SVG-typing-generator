import os
import json
import re
import time
import requests
from github import Github, Auth

gh_token = os.environ.get("GITHUB_TOKEN")
model_token = os.environ.get("GH_MODELS_TOKEN")
repo_name = os.environ.get("REPOSITORY")
event_name = os.environ.get("EVENT_NAME")
allowed_users = [u.strip().lower() for u in os.environ.get("ALLOWED_USER", "").split(",")]

MODEL_NAME = "Llama-3.3-70B-Instruct"
ENDPOINT = "https://models.inference.ai.azure.com/chat/completions"

auth = Auth.Token(gh_token)
gh = Github(auth=auth)
repo = gh.get_repo(repo_name)

diff_text = ""
event_context = ""
author_login = ""
trigger_labels = []
dedup_key = ""
pr_ref = None

if event_name == "push":
    commit_sha = os.environ.get("COMMIT_SHA")
    commit = repo.get_commit(commit_sha)

    if len(commit.parents) > 1:
        exit(0)
    if not commit.author:
        exit(0)

    author_login = commit.author.login.strip().lower()
    if author_login not in allowed_users:
        exit(0)

    dedup_key = f"commit:{commit_sha[:7]}"
    event_context = f"Commit Message: {commit.commit.message}"
    trigger_labels = [m.lower() for m in re.findall(r'\[(.*?)\]', commit.commit.message)]

    for file in commit.files:
        diff_text += f"File: {file.filename}\nPatch:\n{file.patch}\n\n"
        if len(diff_text) > 10000:
            diff_text += "\n[Diff truncated...]"
            break

elif event_name == "pull_request":
    pr_number = int(os.environ.get("PR_NUMBER"))
    pr = repo.get_pull(pr_number)
    author_login = pr.user.login.strip().lower()
    if author_login not in allowed_users:
        exit(0)

    pr_ref = pr
    dedup_key = f"PR #{pr_number}"
    event_context = f"PR Title: {pr.title}\nPR Body: {pr.body}"
    trigger_labels = [label.name.lower() for label in pr.labels]

    for file in pr.get_files():
        diff_text += f"File: {file.filename}\nPatch:\n{file.patch}\n\n"
        if len(diff_text) > 80000:
            diff_text += "\n[Diff truncated...]"
            break
else:
    exit(0)

for issue in repo.get_issues(state="open"):
    if dedup_key in (issue.body or ""):
        print(f"Issue for {dedup_key} already exists (#{issue.number}), skipping.")
        exit(0)

def close_duplicate_issues(title_keyword: str):
    for issue in repo.get_issues(state="closed"):
        if title_keyword.lower() in (issue.title or "").lower():
            print(f"Found old closed duplicate: #{issue.number} — leaving closed.")
            return True
    return False

def build_permalink(filename: str, line: int = 1) -> str:
    commit_sha = os.environ.get("COMMIT_SHA") or ""
    if not commit_sha:
        if pr_ref:
            commit_sha = pr_ref.head.sha
    return f"https://github.com/{repo_name}/blob/{commit_sha}/{filename}#L{line}"

base_instructions = """
Return only a raw JSON object with no markdown formatting. The JSON must have these exact keys:

"issue_title": string — include severity prefix like [CRITICAL], [HIGH], [MEDIUM], or [LOW] at the start,
"severity": string — one of: critical, high, medium, low,
"issue_body": string — must include these sections:
  ## Problem
  (clear description with exact file paths and line numbers if known)
  
  ## Code Reference
  (the exact problematic code snippet)
  
  ## Suggested Fix
  (concrete code or steps to fix)
  
  ## Permalink
  (placeholder: PUT_PERMALINK_HERE — we will replace this)

"labels": list of strings — standard GitHub labels plus the severity level
"affected_file": string — the most relevant filename from the diff (or "" if unknown)
"affected_line": integer — approximate line number of the issue (or 1 if unknown)
"summary": string — 2-3 sentence plain-English summary for PR comment

The issue_title, issue_body and summary MUST be written entirely in English.
"""

if any(l in trigger_labels for l in ["sec", "security", "audit"]):
    prompt = f"Act as a Strict Security Auditor. Perform a deep security audit (OWASP Top 10). Find real vulnerabilities with exact file/line references.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["review", "refactor", "code-review"]):
    prompt = f"Act as a Strict Code Reviewer. Analyze code quality (SOLID/DRY). Point to exact lines that violate principles.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["qa", "test", "testing"]):
    prompt = f"Act as a QA Engineer. Identify edge cases and missing test coverage. Reference exact functions/lines.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["perf", "performance", "optimize"]):
    prompt = f"Act as a Performance Expert. Analyze bottlenecks and O(n) complexity issues with exact line references.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["pm", "release", "product"]):
    prompt = f"Act as a Product Manager. Generate user-facing Release Notes with clear impact descriptions.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["deps", "dependencies"]):
    prompt = f"Act as a Security & Dependency Auditor. Analyze all new or changed dependencies: check for known vulnerabilities (CVEs), license compatibility (MIT/Apache/GPL), package size impact, and whether each dep is actively maintained. Reference exact file and line where dep is added.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["arch", "architecture"]):
    prompt = f"Act as a Software Architect. Review the code changes for architectural issues: violation of separation of concerns, tight coupling, wrong layer dependencies, anti-patterns (God object, spaghetti logic, magic numbers). Reference exact files and lines.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
else:
    prompt = f"Analyze changes and create a standard documentation issue. Include file references.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"

def call_model(prompt: str, retries: int = 3, delay: int = 5) -> dict:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {model_token}"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a professional software auditor. Always return valid JSON only. No markdown, no explanation, just the JSON object."},
            {"role": "user", "content": prompt}
        ],
        "model": MODEL_NAME,
        "temperature": 0.1
    }
    for attempt in range(retries):
        try:
            resp = requests.post(ENDPOINT, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
            resp_data = resp.json()
            raw = resp_data['choices'][0]['message']['content'].strip()
            raw = re.sub(r'^```json\s*|```$', '', raw, flags=re.MULTILINE).strip()
            return json.loads(raw)
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
    raise RuntimeError("All API attempts failed.")

result = call_model(prompt)

title_keyword = result.get("issue_title", "")[:40]
if close_duplicate_issues(title_keyword):
    print("Similar issue was already found and closed. Skipping to avoid reopen.")
    exit(0)

affected_file = result.get("affected_file", "")
affected_line = result.get("affected_line", 1)

if affected_file:
    permalink = build_permalink(affected_file, affected_line)
    issue_body = result["issue_body"].replace("PUT_PERMALINK_HERE", permalink)
else:
    issue_body = result["issue_body"].replace("PUT_PERMALINK_HERE", "_No specific file identified_")

if event_name == "push":
    footer = f"\n\n---\n*Generated automatically from commit {os.environ.get('COMMIT_SHA')[:7]}*"
else:
    footer = f"\n\n---\n*Generated automatically from {dedup_key}*"

severity = result.get("severity", "medium").lower()
severity_label_map = {
    "critical": "severity: critical",
    "high":     "severity: high",
    "medium":   "severity: medium",
    "low":      "severity: low",
}
extra_labels = [severity_label_map.get(severity, "severity: medium")]
all_labels = list(set(result.get("labels", []) + extra_labels))

issue = repo.create_issue(
    title=result["issue_title"],
    body=issue_body + footer,
    labels=all_labels
)
print(f"Created issue #{issue.number}: {issue.title}")

if pr_ref:
    summary = result.get("summary", "")
    if summary:
        pr_comment = (
            f"### 🤖 AI Analysis Summary\n\n"
            f"{summary}\n\n"
            f"**Severity:** `{severity.upper()}`\n\n"
            f"📋 Full details: #{issue.number}"
        )
        pr_ref.create_issue_comment(pr_comment)
        print(f"Posted summary comment to PR #{pr_ref.number}")
