export interface PodcastEpisodePlaceholder {
  id: string;
  episodeLabel: string;
  title: string;
  durationLabel: string;
  durationSeconds: number;
  topicTag: string;
  summary: string;
  baseFreqHz: number;
}

export interface RouletteTopic {
  id: string;
  prompt: string;
  hook: string;
  tryActionAngle: string;
  takeaway: string;
}

// TODO(portfolio-data): Replace placeholder episodes and audio URLs with real recorded sessions.
export const PODCAST_EPISODES: PodcastEpisodePlaceholder[] = [
  {
    id: 'ep-01',
    episodeLabel: '[TODO: EP 01]',
    title: '[TODO: Episode Title — Why Shipping Ugly Beats Planning Pretty]',
    durationLabel: '03:00 (Preview Synth)',
    durationSeconds: 180,
    topicTag: 'Bias to Action',
    summary:
      'Placeholder card for a real talk or audio note on momentum, shipping imperfect v0.1s, and debugging in public.',
    baseFreqHz: 196,
  },
  {
    id: 'ep-02',
    episodeLabel: '[TODO: EP 02]',
    title: '[TODO: Episode Title — Learning Systems From Linux Upwards]',
    durationLabel: '04:00 (Preview Synth)',
    durationSeconds: 240,
    topicTag: 'Systems & OS',
    summary:
      'Placeholder card for discussing immutable Linux builds, shell scripting, and security boundaries.',
    baseFreqHz: 220,
  },
  {
    id: 'ep-03',
    episodeLabel: '[TODO: EP 03]',
    title: '[TODO: Episode Title — Speaking About Random Ideas Without Fear]',
    durationLabel: '02:30 (Preview Synth)',
    durationSeconds: 150,
    topicTag: 'Stage & Curiosity',
    summary:
      'Placeholder card for spontaneous talks, connecting unrelated domains, and thinking out loud.',
    baseFreqHz: 246.94,
  },
];

export const ROULETTE_TOPICS: RouletteTopic[] = [
  {
    id: 'topic-1',
    prompt: 'Why a 48-hour hackathon prototype teaches more than 4 months of reading docs',
    hook: 'Start with a live crash or broken commit from hour 19 and show what it uncovered.',
    tryActionAngle: 'Compare hypothetical perfection with real compiler feedback loops.',
    takeaway: 'Ship something runnable tonight, even if only one endpoint works.',
  },
  {
    id: 'topic-2',
    prompt: 'Designing an OS that treats every AI tool call like an untrusted boundary',
    hook: 'What happens if your assistant can execute terminal commands without policy checks?',
    tryActionAngle: 'Demo allowlists, read-only scopes, and hash-chained logs in plain English.',
    takeaway: 'Capability without guardrails slows teams down; clean boundaries unlock speed.',
  },
  {
    id: 'topic-3',
    prompt: 'Why transportation and rentable stays belong in one itinerary graph',
    hook: 'Ask the audience how many tabs they open for a single weekend trip.',
    tryActionAngle: 'Walk through how a 45-minute train delay cascades across cabs and host check-ins.',
    takeaway: 'The best product opportunities hide in the handoff gaps between existing apps.',
  },
  {
    id: 'topic-4',
    prompt: 'Debugging in public: why messy Git histories signal real growth',
    hook: 'Show two real fix commits back-to-back and celebrate what broke in between.',
    tryActionAngle: 'Normalize honest engineering logs over curated perfection.',
    takeaway: 'Keep a visible changelog of attempts; consistency compounds faster than brilliance.',
  },
  {
    id: 'topic-5',
    prompt: 'Why web security fundamentals should be interactive, not dry PDFs',
    hook: 'Toggle Vulnerable vs Hardened live and watch attacker vs defender logs diverge.',
    tryActionAngle: 'Teach SQLi, XSS, and CSP visually using safe local mocks.',
    takeaway: 'Builders remember defenses they have seen break in safe sandboxes.',
  },
];
