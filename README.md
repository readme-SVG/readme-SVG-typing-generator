<div align="center">

[![SVG Animation](https://readme-svg-typing-generator.vercel.app/api?lines=README%20SVG&animation=rainbow&color=36BCF7&background=00000000&size=45&font=monospace&duration=5000&pause=1000&width=435&height=50&letterSpacing=normal&center=true&vCenter=false&multiline=false&repeat=true&random=false)](https://github.com/OstinUA)

[![SVG Animation](https://readme-svg-typing-generator.vercel.app/api?lines=Typing%20Generator&animation=rainbow&color=36BCF7&background=00000000&size=45&font=monospace&duration=5000&pause=1000&width=435&height=50&letterSpacing=normal&center=true&vCenter=false&multiline=false&repeat=true&random=false)](https://github.com/OstinUA)


**Animated SVG banners for GitHub READMEs, repositories, and websites.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-6c74ff?style=for-the-badge&logo=vercel)](https://readme-svg-typing-generator.vercel.app/)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/OstinUA/readme-SVG-typing-generator)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![API Type](https://img.shields.io/badge/API-Serverless%20SVG-0a0a0a?style=for-the-badge)](api/index.js)

</div>

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Technical Block](#technical-block)
  - [Project Structure](#project-structure)
  - [Key Design Decisions](#key-design-decisions)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)
- [Contacts](#contacts)
- [Support the Project](#-support-the-project)

## Features

This project is intentionally simple on the outside and very practical on the inside.

- **Pure SVG output**: the API returns static SVG markup with embedded SVG animations, no runtime JavaScript required in the rendered image.
- **GitHub-friendly**: generated images are safe for markdown embedding in README files and profile pages.
- **20 animation engines** out of the box (`typing`, `fade`, `slide`, `glitch`, `matrix`, `rainbow`, etc.).
- **Serverless-first architecture**: deploys cleanly on Vercel via lightweight API routes.
- **Animation parameterization via query string**: customize text lines, timings, colors, dimensions, alignment, repeat mode, and spacing.
- **Demo UI included**: a no-build frontend (`index.html` + vanilla JS/CSS) to tune params and copy ready-to-paste markdown.
- **Fast iteration loop**: edit files, rerun `vercel dev`, test instantly with raw API URLs.
- **Separation of concerns**: each animation is isolated in its own module and registered centrally.

## Technology Stack

Core stack used in this repository:

- **Runtime**: Node.js 18+
- **Backend/API**: Vercel Serverless Functions (CommonJS modules)
- **Frontend**: vanilla HTML, CSS, and JavaScript (no framework, no bundler)
- **Output format**: SVG + native SVG animation primitives (`animate`, `animateTransform`, SVG/CSS animation patterns)
- **Deployment target**: Vercel
- **Source control workflow**: Git + GitHub PRs

## Technical Block

### Project Structure

```text
readme-SVG-typing-generator/
├── api/
│   ├── index.js                # Main API entrypoint: validates params and composes full SVG response
│   ├── animations.js           # API-level animation exports adapter
│   └── animations/
│       ├── index.js            # Registry: animation name -> module
│       ├── _utils.js           # Shared animation helpers
│       ├── typing.js           # One animation implementation per file
│       ├── fade.js
│       ├── slide.js
│       └── ...
├── assets/
│   ├── css/styles.css          # Demo page styling
│   └── js/app.js               # Demo page logic (controls, previews, URL generation)
├── index.html                  # Demo web UI
├── vercel.json                 # Routing/runtime config for Vercel
├── CONTRIBUTING.md             # Contributor workflow and collaboration contract
└── README.md                   # Project documentation
```

### Key Design Decisions

- **No heavy framework layer**: this repo avoids framework lock-in and ships straight-up JS modules, which keeps cold starts and cognitive load low.
- **Animation modules are pluggable**: every animation is self-contained, so adding new effects is a low-risk delta.
- **Param normalization in API layer**: query inputs are parsed once and exposed as normalized options to animation modules.
- **Demo and API are decoupled**: `index.html` can evolve independently without changing the generation contract.
- **URL-driven API contract**: reproducibility is excellent; a single URL is both config and artifact locator.

## Getting Started

### Prerequisites

Install these dependencies on your machine:

- **Git** (latest stable)
- **Node.js 18+** (LTS recommended)
- **npm** (bundled with Node.js)
- **Vercel CLI** for local serverless simulation

```bash
node -v
npm -v
```

If `node` is below 18, upgrade before continuing.

### Installation

```bash
# 1) Fork repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/readme-SVG-typing-generator.git
cd readme-SVG-typing-generator

# 2) Install Vercel CLI globally (skip if already installed)
npm install -g vercel

# 3) Start local development server
vercel dev
```

Local endpoints you will use most:

- `http://localhost:3000/` -> demo UI
- `http://localhost:3000/api` -> SVG generation endpoint

## Testing

There is no monolithic test suite in this repository right now, so validation is primarily **functional smoke testing** against API responses and visual checks.

Recommended local checks:

```bash
# Start local runtime
vercel dev

# Basic API sanity: should return SVG XML
curl "http://localhost:3000/api?lines=Hello+World&animation=typing"

# Multi-line + animation variant
curl "http://localhost:3000/api?lines=Line+1;Line+2;Line+3&animation=rainbow&multiline=true&height=120"

# Non-looping variant
curl "http://localhost:3000/api?lines=One+Shot&animation=glitch&repeat=false"
```

What to verify:

- Response is valid SVG content.
- Text is positioned correctly for `center` / `vCenter`.
- Timings behave correctly for `duration`, `pause`, and `repeat`.
- No broken markup when lines include encoded spaces and separators.

## Deployment

### Option A: One-click Vercel deploy

Use the deploy badge at the top of this README. It clones and provisions a deployable project in Vercel with minimal friction.

### Option B: Manual Vercel deployment

```bash
# Login once (if needed)
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### CI/CD notes

- Vercel automatically builds/deploys from connected GitHub branches.
- Production deployments are typically tied to the default branch.
- Pull Requests can produce preview URLs for visual/API QA before merge.

## Usage

Typical markdown embed for README/profile:

```markdown
[![Typing SVG](https://readme-svg-typing-generator.vercel.app/api?lines=Senior+Engineer;Building+cool+things&animation=typing&color=36BCF7&size=24&duration=3000&pause=1000&center=true&vCenter=true&width=700&height=80)](https://github.com/OstinUA)
```

Raw HTML usage:

```html
<!-- Drop into docs site, personal page, or dashboard -->
<img
  alt="Animated SVG typing banner"
  src="https://readme-svg-typing-generator.vercel.app/api?lines=API+First;SVG+Animations&animation=neon&color=00e5ff&background=00000000&size=28&width=760&height=90&repeat=true"
/>
```

Local debug flow:

```bash
# 1) Launch local server
vercel dev

# 2) Open in browser or fetch via curl
open "http://localhost:3000/api?lines=Debug+Run&animation=matrix&size=32"

# 3) Iterate params fast by editing query string
```

## Configuration

The project is primarily configured through API query params.

| Parameter | Default | Description |
|---|---|---|
| `lines` | `Hello+World!` | Text lines separated by `;` (or custom `separator`) |
| `animation` | `typing` | Animation engine identifier |
| `color` | `36BCF7` | Hex text color without `#` |
| `background` | `00000000` | 8-digit RGBA hex background |
| `size` | `20` | Font size in pixels |
| `font` | `monospace` | Font preset: `monospace`, `code`, `sans`, `serif` |
| `duration` | `5000` | Per-line animation duration in ms |
| `pause` | `1000` | Pause between lines in ms |
| `width` | `435` | SVG width |
| `height` | `50` | SVG height |
| `center` | `false` | Horizontal centering toggle |
| `vCenter` | `false` | Vertical centering toggle |
| `multiline` | `false` | Render all lines simultaneously |
| `repeat` | `true` | Loop animation |
| `random` | `false` | Randomize line sequence |
| `letterSpacing` | `normal` | CSS `letter-spacing` value |
| `separator` | `;` | Custom line delimiter |

Environment variables:

- No mandatory `.env` file is required for the default local flow.
- Vercel project-level env vars can still be added if your deployment pipeline requires custom behavior.

## License

This project is distributed under the **GPL-3.0** license. See [`LICENSE`](LICENSE) for legal details.

## Contacts

- GitHub: [OstinUA](https://github.com/OstinUA)
- Issues: [Project Issues](https://github.com/OstinUA/readme-SVG-typing-generator/issues)
- Discussions/updates: use repository social links below

## ❤️ Support the Project

If you find this tool useful, consider leaving a ⭐ on GitHub or supporting the author directly:

[![Patreon](https://img.shields.io/badge/Patreon-OstinFCT-f96854?style=flat-square&logo=patreon)](https://www.patreon.com/OstinFCT)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-fctostin-29abe0?style=flat-square&logo=ko-fi)](https://ko-fi.com/fctostin)
[![Boosty](https://img.shields.io/badge/Boosty-Support-f15f2c?style=flat-square)](https://boosty.to/ostinfct)
[![YouTube](https://img.shields.io/badge/YouTube-FCT--Ostin-red?style=flat-square&logo=youtube)](https://www.youtube.com/@FCT-Ostin)
[![Telegram](https://img.shields.io/badge/Telegram-FCTostin-2ca5e0?style=flat-square&logo=telegram)](https://t.me/FCTostin)
