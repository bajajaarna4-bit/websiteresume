# BAJAJ.OS Portfolio

> "A dumb who tries beats a genius who only thinks of doing."

A futuristic personal portfolio for **Aarna Bajaj** (`@bajajaarna4-bit`). Built to feel like an AI-powered OS — macOS-meets-JARVIS — with a cinematic scroll journey, live GitHub telemetry, an interactive Security Lab, and a production-grade backend.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Webpack mode) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Motion | Framer Motion + GSAP + ScrollTrigger + Lenis |
| 3D | React Three Fiber + Drei |
| Validation | Zod (all API inputs) |
| Email | Resend (optional; dry-run without key) |
| Testing | Playwright (Chromium desktop + mobile) |
| CI | GitHub Actions |

## Sections

1. **Hero** — Name, tagline, JARVIS 3D orb, Now Building badge
2. **Philosophy** — "Try > Think" scroll story (GSAP ScrollTrigger)
3. **GitHub Live** — Public repos, languages, 84-day activity heatmap (ISR, rate-limited)
4. **Featured Project** — `nova-os` deep dive: problem, architecture, stack, learnings
5. **AI Lab** — Constellation/timeline of AI tools explored (TODO placeholders)
6. **Startup Idea** — Unified mobility + stays concept with animated user flow
7. **Podcast & Stage** — Episode cards, Web Audio waveform, Topic Roulette
8. **Security Lab** — Interactive "Attack vs Defend" educational simulation (100% local)
9. **Contact** — Zod-validated form, honeypot, rate limiting, Resend delivery

## Quick Start

```bash
# 1. Clone
git clone https://github.com/bajajaarna4-bit/<repo> portfolio
cd portfolio

# 2. Install
npm install

# 3. Set environment variables
cp .env.example .env.local
# Edit .env.local — see "Environment Variables" section below

# 4. Dev server
npm run dev        # http://localhost:3100

# 5. Type check + lint
npm run typecheck
npm run lint

# 6. Production build
npm run build
npm start

# 7. Run E2E tests (requires dev server on port 3100)
npm run dev &
npx playwright test
```

## Environment Variables

Copy `.env.example` to `.env.local` and set these values:

| Variable | Required | Purpose |
|---|---|---|
| `SITE_URL` | Optional | Canonical URL for sitemap/robots (`https://your-domain.com`) |
| `GITHUB_USERNAME` | Optional | Defaults to `bajajaarna4-bit` |
| `GITHUB_READ_ONLY_TOKEN` | Optional | Fine-grained PAT with **only** public repo read access. Without it, falls back to a snapshot. |
| `RESEND_API_KEY` | Optional | Resend email API key. Without it, contact form logs but does not send. |
| `CONTACT_TO_EMAIL` | Optional | Your inbox address for contact form submissions |
| `CONTACT_FROM_EMAIL` | Optional | Verified Resend sender address |

> [!IMPORTANT]
> Never set `NEXT_PUBLIC_` on any of these. All are server-only.
> Never commit `.env.local` to git (it is in `.gitignore`).

### Getting a Read-Only GitHub Token

1. Go to [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
2. Click **Generate new token (fine-grained)**
3. Set expiry, choose **Public Repositories (read-only)**
4. Grant: Repository → **Contents** (Read), **Metadata** (Read)
5. Copy the token and set `GITHUB_READ_ONLY_TOKEN=<token>` in `.env.local`

## Available Scripts

```bash
npm run dev          # Next.js dev server (webpack, port 3100)
npm run build        # Production build (next build --webpack)
npm start            # Serve production build
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run lint:fix     # ESLint --fix
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Set all env vars in **Project Settings → Environment Variables**
4. Deploy — the build command (`next build --webpack`) is configured in `package.json`

> [!NOTE]
> The project uses `--webpack` explicitly because Turbopack has a known panic bug on Windows with Tailwind v4 CSS files (Next.js 16.4.6). This flag is safe on Vercel (Linux) and ensures consistent behaviour.

## Content TODOs

See [CONTENT_TODOS.md](./CONTENT_TODOS.md) for a complete list of placeholders you must replace with real content before going live.

## Project Structure

```
src/
  app/              # Routes, layout, API handlers, sitemap, robots
  components/
    motion/         # AppProviders (Lenis, GSAP, OS context)
    os/             # Boot, MenuBar, Dock, CommandPalette, DraggableWindow
    three/          # JarvisOrbCanvas, JarvisOrbScene, JarvisFallback
    sections/       # One component per portfolio section
  content/          # Static content data files (philosophy, ai-lab, etc.)
  lib/
    security-lab/   # Fully sandboxed simulator (no external calls)
    validators/     # Zod schemas for GitHub and Contact APIs
    env.ts          # Zod-validated server env (server-only)
    github.ts       # GitHub REST + GraphQL fetcher with ISR fallback
    mailer.ts       # Resend mailer (dry-run without API key)
    rate-limit.ts   # Sliding-window in-memory rate limiter
    utils.ts        # cn() helper
  proxy.ts          # Next.js middleware: nonce CSP, CORS guard
tests/
  e2e/              # Playwright E2E tests (desktop + mobile Chromium)
```
