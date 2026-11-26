'use client';

export function JarvisFallback({ statusLabel = 'JARVIS HUD // STANDBY' }: { statusLabel?: string }) {
  return (
    <div
      aria-label="JARVIS Core visual display"
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-sky-400/20 bg-radial from-sky-500/12 via-slate-950/60 to-transparent"
    >
      <svg
        viewBox="0 0 260 260"
        className="h-56 w-56 text-sky-400/80 sm:h-64 sm:w-64"
        aria-hidden="true"
      >
        <circle
          cx="130"
          cy="130"
          r="98"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <circle
          cx="130"
          cy="130"
          r="72"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="24 10"
        />
        <circle
          cx="130"
          cy="130"
          r="46"
          fill="rgba(56, 189, 248, 0.1)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="130" cy="130" r="14" fill="currentColor" fillOpacity="0.85" />
      </svg>
      {statusLabel ? (
        <span className="absolute bottom-3 z-20 rounded-full border border-sky-400/30 bg-slate-950/90 px-3 py-1 font-mono text-[10px] tracking-widest text-sky-300 uppercase">
          {statusLabel}
        </span>
      ) : null}
    </div>
  );
}
