---
trigger: always_on
description: Motion accessibility (prefers-reduced-motion), 60fps GPU budget, lazy-loaded 3D, and graceful mobile fallbacks.
---

# Motion & 3D Engineering

- **Respect `prefers-reduced-motion` Everywhere**:
  - Wrap the app/client tree with Framer Motion `<MotionConfig reducedMotion="user">`.
  - Check `window.matchMedia('(prefers-reduced-motion: reduce)')` before initializing GSAP ScrollTrigger timelines, Lenis smooth scrolling, or continuous React Three Fiber animations.
  - When reduced motion is preferred: disable parallax, auto-scroll hijacking, continuous 3D rotation, and large transforms; allow instantaneous state/opacity transitions only.
- **60fps Animation Discipline**:
  - Animate exclusively GPU-composited properties (`transform`, `opacity`, and restrained `clip-path`). Never animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
  - Keep frame callbacks lightweight with zero per-frame allocations inside `useFrame`.
  - Pause offscreen animations and 3D render loops using `IntersectionObserver` (`frameloop="demand"` or conditional rendering when out of viewport).
- **Lazy-Loading Heavy 3D**:
  - Always import React Three Fiber `<Canvas>` scenes via `next/dynamic(..., { ssr: false })` with a styled `<Suspense>` placeholder that reserves exact layout dimensions (zero CLS).
  - Never pull `three`, `@react-three/fiber`, or `@react-three/drei` into the initial synchronous page bundle.
- **Graceful Mobile & Hardware Fallbacks**:
  - Cap pixel ratio (`dpr={[1, 1.5]}` on mobile / `[1, 2]` on desktop) and reduce geometry/post-processing complexity on touch or low-power devices (`navigator.hardwareConcurrency <= 4` or coarse pointer).
  - Wrap `<Canvas>` in a React `ErrorBoundary` and check WebGL availability; if WebGL fails or the device is low-tier/reduced-motion, render a crisp static SVG/CSS/image fallback with zero visual breakage or console errors.
