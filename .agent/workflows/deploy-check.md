---
description: Final pre-deployment release gate combining static checks, security audit, prod build, QA, and Lighthouse >= 90.
---

# /deploy-check — Pre-Deployment Release Gate

Coordinate **`security-reviewer`** and **`qa-browser-tester`**.

## Steps
1. **Repository & Content Hygiene**:
   - Check `git status` and `git diff` to ensure no untracked `.env` files, temp artifacts, or debug logs exist.
   - Search `src/` for unresolved UI `TODO` markers that should not ship publicly, and confirm zero fabricated portfolio data.
2. **Static Quality Suite**:
   - Run `npm run format:check` (Prettier), `npm run lint` (ESLint), and `npm run typecheck` (`tsc --noEmit`).
3. **Security & Supply-Chain Gate**:
   - Run `gitleaks detect --redact --verbose`.
   - Run `npm audit --audit-level=high`.
   - Confirm independent `security-reviewer` `PASS` verdict on all changes since last release/commit.
4. **Production Build & Runtime Verification**:
   - Run `npm run build` and start production server (`npm run start`).
   - Verify HTTP security headers (`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) on live responses.
   - Confirm SEO essentials (`robots.txt`, `sitemap.xml`, canonical metadata, Open Graph tags).
5. **End-to-End QA & Mobile Lighthouse Gate**:
   - Run `/qa-browser-test` and `/perf-audit` against the production server.
   - Verify mobile Lighthouse >= 90 across all 4 categories and zero console errors.
6. **Issue Go / No-Go Verdict**:
   - Summarize exact command outputs, scores, and any manual pre-deploy env vars needed in hosting (e.g., Vercel).

## Definition of Done
- [ ] Format, ESLint, `tsc --noEmit`, `gitleaks`, and `npm audit --audit-level=high` all pass.
- [ ] Production build succeeds cleanly with verified CSP and security headers.
- [ ] Browser QA passes with zero console errors and mobile Lighthouse >= 90 across all 4 categories.
- [ ] Independent `security-reviewer` sign-off and explicit `GO` verdict recorded.
