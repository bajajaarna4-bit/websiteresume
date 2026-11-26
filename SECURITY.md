# SECURITY.md — BAJAJ.OS Portfolio

This document describes the security controls implemented in this portfolio and what was hardened relative to a default Next.js project.

## Security Controls Summary

### 1. Content Security Policy (Strict Nonce-Based)

**Location:** `src/proxy.ts` (Next.js Middleware)

Every page response carries a unique per-request nonce (UUID → base64). The CSP:

```
default-src 'self';
script-src 'self' 'nonce-<uuid>' 'strict-dynamic';
style-src 'self' 'nonce-<uuid>';
style-src-elem 'self' 'nonce-<uuid>';
style-src-attr 'unsafe-inline';    ← Note below
img-src 'self' blob: data: https://avatars.githubusercontent.com;
font-src 'self' data:;
connect-src 'self';
media-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;         ← production only
```

> [!NOTE]
> `style-src-attr 'unsafe-inline'` permits inline `style=` attributes, which Tailwind utility classes and third-party components (DnD, GSAP transforms) write at runtime. This is a known, deliberate trade-off. It does **not** allow `<script>` or event handlers.
> `'unsafe-eval'` is excluded in production — Three.js and R3F compile via WebGL, not JS eval.

### 2. Additional Security Headers

**Location:** `next.config.ts`

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `X-Powered-By` | Removed (`poweredByHeader: false`) |

### 3. CORS Guard

**Location:** `src/proxy.ts`

All `/api/` routes enforce a strict allowlist: only requests whose `Origin` matches `request.nextUrl.origin` or the configured `SITE_URL` are accepted. Cross-origin requests receive `403`. Preflight `OPTIONS` responses include appropriate headers.

### 4. Input Validation (Zod)

All server-side inputs are validated with Zod before processing:

| Endpoint | Schema | Protects Against |
|---|---|---|
| `POST /api/contact` | `ContactRequestSchema` | Unexpected fields, length bombs, invalid emails, XSS payloads |
| `GET /api/github` | Response validated via `GitHubOverviewSchema` | Malformed upstream data |
| Server env | `ServerEnvSchema` in `env.ts` | Missing or malformed env vars at startup |

### 5. Rate Limiting

**Location:** `src/lib/rate-limit.ts` — sliding-window, in-memory

| Route | Limit | Window |
|---|---|---|
| `POST /api/contact` | 5 requests | 15 minutes |
| `GET /api/github` | 30 requests | 60 seconds |

Responses include `Retry-After` seconds in the 429 header.

> [!WARNING]
> The rate limiter is in-process memory. On Vercel Fluid Compute with multiple instances, buckets are per-instance. For production traffic, consider replacing with Upstash Redis or Vercel KV.

### 6. Honeypot Spam Protection

**Location:** `src/app/api/contact/route.ts`

The contact form includes a hidden `website` field (`aria-hidden="true"`, not visible to humans). If that field is non-empty, the server silently returns `200 OK` without delivering the message, trapping automated bots that fill all fields.

### 7. Server-Only Secrets

**Location:** `src/lib/env.ts`

```typescript
import 'server-only';
```

This guard causes Next.js to throw at build time if any client component imports `env.ts`, preventing accidental token exposure in the browser bundle. No environment variables use `NEXT_PUBLIC_` prefix.

### 8. Error Handling — No Leakage

API error responses return generic messages only. Internal details (stack traces, database errors, mailer errors) are caught and replaced with `"Unable to deliver message right now. Please try again later."` — no internal state is exposed to the client.

### 9. Security Lab — Sandboxing

**Location:** `src/lib/security-lab/simulator.ts`, `src/components/sections/SecurityLabSection.tsx`

The Security Lab is a **100% local, in-browser educational simulation**:
- Zero external HTTP requests
- No real exploit code (all patterns are illustrative strings)
- All "database" operations run against `MOCK_USERS` — a 3-row in-memory fixture
- No `dangerouslySetInnerHTML` anywhere in the component
- Prominent "Educational Simulation — Local In-Browser Mock Only" badge in the UI
- "ZERO EXTERNAL REQUESTS" badge on the attacker panel

### 10. Dependency Audit

```
npm audit --audit-level=high → 0 vulnerabilities found
```

Run before every release. No `npm audit fix --force` overrides were applied.

## Known Limitations / Future Hardening

| Item | Severity | Recommendation |
|---|---|---|
| In-process rate limiter | Low | Upgrade to Upstash Redis or Vercel KV for multi-instance deployments |
| `style-src-attr 'unsafe-inline'` | Low | Accept as Tailwind/GSAP runtime trade-off; document the rationale |
| No CSRF token on contact form | Low | Mitigated by CORS guard + SameSite cookie (no session cookies here); acceptable for a contact form |
| GitHub token rotation | Medium | Add a reminder to rotate the read-only PAT every 90 days |

## Security Contact

If you discover a vulnerability in this portfolio, please email directly (see Contact section on the site). There is no bug bounty, but responsible disclosure is appreciated.
