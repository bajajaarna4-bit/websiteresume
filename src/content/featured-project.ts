export interface ArchitectureNode {
  id: string;
  label: string;
  layer: string;
  summary: string;
  controls: string[];
}

export interface FeaturedProjectCandidate {
  slug: string;
  name: string;
  rankReason: string;
  repoUrl: string;
  liveDemoUrl: string | null;
  tagline: string;
  problem: string;
  solution: string;
  stack: string[];
  verifiedHighlights: string[];
  learnings: string[];
  architectureNodes: ArchitectureNode[];
}

export const FEATURED_PROJECTS: FeaturedProjectCandidate[] = [
  {
    slug: 'nova-os',
    name: 'nova-os',
    rankReason:
      'Ranked #1 by repository depth (896 KB), active November 2026 commits, release v0.1.0 artifacts, 139 documented integration tests, and security assessment docs.',
    repoUrl: 'https://github.com/bajajaarna4-bit/nova-os',
    liveDemoUrl: null, // TODO(portfolio-data): Add verified live Render URL if deployed and active.
    tagline:
      'A modern, zero-trust, AI-native operating system distribution built on an immutable Linux foundation.',
    problem:
      'Conventional desktop OS environments remain mutable, rely on implicit trust across processes, and bolt AI agents on without strict tool-execution or audit boundaries.',
    solution:
      'Built an atomic Fedora bootc/rpm-ostree architecture enforcing SELinux policies, LUKS2 + Argon2id boot security, SHA-256 hash-chained audit logs, a local-first AI tool broker, and an interactive glassmorphic web shell.',
    stack: [
      'Fedora bootc:41',
      'rpm-ostree',
      'SELinux Enforcing',
      'LUKS2 + Argon2id',
      'Ollama / GGUF',
      'Google Gemini Broker',
      'Node.js / Render Shell',
    ],
    verifiedHighlights: [
      'Apache 2.0 release v0.1.0 with documented SHA-256 release manifest and ISO metadata.',
      'README reports 139 passing integration tests and dedicated SECURITY_ASSESSMENT.md documentation.',
      'Recent commits hardened Render demo asset resolution and mock system API endpoints.',
    ],
    learnings: [
      'Shipping an embedded web desktop demo required fixing asset path resolution and isolating mock system APIs from privileged host assumptions.',
      'Zero-trust tooling stays practical when local offline inference and explicit tool allowlists share one broker contract.',
      '[TODO: Add your personal reflection on the hardest engineering trade-off in nova-os.]',
    ],
    architectureNodes: [
      {
        id: 'boot-chain',
        label: '1. Verified Boot Chain',
        layer: 'UEFI + LUKS2',
        summary: 'UEFI Secure Boot enrollment paired with LUKS2 full-disk encryption using Argon2id.',
        controls: ['Custom CA verification', 'Anti-downgrade version checks'],
      },
      {
        id: 'immutable-core',
        label: '2. Atomic Linux Base',
        layer: 'Fedora bootc:41',
        summary: 'Container-native OS images managed via rpm-ostree and bootc for deterministic rollbacks.',
        controls: ['Immutable /usr tree', 'Atomic A/B image updates'],
      },
      {
        id: 'zero-trust',
        label: '3. Zero-Trust Policy',
        layer: 'SELinux + systemd',
        summary: 'SELinux Enforcing domains, PolicyKit default-deny rules, and hash-chained logs.',
        controls: ['ProtectSystem=strict', 'SHA-256 tamper-evident audit log'],
      },
      {
        id: 'ai-broker',
        label: '4. NOVA Intelligence',
        layer: 'Local-First AI Broker',
        summary: 'Routes between local Ollama/GGUF models and optional cloud models via allowlisted tools.',
        controls: ['Explicit tool allowlist', 'Offline-first fallback'],
      },
      {
        id: 'desktop-shell',
        label: '5. Fluid Desktop Shell',
        layer: 'Web / Desktop UI',
        summary: 'Translucent glassmorphic window manager, floating dock, and Render-hosted web preview.',
        controls: ['Accessible keyboard controls', 'Mock system API isolation'],
      },
    ],
  },
  {
    slug: 'developer-productivity-toolkit',
    name: 'developer-productivity-toolkit',
    rankReason:
      'Runner-up: Live Vercel deployment verified in repo README; combines Linux/Bash automation, Python REST telemetry, and 60fps dashboard.',
    repoUrl: 'https://github.com/bajajaarna4-bit/developer-productivity-toolkit',
    liveDemoUrl: 'https://developer-productivity-toolkit.vercel.app/',
    tagline:
      'Self-referential Linux systems administration, FIFO backup automation, and live telemetry suite.',
    problem:
      'Developers frequently switch between disjointed shell scripts and heavy dashboards to monitor local CPU/RAM/disk health and safe backup rotations.',
    solution:
      'Unifies POSIX Bash automation (--dry-run safety guards, FIFO backup retention) with a Python 3.12 REST pipeline and glassmorphic web UI.',
    stack: ['Bash 5.2+', 'Python 3.12+', 'Linux /proc', 'HTML/CSS/JS', 'Vercel'],
    verifiedHighlights: [
      'Live Vercel showcase linked directly in repository README.',
      'Includes non-destructive --dry-run cache cleanup guards and FIFO backup rotation.',
    ],
    learnings: [
      'Configuring Vercel rewrites without cleanUrls resolved nested dashboard entrypoints cleanly.',
      '[TODO: Add key benchmark or engineering takeaway from Linux telemetry scripts.]',
    ],
    architectureNodes: [
      {
        id: 'proc-host',
        label: '1. Linux Host',
        layer: '/proc & Cron',
        summary: 'Collects CPU, memory, disk usage, and Git tree health snapshots.',
        controls: ['Non-destructive --dry-run', 'FIFO rotation'],
      },
      {
        id: 'python-api',
        label: '2. Python REST API',
        layer: 'Python 3.12+',
        summary: 'Normalizes system telemetry and repository status payloads for frontend consumption.',
        controls: ['Typed JSON contract', 'CORS hygiene'],
      },
      {
        id: 'glass-ui',
        label: '3. Telemetry Dashboard',
        layer: '60fps Glass UI',
        summary: 'Visualizes host stats and automation history in a Vercel-deployed dashboard.',
        controls: ['Responsive cards', 'Zero external trackers'],
      },
    ],
  },
  {
    slug: 'sheissafe',
    name: 'sheissafe (SAATHI AI)',
    rankReason:
      'Runner-up: Privacy-first AI-assisted journey protection platform with explainable route-deviation risk scoring.',
    repoUrl: 'https://github.com/bajajaarna4-bit/sheissafe',
    liveDemoUrl: null,
    tagline:
      'Explainable journey protection detecting unusual stops or route deviations while preventing false alarms.',
    problem:
      'Safety apps either require manual panic triggers during emergencies or spam guardians with noisy false alerts.',
    solution:
      'Combines GPS simulation/live tracking, explainable anomaly heuristics (long stops, route deviation), and staged check-in escalation.',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Leaflet OSM', 'Web Audio API'],
    verifiedHighlights: [
      'Includes 7-stage interactive Judges Demo Arena covering check-in, deviation, SOS, and guardian ack.',
      'Uses Web Audio synthetic deterrent tools without relying on external audio CDNs.',
    ],
    learnings: [
      'False-alarm suppression requires progressive check-in prompts before escalating alerts.',
      '[TODO: Add field-testing insights or latency notes if measured.]',
    ],
    architectureNodes: [
      {
        id: 'gps-stream',
        label: '1. Route Telemetry',
        layer: 'Geolocation + Sim',
        summary: 'Ingests live or simulated commuter coordinates against planned path.',
        controls: ['Deviation threshold', 'Dwell-time check'],
      },
      {
        id: 'risk-engine',
        label: '2. Risk Scoring',
        layer: 'Explainable Rules',
        summary: 'Flags prolonged unexpected stops before escalating to guardian channels.',
        controls: ['Check-in grace window', 'False-alarm guard'],
      },
      {
        id: 'sos-ui',
        label: '3. Guardian & Deterrent UI',
        layer: 'React + Leaflet',
        summary: 'Displays live map state, SOS dispatch status, and Web Audio deterrent.',
        controls: ['Accessible alert controls', 'Client simulation mode'],
      },
    ],
  },
];
