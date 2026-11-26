---
description: Plan a portfolio feature, section, or architectural change before writing code.
---

# /plan — Architecture & Implementation Plan

Activate the **`planner`** skill (`.agent/skills/planner/SKILL.md`) for this workflow.

## Steps
1. **Clarify Intent & Content**:
   - Confirm exact user requirements, target section/route, visual goals, and data sources.
   - Identify any missing copy, metrics, links, or media and explicitly mark them as `TODO` placeholders (never fabricate content).
2. **Inspect Codebase & Dependencies**:
   - Use scoped filesystem inspection (`filesystem` MCP / file read) and `context7` MCP to verify current APIs for Next.js App Router, Tailwind CSS, Framer Motion, GSAP, React Three Fiber, Lenis, and Zod.
   - Use `sequential-thinking` MCP for multi-file architectural trade-offs (SSR vs client islands, 3D bundle splitting, CSP impacts).
3. **Define Component & Boundary Architecture**:
   - Specify Server Component shell vs `'use client'` leaf boundaries.
   - Specify motion budget (GPU-only properties, `prefers-reduced-motion` fallback) and 3D lazy-loading + mobile fallback strategy.
   - Specify Zod schemas, server-only secrets/tokens (if any), and security header impacts.
4. **Produce File-by-File Plan & Test Matrix**:
   - List exact files to create/modify, verification commands (`tsc --noEmit`, `npm run lint`, `npm run build`), and browser QA cases.
   - Present the plan to the user for review before making destructive or large-scale changes.

## Definition of Done
- [ ] Written step-by-step plan listing exact files, component boundaries, and dependencies.
- [ ] All missing portfolio data explicitly flagged as `TODO` (zero fabricated claims).
- [ ] Motion, reduced-motion, mobile fallback, and lazy-loading strategy specified.
- [ ] Security boundaries (Zod validation, server-only data, CSP impact) documented.
- [ ] Verification commands and Playwright/Lighthouse acceptance checks defined.
