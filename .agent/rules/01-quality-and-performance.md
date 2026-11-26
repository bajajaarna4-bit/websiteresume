---
trigger: always_on
description: Production quality bar, zero console errors, lint/format cleanliness, and mobile Lighthouse >= 90 targets.
---

# Quality & Performance Bar

- **Runtime Cleanliness**:
  - Zero `console.error`, `console.warn`, unhandled promise rejections, or React hydration mismatches in development or production builds.
  - Remove all debug `console.log` statements before completing any task.
- **Static Quality**:
  - Zero `any` types across source and test files.
  - ESLint clean (zero errors, zero disabled security/type-safety rules without justification).
  - Prettier formatted across all touched files.
  - `tsc --noEmit` must pass with zero errors.
- **Performance & Lighthouse Targets**:
  - Mobile Lighthouse score must be **>= 90** across Performance, Accessibility, Best Practices, and SEO.
  - Core Web Vitals targets on mobile: LCP <= 2.5s, CLS <= 0.1, INP <= 200ms.
  - Use `next/image` with explicit `sizes` and dimensions (or `fill` inside sized containers), and `next/font` for web fonts (`display: 'swap'`).
  - Lazy-load below-the-fold heavy visuals, interactive widgets, and all WebGL/Three.js modules via `next/dynamic`.
- **Accessibility Baseline**:
  - Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`), single `<h1>` per page, logical heading order.
  - Full keyboard operability (`Tab`, `Enter`, `Space`, `Escape`) with visible focus indicators (`focus-visible:`).
  - Accessible labels on icon buttons, sufficient contrast (WCAG AA), and descriptive `alt` text (or `aria-hidden="true"` for decorative elements).
