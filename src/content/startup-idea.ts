export interface PrototypeLeg {
  step: number;
  title: string;
  actor: string;
  normalState: string;
  delayedState: string;
  hypothesisNote: string;
}

export const STARTUP_CONCEPT = {
  title: 'Unified Mobility + Travel + Rentable Stays',
  subtitle:
    'One continuous itinerary engine bridging inter-city transport, last-mile rides, and Airbnb-style rentable stays.',
  problem:
    'Travelers stitch together separate apps for rail/flights, local rides, and short-term stays. When one transit leg slips by 45 minutes, host check-ins, ride pickups, and refunds break independently.',
  solution:
    'Model transportation legs and rentable stays as synchronized state nodes in a single itinerary graph—auto-notifying hosts, re-timing last-mile transfers, and bundling safety check-ins into one checkout.',
  hypotheses: [
    {
      label: 'Hypothesis: Booking Drop-Off',
      claim:
        'Coupling transit + stay availability into one checkout may reduce multi-tab booking abandonment for solo & weekend travelers.',
    },
    {
      label: 'Hypothesis: Delay Re-Sync Value',
      claim:
        'Automatic check-in window adjustments when inbound transit delays could reduce host-guest coordination friction.',
    },
    {
      label: 'Hypothesis: Trust & Safety Layer',
      claim:
        'Verified arrival check-ins shared across transit and stay legs may increase adoption among solo travelers.',
    },
  ],
  flowSteps: [
    {
      step: 1,
      title: '1. Route + Stay Pairing',
      actor: 'Traveler Intent',
      normalState: 'Selects origin, budget ceiling, and stay preference (10m walk from station).',
      delayedState: 'Selects origin, budget ceiling, and stay preference (10m walk from station).',
      hypothesisNote: 'Hypothesis: Filtering stays by true door-to-door transit time saves search loops.',
    },
    {
      step: 2,
      title: '2. Inter-City Transit Leg',
      actor: 'Rail / Bus / Air Feed',
      normalState: 'On-time departure at 08:15; ETA 11:30 triggers pre-reserved last-mile cab.',
      delayedState: 'Inbound train delayed +45m; new ETA 12:15 detected automatically.',
      hypothesisNote: 'Hypothesis: Real-time ETA webhooks eliminate manual text updates to drivers.',
    },
    {
      step: 3,
      title: '3. Stay & Key Handover Sync',
      actor: 'Host Smart-Lock / Host App',
      normalState: 'Smart check-in window opens 11:45–12:30 seamlessly upon cab arrival.',
      delayedState: 'Platform automatically shifts check-in slot to 12:30–13:15 and notifies host.',
      hypothesisNote: 'Hypothesis: Automated check-in re-sync lowers late-arrival cancellation disputes.',
    },
    {
      step: 4,
      title: '4. Unified Safety & Escrow',
      actor: 'Settlement Layer',
      normalState: 'Single split payout executes after verified arrival check-in.',
      delayedState: 'Wait-fee protection / re-booking credit evaluates cleanly under one policy.',
      hypothesisNote: 'Hypothesis: Unified trip protection beats fragmented single-leg insurance add-ons.',
    },
  ] satisfies PrototypeLeg[],
};
