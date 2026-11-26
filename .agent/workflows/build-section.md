---
description: Build a portfolio section end-to-end with motion, 3D fallbacks, security review, and browser QA.
---

# /build-section — Section Implementation Workflow

Coordinate **`planner`**, **`frontend-motion-engineer`**, **`backend-api-engineer`** (if API/form/data logic is involved), **`security-reviewer`**, and **`qa-browser-tester`**.

## Steps
1. **Confirm Spec & Content Honesty**:
   - Verify section scope against the approved plan (or run `/plan` first if ambiguous).
   - Use only user-verified copy, repos, and metrics; insert `// TODO(portfolio-data): ...` / `[TODO: ...]` for missing details.
2. **Verify Current Library APIs**:
   - Query `context7` MCP for up-to-date signatures before using Next.js App Router, Framer Motion, GSAP, R3F, Lenis, or Zod APIs.
3. **Implement Server Shell & Interactive Leaf Boundaries**:
   - Build semantic Server Component markup first with `next/image` / `next/font`.
   - Isolate Framer Motion / GSAP / Lenis / R3F in focused `'use client'` modules.
   - Lazy-load any R3F/Three.js `<Canvas>` via `next/dynamic(..., { ssr: false })` with sized `<Suspense>`, `ErrorBoundary`, DPR cap, `prefers-reduced-motion` guard, and static mobile/no-WebGL fallback.
   - If the section submits forms or loads external data, delegate Route Handler / Server Action / Zod schema work to `backend-api-engineer`.
4. **Static Checks**:
   - Run Prettier check, ESLint, and `tsc --noEmit` (zero `any`, zero errors/warnings).
5. **Mandatory Independent Security Review**:
   - Invoke **`security-reviewer`** via `invoke_subagent` in a fresh context to review `git diff` / changed files independently before showing the result to the user.
   - Fix any `Critical`, `High`, or `Medium` findings and re-verify.
6. **Visual & Functional Browser QA**:
   - Run `qa-browser-tester` (Playwright MCP / Playwright tests) at desktop (`1440x900`) and mobile (`390x844`) viewports, plus `prefers-reduced-motion: reduce` emulation.
   - Confirm zero `console.error`, zero uncaught page errors, and crisp visual alignment.

## Definition of Done
- [ ] Zero TypeScript errors, zero `any`, ESLint clean, and Prettier formatted.
- [ ] Heavy 3D lazy-loaded; `prefers-reduced-motion` and mobile/no-WebGL fallbacks verified.
- [ ] Zero fabricated data; any placeholder content explicitly marked `TODO`.
- [ ] Independent `security-reviewer` subagent returned `PASS` on the final diff.
- [ ] Playwright desktop/mobile checks pass with zero `console.error` or layout breakage.
