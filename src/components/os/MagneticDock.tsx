'use client';

import { useState } from 'react';
import {
  BrainCircuit,
  Compass,
  FolderGit2,
  Home,
  Layers,
  Mail,
  Mic,
  Plane,
  ShieldCheck,
} from 'lucide-react';
import { type SectionId, useOS } from '@/components/motion/AppProviders';
import { cn } from '@/lib/utils';

interface DockItem {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'philosophy', label: 'Try > Think', icon: Compass },
  { id: 'github-live', label: 'GitHub', icon: FolderGit2 },
  { id: 'featured-project', label: 'Featured', icon: Layers },
  { id: 'ai-lab', label: 'AI Lab', icon: BrainCircuit },
  { id: 'startup-idea', label: 'Startup', icon: Plane },
  { id: 'podcast-stage', label: 'Stage', icon: Mic },
  { id: 'security-lab', label: 'SecLab', icon: ShieldCheck },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export function MagneticDock() {
  const { activeSection, scrollToSection, reducedMotion } = useOS();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav
      aria-label="OS Application Dock"
      className="fixed bottom-3 left-1/2 z-40 max-w-[calc(100vw-1rem)] -translate-x-1/2"
    >
      <div
        onMouseLeave={() => setHoveredIndex(null)}
        className="glass-panel flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-700/60 px-2 py-1.5 sm:gap-1.5 sm:px-3 sm:py-2"
      >
        {DOCK_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const distance = hoveredIndex === null ? 99 : Math.abs(hoveredIndex - idx);
          const scaleClass =
            reducedMotion || hoveredIndex === null
              ? 'scale-100 translate-y-0'
              : distance === 0
                ? 'md:scale-125 md:-translate-y-1.5'
                : distance === 1
                  ? 'md:scale-110 md:-translate-y-0.5'
                  : 'scale-100 translate-y-0';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => setHoveredIndex(idx)}
              aria-label={`Jump to ${item.label}`}
              aria-current={isActive ? 'location' : undefined}
              title={item.label}
              className={cn(
                'group relative flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl transition-transform duration-150 will-change-transform sm:h-10 sm:w-10',
                scaleClass,
                isActive
                  ? 'border border-sky-400/45 bg-sky-400/15 text-sky-300'
                  : 'border border-transparent bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-100',
              )}
            >
              <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden={true} />
              <span
                className={cn(
                  'pointer-events-none absolute -top-8 hidden rounded-md border border-slate-700 bg-slate-950/95 px-2 py-0.5 font-mono text-[10px] whitespace-nowrap text-slate-100 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block',
                )}
              >
                {item.label}
              </span>
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 h-1 w-1 rounded-full bg-sky-400"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
