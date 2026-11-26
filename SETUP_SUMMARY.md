# Antigravity Workspace Setup Summary

This workspace (`C:\Users\asus\websiteresume`) is configured as a production-grade foundation for building a **Next.js (App Router) + TypeScript Strict + Tailwind CSS + Framer Motion / GSAP + React Three Fiber + Lenis** portfolio website.

> **Non-Destructive Setup Note:** No existing files were overwritten, no editor extensions or global OS tools were silently installed, no global `~/.gemini/` config files outside this repository were modified, and no premature `package.json` or `git init` was forced so `create-next-app` can scaffold cleanly without conflicts.

---

## What Was Configured (Phases 1–6)

### Phase 1 — Always-On Workspace Rules (`.agent/rules/`)
All five rule modules use `trigger: always_on`:
- `.agent/rules/00-stack-and-architecture.md` — Next.js App Router (Server Components default, `'use client'` leaf boundaries), TypeScript strict (zero `any`), Tailwind CSS, Framer Motion / GSAP, Lenis, React Three Fiber, clean `src/` folder layout.
- `.agent/rules/01-quality-and-performance.md` — Zero `console.error` / `console.warn`, ESLint + Prettier clean, `tsc --noEmit` clean, `next/image` + `next/font`, mobile Lighthouse **>= 90** across all 4 categories, WCAG AA accessibility.
- `.agent/rules/02-security.md` — Zero hardcoded secrets, `.env*` never committed, mandatory `zod` input validation, server-only secrets (no `NEXT_PUBLIC_*` private tokens), strict CSP and HTTP security headers, `npm audit --audit-level=high` pre-finish check, mandatory independent `security-reviewer` PR gate.
- `.agent/rules/03-motion-and-3d.md` — `prefers-reduced-motion` compliance (`MotionConfig reducedMotion="user"` + `matchMedia`), 60fps GPU-composited animation budget, `next/dynamic` lazy-loading for R3F/Three.js, DPR caps, `ErrorBoundary` + static mobile/no-WebGL fallbacks.
- `.agent/rules/04-honesty-and-verification.md` — Zero fabricated projects, metrics, repos, or credentials; explicit `TODO` markers for missing user content; evidence-based verification only.

### Phase 2 — Reusable Slash-Command Workflows (`.agent/workflows/`)
- `/plan` (`.agent/workflows/plan.md`) — Clarifies requirements, inspects docs via Context7, decomposes complex decisions via Sequential Thinking, flags missing content as `TODO`, outputs a step-by-step plan.
- `/build-section` (`.agent/workflows/build-section.md`) — Builds a section with Server/Client boundaries, motion/3D fallbacks, static checks, mandatory independent `security-reviewer` pass, and browser QA.
- `/security-audit` (`.agent/workflows/security-audit.md`) — Runs Gitleaks, `.env*`/`NEXT_PUBLIC_` leakage checks, Zod boundary checks, CSP/header checks, and `npm audit --audit-level=high`.
- `/perf-audit` (`.agent/workflows/perf-audit.md`) — Audits production build chunk splitting, R3F lazy-loading, 60fps animations, and mobile Lighthouse >= 90.
- `/qa-browser-test` (`.agent/workflows/qa-browser-test.md`) — Verifies desktop (`1440x900`) and mobile (`390x844`), zero console/network errors, keyboard accessibility, `prefers-reduced-motion`, and WebGL fallbacks.
- `/deploy-check` (`.agent/workflows/deploy-check.md`) — Final release gate verifying static checks, Gitleaks, `npm audit`, production build, security headers, SEO basics, QA, and mobile Lighthouse >= 90.

> **Antigravity Tip:** Antigravity supports `.agent/workflows/*.md` for backward compatibility, while newer Antigravity builds prefer Agent Skills (`.agent/skills/<name>/SKILL.md`) for slash commands. If your IDE prompts you to modernize workflows later, run `/migrate-workflows`.

### Phase 3 — Role Skills & Mandatory Security Gate (`.agent/skills/`)
- `planner` (`.agent/skills/planner/SKILL.md`)
- `frontend-motion-engineer` (`.agent/skills/frontend-motion-engineer/SKILL.md`)
- `backend-api-engineer` (`.agent/skills/backend-api-engineer/SKILL.md`)
- `security-reviewer` (`.agent/skills/security-reviewer/SKILL.md`) — **Mandatory independent gate**: invoked in an isolated subagent context (`invoke_subagent`) to audit every PR-sized change before presenting it to you.
- `qa-browser-tester` (`.agent/skills/qa-browser-tester/SKILL.md`)

