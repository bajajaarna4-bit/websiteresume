---
trigger: always_on
description: Core portfolio tech stack, Next.js App Router architecture, and TypeScript strict rules.
---

# Stack & Architecture

- **Framework**: Next.js (App Router) with React Server Components by default.
  - Keep page routes, metadata, data loading, and layouts as Server Components.
  - Add `'use client'` only at interactive, motion, or WebGL leaf components.
- **Language**: TypeScript in strict mode (`"strict": true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes` where practical).
  - Never use `any`. Use `unknown` with explicit type guards or `zod` schemas at runtime boundaries.
  - Never suppress compiler checks with `@ts-ignore` or `@ts-expect-error` without an inline issue/justification comment.
- **Styling**: Tailwind CSS with semantic design tokens (`globals.css` CSS variables + Tailwind theme tokens) and utility helpers (`clsx` / `tailwind-merge`).
- **Motion & Smooth Scroll**: Framer Motion (`motion/react`) and/or GSAP (`gsap` + `@gsap/react` `useGSAP` / `gsap.context()` cleanup) paired with Lenis smooth scroll (`lenis`).
  - Always clean up GSAP timelines, ScrollTrigger instances, and Lenis RAF loops on unmount.
  - Never break native keyboard scrolling, anchor jumps, or screen-reader focus order.
- **3D Graphics**: React Three Fiber (`@react-three/fiber`, `@react-three/drei`, `three`).
  - Keep 3D scenes modular, strictly typed, and isolated from business logic.
- **Directory Hygiene**:
  - `src/app/` for routes, layouts, metadata, and API Route Handlers.
  - `src/components/` grouped by `ui/`, `sections/`, `motion/`, and `three/`.
  - `src/lib/` for validated config, schemas, data helpers, and server utilities.
  - `src/content/` for portfolio data (never hardcode fabricated claims).
