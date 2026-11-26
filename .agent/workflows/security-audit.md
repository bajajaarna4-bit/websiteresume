---
description: Run a comprehensive security, secrets, CSP, input validation, and dependency audit.
---

# /security-audit — Security & Supply-Chain Audit

Activate the **`security-reviewer`** skill (`.agent/skills/security-reviewer/SKILL.md`). For PR-sized reviews, run via an independent `invoke_subagent` session.

## Steps
1. **Secret & Hygiene Scan**:
   - Run `gitleaks detect --redact --verbose` (and `gitleaks git --pre-commit --redact --staged` if staged changes exist).
   - Verify `.gitignore` excludes `.env`, `.env.local`, `.env.*.local`, and private keys.
   - Search source code for `NEXT_PUBLIC_` variables to confirm zero server secrets leak to client bundles.
2. **Input Validation & Server Boundary Check**:
   - Inspect all Route Handlers (`src/app/api/**`), Server Actions, and external fetch/CMS adapters to confirm strict `zod` validation and safe error responses (no stack traces or internal env leaks).
   - Search for dangerous sinks (`dangerouslySetInnerHTML`, `eval`, `new Function`, unvalidated `href`/`src` URLs).
3. **Security Headers & CSP Verification**:
   - Inspect `next.config.*` and `middleware.ts` for strict `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `frame-ancestors 'none'`.
   - If a dev/prod server is running, inspect live HTTP response headers.
4. **Dependency & Supply-Chain Audit**:
   - Run `npm audit --audit-level=high` and review any new packages added to `package.json` / `package-lock.json`.
5. **Produce Audit Report**:
   - Output findings grouped by severity (`Critical`, `High`, `Medium`, `Low`, `Info`) with exact file/line references, remediations, and a `PASS` or `BLOCK` verdict.

## Definition of Done
- [ ] `gitleaks` scan completes with zero leaked secrets.
- [ ] Zero `NEXT_PUBLIC_*` private tokens and zero unvalidated external inputs (all boundaries Zod-validated).
- [ ] Strict CSP and security headers verified in config (and response headers if server available).
- [ ] `npm audit --audit-level=high` passes with zero unresolved High/Critical vulnerabilities.
- [ ] Written `PASS` / `BLOCK` security report delivered.