### Phase 4 — Verified, Least-Privilege MCP Servers (`.agent/plugins/portfolio-mcp/`)
Configured in `.agent/plugins/portfolio-mcp/plugin.json` and `.agent/plugins/portfolio-mcp/mcp_config.json` with zero committed secrets:

| Server | Official Source / Package | Scope & Least-Privilege Mode |
| :--- | :--- | :--- |
| `github` | `github/github-mcp-server` (`https://api.githubcopilot.com/mcp/readonly`) | Hosted read-only Streamable HTTP endpoint (replaces archived `@modelcontextprotocol/server-github`). |
| `filesystem` | `@modelcontextprotocol/server-filesystem` | `--read-only`, strictly scoped to `C:\Users\asus\websiteresume`. |
| `playwright` | `@playwright/mcp@latest` | `--headless`, `--isolated`, `--viewport-size=1280x720`, output scoped to `.playwright-mcp/`. |
| `context7` | `@upstash/context7-mcp@latest` | Keyless up-to-date docs lookup; automatically reads `CONTEXT7_API_KEY` from OS env if exported. |
| `sequential-thinking` | `@modelcontextprotocol/server-sequential-thinking` | Local stdio reasoning tool; zero network or filesystem privilege. |

### Phase 5 — Extensions, Husky Pre-Commit, Secret Scanning & CI
- `.vscode/extensions.json` & `.vscode/settings.json` — Recommended (not silently installed) extensions:
  1. `dbaeumer.vscode-eslint` (ESLint)
  2. `esbenp.prettier-vscode` (Prettier - Code formatter)
  3. `bradlc.vscode-tailwindcss` (Tailwind CSS IntelliSense)
  4. `usernamehw.errorlens` (Error Lens)
  5. `eamodio.gitlens` (GitLens — Git supercharged)
  6. `ms-playwright.playwright` (Playwright Test for VS Code)
  7. `streetsidesoftware.code-spell-checker` (Code Spell Checker)
- `.husky/pre-commit` — Fail-closed Husky v9 hook running Gitleaks staged secret scan (`gitleaks git --pre-commit --redact --staged --verbose`), TypeScript `typecheck`, ESLint, and Prettier check.
- `.gitleaks.toml` — Extends default Gitleaks secret rules and ignores build/Playwright caches plus explicit dummy placeholder tokens.
- `.github/workflows/ci.yml` — Least-privilege CI (`permissions: contents: read`) with `secret-scan` (`gitleaks/gitleaks-action@v3`), `quality-and-build` (Prettier check, ESLint, `tsc --noEmit`, `npm audit --audit-level=high`, `npm run build`), and `e2e-visual` (Playwright).
- `.gitignore`, `.env.example`, `.prettierrc`, `.prettierignore` — Baseline secret and formatting hygiene.

### Phase 6 — Recommended Terminal & Antigravity Permission Policy
Use Antigravity's **Default (Sandboxed)** or **Request Review** preset with explicit **Deny > Ask > Allow** rules:

#### Allow-List (Safe, Local, Non-Destructive Commands Inside Workspace)
- `command(git status*)` — Read-only working tree inspection with zero mutation risk.
- `command(git diff*)` — Read-only diff inspection for reviews and audits.
- `command(git log*)` — Read-only commit history inspection.
- `command(npm run lint*)` — Runs project ESLint checks locally without network installs.
- `command(npm run typecheck*)` — Runs TypeScript compiler verification (`tsc --noEmit`) locally.
- `command(npm run format*)` — Checks or formats workspace code cleanly via Prettier.
- `command(npm run test*)` — Executes local unit or Playwright test suites in-project.
- `command(npm run build*)` — Verifies Next.js production compilation locally.
- `command(npm audit*)` — Checks package vulnerability advisories without mutating lockfiles or installing code.
- `command(gitleaks*)` — Scans repository or staged files locally for leaked secrets.

#### Always-Ask (`ask` / `force_ask` — Destructive, Remote Mutation, Privilege Escalation, or Network Installs)
- `command(rm *)` / `command(Remove-Item*)` — Prevents accidental irreversible file or directory deletion.
- `command(del *)` / `command(rmdir *)` — Guards Windows shell file/folder deletions against unintended data loss.
- `command(git push*)` — Requires explicit approval before publishing commits or branches to remote GitHub.
- `command(*--force*)` / `command(* -f *)` / `command(git reset --hard*)` / `command(git clean -fd*)` — Blocks silent history rewrites or loss of uncommitted local work.
- `command(sudo *)` / `command(runas *)` / `command(Start-Process * -Verb RunAs*)` — Prevents unreviewed OS-level privilege escalation.
- `command(curl *|*sh*)` / `command(wget *|*sh*)` / `command(irm *|*iex*)` / `command(iwr *|*iex*)` — Prevents blindly piping unverified remote scripts into a shell interpreter (move to **Deny** if you want zero-exception hard blocking).
- `command(npm install*)` / `command(npm i *)` / `command(npm add*)` / `command(pnpm add*)` / `command(npx *)` — Prevents silent supply-chain package downloads or arbitrary remote binary execution.
- `command(winget *)` / `command(scoop *)` / `command(pip install*)` — Prevents silent machine-wide or network package installations outside project scope.

