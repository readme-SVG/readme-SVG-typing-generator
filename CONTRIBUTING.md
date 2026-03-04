# Contributing to README SVG Typing Generator

## 1. Introduction

First of all, thanks for deciding to invest your time in this project. You are helping improve a practical tool that many developers embed directly into their public profiles and repositories.

This repository is intentionally lightweight and hackable: no heavy framework stack, no complex build pipeline, and clear boundaries between API generation logic and demo UI. That means contributions can land quickly, but quality bar still matters. Keep changes focused, deterministic, and production-minded.

Before contributing, please read:

- [`README.md`](README.md)
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
- This file end-to-end

## 2. I Have a Question

Please do **not** open bug Issues for usage questions. The Issue tracker is for reproducible defects and actionable feature work.

For questions, use one of these channels:

- GitHub Discussions (preferred if enabled)
- GitHub profile/social channels listed in the README
- Stack Overflow-style Q&A format when sharing reproducible API examples

When asking, include:

- Full API URL you tested
- Expected output vs actual output
- Runtime context (local via `vercel dev` or deployed URL)

This avoids back-and-forth and gets you a useful answer faster.

## 3. Reporting Bugs

High-signal bug reports are pure gold. Low-signal reports burn maintainer time.

### 3.1 Check for duplicates first

Before opening a new Issue:

1. Search existing open and closed Issues.
2. Verify the bug still reproduces against the latest `main` (or production deployment).
3. Confirm it is not caused by malformed query params.

### 3.2 Include environment details

At minimum, provide:

- OS and version (`macOS 14`, `Ubuntu 22.04`, etc.)
- Browser and version (for UI issues)
- Node.js version (`node -v`) for local API runs
- Vercel CLI version (`vercel --version`) when testing locally
- Exact endpoint URL that reproduces the bug

### 3.3 Steps to reproduce

Use a deterministic sequence:

1. Starting context (`vercel dev` running at localhost)
2. Exact URL/query string
3. What you clicked or changed
4. Observed output

### 3.4 Expected vs actual behavior

Please provide:

- **Expected behavior**: what should happen
- **Actual behavior**: what happened instead
- Optional screenshot or SVG snippet if visual artifact is involved

If maintainers cannot reproduce it quickly, issue triage will be delayed.

## 4. Suggesting Enhancements

Enhancements are welcome, especially when they improve SVG quality, DX, or performance.

A strong enhancement proposal includes:

- The problem statement (what currently hurts)
- Why existing behavior is insufficient
- Proposed solution and API impact
- Backward-compatibility considerations
- 1-3 concrete use cases

Examples of solid enhancements:

- New animation module with predictable timing model
- Better parameter validation or defaults in `api/index.js`
- Demo UI improvements that reduce misconfiguration

## 5. Local Development / Setup

### 5.1 Fork and clone

```bash
# Fork on GitHub first, then clone your fork
git clone https://github.com/YOUR_USERNAME/readme-SVG-typing-generator.git
cd readme-SVG-typing-generator
```

### 5.2 Install prerequisites

```bash
node -v    # should be 18+
npm -v
npm install -g vercel
```

### 5.3 Environment configuration

This project does not require a mandatory `.env` for basic local execution.

If your fork adds optional env-based behavior, document it in your PR and provide sane defaults so the baseline flow remains zero-config.

### 5.4 Run locally

```bash
vercel dev
```

Useful local endpoints:

- Demo UI: `http://localhost:3000/`
- API: `http://localhost:3000/api?lines=Hello&animation=typing`

## 6. Pull Request Process

This section is non-negotiable for smooth merges.

### 6.1 Branch naming strategy

Use descriptive prefixes:

- `feature/<short-feature-name>`
- `bugfix/<issue-or-problem>`
- `docs/<doc-topic>`
- `refactor/<scope>`

Examples:

- `feature/matrix-animation-timing`
- `bugfix/animation-separator-parse`
- `docs/readme-params-table`

### 6.2 Commit message format (Conventional Commits)

Use Conventional Commits for every commit:

- `feat: add wave animation variant`
- `fix: clamp invalid height query values`
- `docs: rewrite README usage examples`
- `refactor: simplify animation registry imports`
- `test: add regression checks for multiline`

Avoid vague commits like `update stuff` or `changes`.

### 6.3 Sync with upstream before PR

Before opening a PR, rebase or merge latest upstream `main` into your branch.

```bash
git fetch upstream
git rebase upstream/main
# or: git merge upstream/main
```

Resolve conflicts locally and rerun your checks.

### 6.4 PR description requirements

A quality PR description includes:

- Linked Issue(s): `Closes #123` / `Related #456`
- Summary of what changed
- Why this approach was chosen
- Test evidence (`curl` examples, local checks)
- Screenshots/GIFs for any UI changes in `index.html` or `assets/*`
- Any breaking behavior and migration notes

Small PRs merge faster. Keep scope tight.

## 7. Styleguides

### 7.1 General coding style

- Prefer readability over clever one-liners.
- Keep functions focused and composable.
- Avoid unrelated refactors inside feature/fix PRs.
- Preserve existing naming and project conventions.

### 7.2 JavaScript style in this repo

- Stick to plain JavaScript compatible with Node.js runtime used by Vercel functions.
- Keep animation modules isolated and side-effect free.
- Reuse shared helpers from `api/animations/_utils.js` where possible.
- Do not introduce framework-level dependencies unless discussed first.

### 7.3 Linters/formatters

No strict linter/formatter pipeline is currently enforced in-repo.

Still expected:

- Consistent formatting
- No dead code
- No debug leftovers (`console.log` spam, commented-out blocks)
- No unnecessary dependency additions

## 8. Testing

New behavior should be validated before requesting review.

Minimum expectation:

- Manually test your changes via `vercel dev`
- Run API smoke checks with representative query strings
- Confirm no regressions for existing animations and baseline params

Suggested checks:

```bash
# Local server
vercel dev

# Baseline typing
curl "http://localhost:3000/api?lines=Hello+World&animation=typing"

# Multiline mode
curl "http://localhost:3000/api?lines=One;Two;Three&animation=fade&multiline=true&height=120"

# Edge-ish config
curl "http://localhost:3000/api?lines=Prod+Ready&animation=glitch&repeat=false&center=true&vCenter=true"
```

If you add a new animation, test at least:

- Single-line and multi-line
- `multiline=true`
- `center=true` + `vCenter=true`
- `repeat=false`
- Small and large canvas sizes

## 9. Code Review Process

Maintainers review PRs for correctness, readability, compatibility, and maintainability.

Review flow typically looks like this:

1. Maintainer triages scope and relevance.
2. Technical review on implementation details and API contract fit.
3. Feedback round (changes requested if needed).
4. Final approval and merge.

Guidelines for contributors during review:

- Respond to review comments constructively and quickly.
- Push focused follow-up commits instead of force-pushing unrelated rewrites.
- Mark threads as resolved only after the requested change is in.
- If you disagree with a suggestion, discuss trade-offs with data/examples.

Depending on PR size and impact, one or more approvals may be required.

Thanks again for contributing and helping keep this project fast, clean, and useful for the community.
