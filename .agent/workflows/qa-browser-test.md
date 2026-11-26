---
description: Run end-to-end Playwright browser QA across desktop/mobile viewports, console logs, a11y, and WebGL fallbacks.
---

# /qa-browser-test — Visual & Functional Browser QA

Activate the **`qa-browser-tester`** skill (`.agent/skills/qa-browser-tester/SKILL.md`).

## Steps
1. **Start Target Server & Playwright Session**:
   - Launch local Next.js app (prefer production build `npm run build && npm run start`, or `npm run dev` for section iteration).
   - Use Playwright MCP (`playwright`) or `npx playwright test` against the running URL.
2. **Viewport & Responsive Matrix**:
   - Test desktop (`1440x900`) and mobile (`390x844`) across all primary routes (`/`, project case studies, contact).
   - Verify zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`), clean typography wrapping, and intact interactive states.
3. **Zero Console & Network Error Gate**:
   - Record all browser `console` messages and `pageerror` events across navigation, scrolling, and clicks.
   - Verify zero `console.error`, zero uncaught exceptions, and zero unexpected HTTP `>= 400` responses.
4. **Motion, 3D Fallback & Accessibility Checks**:
   - Emulate `prefers-reduced-motion: reduce` and confirm animations remain calm and usable.
   - Test WebGL-unavailable / error fallback state for any R3F section to confirm graceful static fallback renders.
   - Tab through navigation, interactive cards, modals/drawers, and forms using keyboard only (`Tab`, `Shift+Tab`, `Enter`, `Escape`).
5. **Interactive Flows & Evidence**:
   - Test valid and invalid form inputs (verifying Zod validation errors display cleanly).
   - Save visual screenshots inside `.playwright-mcp/` (gitignored) and summarize findings.

## Definition of Done
- [ ] Desktop (`1440x900`) and mobile (`390x844`) render cleanly with zero horizontal overflow.
- [ ] Zero `console.error`, zero uncaught `pageerror`, and zero failed network requests.
- [ ] Keyboard navigation, `prefers-reduced-motion`, and 3D WebGL fallback verified.
- [ ] Interactive forms/flows tested for both success and validation error states.