> **Note:** Antigravity's **Permission Grants** (`~/.gemini/antigravity-cli/settings.json` or `~/.gemini/config/config.json` / Antigravity Settings UI) are user-global settings outside this workspace, so you apply them once in Antigravity Settings or via `/permissions`.

---

## Manual Steps You Must Complete

1. **Install Recommended Editor Extensions**
   - Open this folder in Antigravity IDE / VS Code and click **Install All** when prompted by `.vscode/extensions.json`, or install each of the 7 listed extensions manually from the Extensions panel.

2. **Install Gitleaks Locally (Required for Pre-Commit Hook)**
   - In PowerShell:
     ```powershell
     winget install gitleaks
     ```
     *(Or `scoop install gitleaks` if you use Scoop.)*
   - Verify with `gitleaks version`.

3. **Create a Read-Only GitHub Token & Authenticate GitHub MCP**
   - Go to **GitHub -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens** and create a token scoped **only** to your portfolio repository (or public repos) with **Read-only** permissions (`Contents: Read-only`, `Metadata: Read-only`, `Issues: Read-only`, `Pull requests: Read-only`) and zero write scopes.
   - **Option A (Hosted Read-Only Endpoint — already in `mcp_config.json`):** Sign in via OAuth when Antigravity prompts for `https://api.githubcopilot.com/mcp/readonly` (or if your Antigravity build requires an explicit Bearer header, add it in your machine-local `~/.gemini/config/mcp_config.json` — never in this git repo).
   - **Option B (Local Official Go Binary via OS Environment Variables):**
     1. Download the official Windows release of `github-mcp-server.exe` from `https://github.com/github/github-mcp-server/releases`.
     2. Store your token in Windows User Environment Variables (outside git):
        ```powershell
        [Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", "YOUR_GITHUB_TOKEN_HERE", "User")
        [Environment]::SetEnvironmentVariable("GITHUB_READ_ONLY", "1", "User")
        ```
     3. Override `"github"` in your local `~/.gemini/config/mcp_config.json` to run `github-mcp-server.exe` with `args: ["stdio", "--read-only"]` (leaving `env` unset so it inherits your Windows User environment variables without Antigravity's empty-string override).

4. **Optional: Set a Context7 API Key & Pre-Cache Playwright Browsers**
   - Context7 works keyless, or you can export a free key in your OS environment (`[Environment]::SetEnvironmentVariable("CONTEXT7_API_KEY", "YOUR_CONTEXT7_KEY_HERE", "User")`) for higher rate limits.
   - Alternatively, install the official **Context7** plugin directly from the Antigravity Marketplace panel.
   - When ready to run Playwright visual QA, run `npx playwright install chromium` so Chromium is cached locally.
   - Keep `.env.local` out of MCP `filesystem` queries and commits (workflows should only inspect `.env.example`).

5. **Initialize Git & Scaffold the Next.js Portfolio App**
   - Once you approve scaffolding, run inside `C:\Users\asus\websiteresume` (note: if `create-next-app` warns about existing `.agent/` / `SETUP_SUMMARY.md` dotfiles, scaffold into a temporary directory and move files into the workspace root, or ask Antigravity to scaffold around existing configs):
     ```powershell
     git init -b main
     npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
     npm install framer-motion gsap @gsap/react lenis three @types/three @react-three/fiber @react-three/drei zod server-only
     npm install -D husky prettier prettier-plugin-tailwindcss @playwright/test
     npx husky init
     ```
   - Ensure `package.json` includes scripts expected by `.husky/pre-commit` and `.github/workflows/ci.yml`:
     - `"typecheck": "tsc --noEmit"`
     - `"format:check": "prettier --check ."`
     - `"format": "prettier --write ."`
     - `"test:e2e": "playwright test"`
   - After `npx husky init`, verify `.husky/pre-commit` still contains the Gitleaks + typecheck + lint + format hook (restore from `git diff` if `husky init` overwrote it).

6. **Apply the Phase 6 Permission Policy in Antigravity**
   - Open **Antigravity Settings -> Permissions** (or run `/permissions` in `agy` CLI) and add the Allow-List and Always-Ask rules listed above. Ensure **Allow** rules never blanket-permit `npm install`, `npx`, `rm`, `git push`, `sudo`, or piped shell commands (`curl | sh` / `irm | iex`).
