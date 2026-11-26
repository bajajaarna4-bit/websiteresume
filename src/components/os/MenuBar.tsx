'use client';

import { useEffect, useState } from 'react';
import { Activity, Command, Sparkles, Terminal } from 'lucide-react';
import { type SectionId, useOS } from '@/components/motion/AppProviders';
import { cn } from '@/lib/utils';

const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'Overview',
  philosophy: 'Philosophy',
  'github-live': 'GitHub Live',
  'featured-project': 'Featured Project',
  'ai-lab': 'AI Lab',
  'startup-idea': 'Startup Concept',
  'podcast-stage': 'Podcast & Stage',
  'security-lab': 'Security Lab',
  contact: 'Contact',
};

interface MenuBarProps {
  nowBuildingRepo: string;
  nowBuildingUrl: string;
}

export function MenuBar({ nowBuildingRepo, nowBuildingUrl }: MenuBarProps) {
  const { activeSection, scrollToSection, reducedMotion, toggleReducedMotion, setCommandPaletteOpen } =
    useOS();
  const [clockText, setClockText] = useState<string>('--:--');

  useEffect(() => {
    const updateClock = (): void => {
      const now = new Date();
      setClockText(
        new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now),
      );
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-[#06080d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 font-mono text-xs font-semibold tracking-wider text-slate-100 transition-colors hover:text-sky-300"
          >
            <Terminal className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
            <span>BAJAJ.OS</span>
          </button>
          <span className="hidden text-slate-600 sm:inline" aria-hidden="true">
            /
          </span>
          <span className="hidden truncate font-mono text-xs text-slate-300 sm:inline">
            {SECTION_LABELS[activeSection]}
          </span>
          <nav aria-label="Quick sections" className="ml-2 hidden items-center gap-1 lg:flex">
            {(['github-live', 'featured-project', 'security-lab', 'contact'] as const).map(
              (id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs transition-colors',
                    activeSection === id
                      ? 'bg-sky-400/15 text-sky-200'
                      : 'text-slate-400 hover:text-slate-100',
                  )}
                >
                  {SECTION_LABELS[id]}
                </button>
              ),
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={nowBuildingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 font-mono text-[11px] text-sky-200 transition-colors hover:border-sky-400/60 md:inline-flex"
            title={`Active GitHub repository: ${nowBuildingRepo}`}
          >
            <Activity className="h-3 w-3 text-sky-400" aria-hidden="true" />
            <span className="max-w-36 truncate">Building: {nowBuildingRepo}</span>
          </a>

          <button
            type="button"
            onClick={toggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-label={reducedMotion ? 'Enable full motion effects' : 'Reduce motion effects'}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[11px] transition-colors',
              reducedMotion
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
                : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700',
            )}
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">{reducedMotion ? 'Calm' : 'FX On'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Open Command Palette"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/80 px-2 py-1 font-mono text-[11px] text-slate-200 transition-colors hover:border-sky-400/40 hover:text-sky-200"
          >
            <Command className="h-3 w-3 text-sky-400" aria-hidden="true" />
            <span>K</span>
          </button>

          <time
            suppressHydrationWarning
            className="hidden font-mono text-xs text-slate-300 tabular-nums sm:inline"
          >
            {clockText}
          </time>
        </div>
      </div>
    </header>
  );
}
