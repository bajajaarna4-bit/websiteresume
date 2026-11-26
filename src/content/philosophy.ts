export interface PhilosophyMoment {
  step: string;
  label: string;
  headline: string;
  narrative: string;
  proofAnchor: string;
}

export const PHILOSOPHY_MOMENTS: PhilosophyMoment[] = [
  {
    step: '01',
    label: 'Velocity > Perfection',
    headline: 'A dumb who tries beats a genius who only thinks of doing.',
    narrative:
      'Over-engineering inside your head produces zero telemetry. Shipping an imperfect v0.1 forces real compiler errors, real edge cases, and real user feedback to teach you faster than theory alone.',
    proofAnchor: 'Shipped 25 public repositories across Linux, AI, and full-stack TypeScript.',
  },
  {
    step: '02',
    label: 'Explore Across Layers',
    headline: 'Curiosity refuses to stay inside one abstraction layer.',
    narrative:
      'From immutable Fedora Linux images and SELinux policies in nova-os to Next.js App Router security sandboxes, systems only click when you touch both the kernel script and the pixel shader.',
    proofAnchor: 'Python + Bash + Linux systems work paired with TypeScript + React Three Fiber.',
  },
  {
    step: '03',
    label: 'Build in the Open',
    headline: 'Every commit is a small falsifiable experiment.',
    narrative:
      'Treat GitHub like a laboratory notebook: break ideas down into testable slices, verify them in real browsers and CI pipelines, and document what failed alongside what worked.',
    proofAnchor: 'Automated pre-commit Gitleaks, TypeScript strictness, and Playwright checks.',
  },
  {
    step: '04',
    label: 'Hardening by Default',
    headline: 'Move fast, never reckless.',
    narrative:
      'Bias to action works best when guardrails are automated. Strict Zod validation, nonce CSP, and least-privilege boundaries let you ship bold ideas safely.',
    proofAnchor: 'Interactive Attack vs Defend Security Lab built directly into this OS.',
  },
];
