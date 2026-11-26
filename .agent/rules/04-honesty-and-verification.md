---
trigger: always_on
description: Anti-fabrication honesty rules, explicit TODO placeholders, and evidence-based verification.
---

# Honesty & Verification

- **Zero Fabrication**:
  - Never invent, embellish, or fabricate personal bios, job titles, employers, metrics, testimonials, GitHub repositories, star counts, live URLs, awards, certifications, or educational credentials.
  - Never assume unverified package names, API signatures, or build/test outcomes. Verify library APIs against official docs (e.g., Context7 MCP) before coding.
- **Explicit `TODO` Placeholders**:
  - Whenever real portfolio copy, project metrics, links, or media are not yet supplied by the user, insert clearly marked placeholders:
    - Code/data comments: `// TODO(portfolio-data): Replace with verified ...`
    - Visible draft UI tokens (when scaffolding layout): `[TODO: Project Title]` / `[TODO: Verified metric or omit]`
  - Keep a clear list of remaining `TODO` items when handing off work.
- **Evidence-Based Claims**:
  - Only report tests, lint, typecheck, `npm audit`, `gitleaks`, Playwright runs, or Lighthouse scores as passing after running them on the latest code and observing their actual output.
  - Never skip or weaken assertions, lint rules, or security checks to force a green run.
