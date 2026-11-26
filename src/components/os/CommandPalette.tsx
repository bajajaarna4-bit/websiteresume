'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink, Search, Sparkles, X } from 'lucide-react';
import { type SectionId, useOS } from '@/components/motion/AppProviders';
import { cn } from '@/lib/utils';

interface PaletteAction {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  perform: () => void;
}

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    scrollToSection,
    reducedMotion,
    toggleReducedMotion,
  } = useOS();
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copiedGitHub, setCopiedGitHub] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const closePalette = useCallback((): void => {
    setQuery('');
    setSelectedIndex(0);
    setCommandPaletteOpen(false);
  }, [setCommandPaletteOpen]);

  const actions = useMemo<PaletteAction[]>(() => {
    const jump = (sectionId: SectionId): void => {
      closePalette();
      scrollToSection(sectionId);
    };

    return [
      {
        id: 'nav-hero',
        label: 'Go to Hero & Now Building',
        hint: 'Overview',
        keywords: 'hero home overview jarvis orb',
        perform: () => jump('hero'),
      },
      {
        id: 'nav-philosophy',
        label: 'Go to Philosophy (Try > Think)',
        hint: 'Story',
        keywords: 'philosophy try think action story',
        perform: () => jump('philosophy'),
      },
      {
        id: 'nav-github',
        label: 'Go to GitHub Live Telemetry',
        hint: 'Repos & Commits',
        keywords: 'github repos commits languages stars',
        perform: () => jump('github-live'),
      },
      {
        id: 'nav-featured',
        label: 'Go to Featured Project Deep-Dive',
        hint: 'Case Study',
        keywords: 'featured project nova-os architecture',
        perform: () => jump('featured-project'),
      },
      {
        id: 'nav-ai-lab',
        label: 'Go to AI Lab Constellation',
        hint: 'Tools & Timeline',
        keywords: 'ai lab tools experiments constellation',
        perform: () => jump('ai-lab'),
      },
      {
        id: 'nav-startup',
        label: 'Go to Startup Concept (Transit + Stays)',
        hint: 'Prototype',
        keywords: 'startup idea travel transportation airbnb prototype',
        perform: () => jump('startup-idea'),
      },
      {
        id: 'nav-podcast',
        label: 'Go to Podcast, Stage & Topic Roulette',
        hint: 'Audio + Talks',
        keywords: 'podcast stage speaker audio roulette topic',
        perform: () => jump('podcast-stage'),
      },
      {
        id: 'nav-security',
        label: 'Launch Security Lab (Attack vs Defend)',
        hint: 'Sandbox',
        keywords: 'security lab attack defend sqli xss csrf csp hashing',
        perform: () => jump('security-lab'),
      },
      {
        id: 'nav-contact',
        label: 'Open Contact Comms Channel',
        hint: 'Message',
        keywords: 'contact email hire message',
        perform: () => jump('contact'),
      },
      {
        id: 'toggle-motion',
        label: reducedMotion ? 'Enable Full Motion Effects' : 'Switch to Calm / Reduced Motion',
        hint: 'Accessibility',
        keywords: 'motion reduced calm accessibility animation',
        perform: () => {
          toggleReducedMotion();
          closePalette();
        },
      },
      {
        id: 'copy-github',
        label: copiedGitHub ? 'Copied GitHub Profile URL' : 'Copy GitHub Profile URL',
        hint: 'bajajaarna4-bit',
        keywords: 'copy github url link',
        perform: () => {
          void navigator.clipboard?.writeText('https://github.com/bajajaarna4-bit');
          setCopiedGitHub(true);
          window.setTimeout(() => setCopiedGitHub(false), 1600);
        },
      },
      {
        id: 'open-github',
        label: 'Open github.com/bajajaarna4-bit in New Tab',
        hint: 'External',
        keywords: 'external github profile',
        perform: () => {
          window.open('https://github.com/bajajaarna4-bit', '_blank', 'noopener,noreferrer');
          closePalette();
        },
      },
    ];
  }, [closePalette, copiedGitHub, reducedMotion, scrollToSection, toggleReducedMotion]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q),
    );
  }, [actions, query]);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePalette();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0,
        );
      } else if (event.key === 'Enter') {
        const chosen = filtered[selectedIndex];
        if (chosen) {
          event.preventDefault();
          chosen.perform();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closePalette, commandPaletteOpen, filtered, selectedIndex]);

  if (!commandPaletteOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="BAJAJ.OS Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#04060b]/75 px-4 pt-20 backdrop-blur-md"
      onClick={closePalette}
    >
      <div
        className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl border border-sky-400/35"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Jump to section, run Security Lab, toggle FX..."
            aria-label="Search OS commands"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={closePalette}
            aria-label="Close Command Palette"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <ul role="listbox" aria-label="Command results" className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center font-mono text-xs text-slate-400">
              No matching OS command. Try &quot;security&quot;, &quot;github&quot;, or &quot;startup&quot;.
            </li>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <li key={item.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={item.perform}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                      isSelected
                        ? 'bg-sky-400/15 text-sky-100'
                        : 'text-slate-300 hover:bg-slate-800/70',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.id === 'copy-github' ? (
                        copiedGitHub ? (
                          <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                        ) : (
                          <Copy className="h-4 w-4 text-sky-400" aria-hidden="true" />
                        )
                      ) : item.id === 'open-github' ? (
                        <ExternalLink className="h-4 w-4 text-sky-400" aria-hidden="true" />
                      ) : item.id === 'toggle-motion' ? (
                        <Sparkles className="h-4 w-4 text-sky-400" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-sky-400" aria-hidden="true" />
                      )}
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{item.hint}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
