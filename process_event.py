import os
import json
import re
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

if event_name == "push":
    commit_sha = os.environ.get("COMMIT_SHA")
    commit = repo.get_commit(commit_sha)
    if not commit.author:
        exit(0)
    author_login = commit.author.login.strip().lower()
    if author_login not in allowed_users:
        exit(0)
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
    event_context = f"PR Title: {pr.title}\nPR Body: {pr.body}"
    trigger_labels = [label.name.lower() for label in pr.labels]
    for file in pr.get_files():
        diff_text += f"File: {file.filename}\nPatch:\n{file.patch}\n\n"
        if len(diff_text) > 80000:
            diff_text += "\n[Diff truncated...]"
            break
else:
    exit(0)

base_instructions = """
Return only a raw JSON object with no markdown formatting. The JSON must contain these exact keys:
"issue_title": string,
"issue_body": string,
"labels": list of strings
The issue_title and issue_body MUST be written entirely in English. Choose appropriate standard GitHub labels for the 'labels' list.
"""

if any(l in trigger_labels for l in ["sec", "security", "audit"]):
    prompt = f"Act as a Strict Security Auditor. Perform a deep security audit (OWASP Top 10).\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["review", "refactor", "code-review"]):
    prompt = f"Act as a Strict Code Reviewer. Analyze code quality (SOLID/DRY).\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["qa", "test", "testing"]):
    prompt = f"Act as a QA Engineer. Identify edge cases and generate unit tests.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["perf", "performance", "optimize"]):
    prompt = f"Act as a Performance Expert. Analyze bottlenecks and complexity.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
elif any(l in trigger_labels for l in ["pm", "release", "product"]):
    prompt = f"Act as a Product Manager. Generate user-facing Release Notes.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"
else:
    prompt = f"Analyze changes and create a standard documentation issue.\nContext: {event_context}\nChanges: {diff_text}\n{base_instructions}"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {model_token}"
}

payload = {
    "messages": [
        {"role": "system", "content": "You are a professional software auditor. Always return valid JSON only."},
        {"role": "user", "content": prompt}
    ],
    "model": MODEL_NAME,
    "temperature": 0.1
}

resp = requests.post(ENDPOINT, headers=headers, json=payload)
resp_data = resp.json()

raw_content = resp_data['choices'][0]['message']['content'].strip()
raw_content = re.sub(r'^```json\s*|```$', '', raw_content, flags=re.MULTILINE).strip()

result = json.loads(raw_content)

if event_name == "push":
    footer = f"\n\n---\n*Generated automatically from commit {os.environ.get('COMMIT_SHA')[:7]}*"
else:
    footer = f"\n\n---\n*Generated automatically from PR #{os.environ.get('PR_NUMBER')}*"

repo.create_issue(
    title=result['issue_title'],
    body=result['issue_body'] + footer,
    labels=result.get('labels', [])
)
