---
trigger: always_on
description: Mandatory security rules, Zod input validation, server-only secrets, CSP/headers, dependency audit, and PR review gate.
---

# Security & Privacy Rules

- **Secrets & Environment Variables**:
  - Never hardcode API keys, tokens, credentials, passwords, or private webhook URLs anywhere in source code, tests, docs, or MCP configs.
  - Never commit `.env`, `.env.local`, `.env.*.local`, or key files. Keep `.env.example` updated with placeholder names only.
  - Never expose private server tokens via `NEXT_PUBLIC_*` environment variables.
  - Access server secrets exclusively in Server Components, Route Handlers, or Server Actions (guard server modules with `import 'server-only'` once Next.js is installed).
- **Input & Boundary Validation**:
  - Validate 100% of external inputs (form submissions, Route Handler bodies, query params, route params, environment variables, CMS/JSON payloads, webhook requests) using `zod` before processing.
  - Reject unexpected fields, enforce string lengths and URL schemes (`https:` only for external links), and never interpolate raw user input into HTML, SQL, or shell commands.
  - Avoid `dangerouslySetInnerHTML`. If rich content is ever required, sanitize strictly with an allowlist sanitizer and document why.
- **HTTP Security Headers & Strict CSP**:
  - Configure strict response headers in `next.config.*` / `middleware.ts`:
    - `Content-Security-Policy` (nonce- or strict-allowlist based; forbid `unsafe-eval` in production; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`; `object-src 'none'`).
    - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy` denying unused sensors (`camera=(), microphone=(), geolocation=()`).
- **Supply Chain & Pre-Finish Audit**:
  - Run `npm audit --audit-level=high` and secret scanning (`gitleaks`) before concluding dependency updates or release checks.
  - Every PR-sized change MUST undergo an independent `security-reviewer` review before presenting the result to the user.
