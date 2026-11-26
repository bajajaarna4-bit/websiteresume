---
description: Audit production bundle size, 60fps motion/3D lazy-loading, Core Web Vitals, and mobile Lighthouse >= 90.
---

# /perf-audit — Performance & Lighthouse Audit

Coordinate **`frontend-motion-engineer`** and **`qa-browser-tester`**.

## Steps
1. **Production Build & Bundle Inspection**:
   - Run `npm run build` and examine route chunk sizes in build output.
   - Confirm Three.js / `@react-three/fiber` / `@react-three/drei` and heavy animation modules are code-split out of initial critical JS via `next/dynamic`.
2. **Asset & Font Hygiene Check**:
   - Verify all raster images use `next/image` with explicit `sizes` and responsive dimensions (no oversized unoptimized assets).
   - Verify fonts use `next/font` with `display: 'swap'` and minimal weights.
3. **Run Production Server & Mobile Lighthouse**:
   - Start production server (`npm run start`) in a controlled command/session.
   - Run Lighthouse CLI (mobile preset) against `/` and key portfolio routes (`npx lighthouse <url> --preset=perf --form-factor=mobile --output=json` or full categories check).
   - Target **>= 90** on Performance, Accessibility, Best Practices, and SEO; verify LCP <= 2.5s, CLS <= 0.1, INP <= 200ms.
4. **Runtime 60fps & Reduced-Motion Verification**:
   - Inspect animations in Playwright/DevTools to verify only composited transforms/opacity animate, offscreen 3D canvases pause, and `prefers-reduced-motion: reduce` disables heavy loops.
5. **Remediate & Re-Measure**:
   - Fix any bottlenecks found and re-run production build + Lighthouse after the final edit.

## Definition of Done
- [ ] `npm run build` completes cleanly with Three.js/R3F split out of the initial route bundle.
- [ ] Mobile Lighthouse scores >= 90 across Performance, Accessibility, Best Practices, and SEO on tested routes.
- [ ] LCP <= 2.5s, CLS <= 0.1, and smooth 60fps scroll/motion verified.
- [ ] Reduced-motion and offscreen 3D throttling confirmed.
