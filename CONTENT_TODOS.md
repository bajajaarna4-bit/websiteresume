# Content TODOs — BAJAJ.OS Portfolio

This file lists every placeholder in the codebase that you must replace with real, verified content before going live.

> [!IMPORTANT]
> **Never fabricate or embellish any claim.** Only replace a TODO with verified, factual information.

---

## 🔴 Must Replace Before Launch

### Contact Info
- **File:** `src/components/sections/ContactSection.tsx` (line ~118)
- **Placeholder:** `[TODO: Public Email or set CONTACT_TO_EMAIL]`
- **Replace with:** Your public contact email address

### Environment Variables
Set all variables from `.env.example` in your production Vercel project:
- `SITE_URL` — your live Vercel URL
- `GITHUB_READ_ONLY_TOKEN` — read-only PAT
- `RESEND_API_KEY` — Resend API key
- `CONTACT_TO_EMAIL` — your inbox
- `CONTACT_FROM_EMAIL` — verified Resend sender

---

## 🟡 Replace When Ready

### AI Lab Nodes (Section 5)
- **File:** `src/content/ai-lab.ts`
- All 5 nodes are marked `// TODO(portfolio-data):`
- Replace each `name`, `description`, `status`, and `url` with real tools you've actually used

### Podcast Episodes (Section 7)
- **File:** `src/content/podcast.ts`
- 3 episode cards are `// TODO(podcast-data):`
- Replace with real episode titles, descriptions, and links when you have recordings
- The 5 Topic Roulette prompts can remain or be replaced with your actual talk ideas

### GitHub Avatar
- The site fetches `https://avatars.githubusercontent.com/u/287159050?v=4` — this is your real avatar, no action needed unless you change it

---

## 🟢 Already Verified — Do Not Fabricate

These are confirmed real data from your GitHub profile and READMEs:

| Item | Source |
|---|---|
| `bajajaarna4-bit` username | GitHub public profile |
| `nova-os` as top repo (96 commits, v0.1.0 release) | GitHub repo verified |
| `developer-productivity-toolkit` (Vercel deployed) | Live URL verified |
| `sheissafe` (SAATHI AI, women safety hackathon) | README verified |
| `travelearn2` / `sitebuilder` repos | GitHub public |
| 25 public repos total | GitHub API |
| Gurugram, Haryana, India location | GitHub profile |

---

## Philosophy & Tagline
- The tagline `"A dumb who tries beats a genius who only thinks of doing."` — confirm this is your actual philosophy or update it
- The 4 philosophy moments in `src/content/philosophy.ts` are written to match your stated ethos; review and adjust if needed

## Startup Idea (Section 6)
- `src/content/startup-idea.ts` — all market size claims are marked `[HYPOTHESIS]`; do not replace with invented statistics
- If you have real research data, cite the source inline

## Security Lab Disclaimer
- The "Educational Simulation" label is built in; no action needed
- Do not add any real exploit payloads, real external URLs, or real credentials to the simulator

---

## Deployment Checklist

Before going live, confirm:

- [ ] All env vars set in Vercel project settings
- [ ] `SITE_URL` matches your actual domain
- [ ] GitHub read-only PAT set and tested
- [ ] Resend domain verified and `CONTACT_FROM_EMAIL` set
- [ ] `npm audit --audit-level=high` → 0 vulnerabilities
- [ ] `tsc --noEmit` → 0 errors
- [ ] `npm run lint` → 0 errors
- [ ] `npx playwright test` → all tests pass
- [ ] Lighthouse mobile score ≥ 90 on all 4 categories
- [ ] Review SECURITY.md "Known Limitations" section
- [ ] Remove any remaining `// TODO(portfolio-data):` comments you haven't filled in yet, or leave them as invisible code comments (they don't render in UI)
