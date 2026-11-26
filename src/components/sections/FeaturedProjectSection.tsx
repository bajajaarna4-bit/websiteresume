'use client';

import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Layers,
  Lightbulb,
  Shield,
} from 'lucide-react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { FEATURED_PROJECTS } from '@/content/featured-project';
import { cn } from '@/lib/utils';

type TabId = 'overview' | 'architecture' | 'learnings';

export function FeaturedProjectSection() {
  const [selectedSlug, setSelectedSlug] = useState<string>(FEATURED_PROJECTS[0]?.slug ?? 'nova-os');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    FEATURED_PROJECTS[0]?.architectureNodes[0]?.id ?? '',
  );

  const project =
    FEATURED_PROJECTS.find((item) => item.slug === selectedSlug) ?? FEATURED_PROJECTS[0];

  if (!project) return null;

  const activeNode =
    project.architectureNodes.find((n) => n.id === selectedNodeId) ??
    project.architectureNodes[0];

  const handleSelectProject = (slug: string): void => {
    setSelectedSlug(slug);
    const nextProject = FEATURED_PROJECTS.find((item) => item.slug === slug);
    setSelectedNodeId(nextProject?.architectureNodes[0]?.id ?? '');
  };

  return (
    <section
      id="featured-project"
      data-section-id="featured-project"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <Layers className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>04 // Featured Engineering Deep-Dive</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Flagship Build: {project.name}
          </h2>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Switch featured project candidate"
        >
          {FEATURED_PROJECTS.map((item, idx) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleSelectProject(item.slug)}
              className={cn(
                'rounded-xl px-3 py-1.5 font-mono text-xs transition-colors',
                item.slug === project.slug
                  ? 'bg-sky-400 font-semibold text-slate-950'
                  : 'border border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600',
              )}
            >
              {idx === 0 ? `#1 ${item.name}` : item.name}
            </button>
          ))}
        </div>
      </div>

      <DraggableWindow
        title={`CASE STUDY // ${project.name.toUpperCase()}`}
        pathLabel={`~/repos/bajajaarna4-bit/${project.name}`}
        badge={
          <span className="rounded-full bg-sky-400/15 px-2.5 py-0.5 font-mono text-[10px] text-sky-300">
            DEEP DIVE
          </span>
        }
      >
        <div className="mb-5 rounded-xl border border-sky-400/25 bg-sky-400/5 px-4 py-2.5 font-mono text-xs text-sky-200">
          {project.rankReason}
        </div>

        <div
          className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4"
          role="tablist"
          aria-label="Case study sections"
        >
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'overview', label: 'Problem & Stack' },
                { id: 'architecture', label: 'Interactive Architecture' },
                { id: 'learnings', label: 'Highlights & Learnings' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 font-mono text-xs transition-colors',
                  activeTab === tab.id
                    ? 'border border-sky-400/40 bg-sky-400/15 text-sky-200'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 font-mono text-xs text-slate-200 hover:border-sky-400/50"
            >
              GitHub Repo
              <ExternalLink className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
            </a>
            {project.liveDemoUrl ? (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400 px-3 py-1.5 font-mono text-xs font-semibold text-slate-950 hover:bg-sky-300"
              >
                Live Demo
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <span className="rounded-lg border border-dashed border-slate-700 px-3 py-1.5 font-mono text-[11px] text-slate-400">
                [TODO: Live Demo URL]
              </span>
            )}
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <p className="text-base leading-relaxed font-medium text-white">{project.tagline}</p>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="font-mono text-xs tracking-wider text-rose-300 uppercase">
                  Problem
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{project.problem}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="font-mono text-xs tracking-wider text-emerald-300 uppercase">
                  Engineering Solution
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{project.solution}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 lg:col-span-5">
              <h3 className="flex items-center gap-2 font-mono text-xs tracking-wider text-slate-300 uppercase">
                <Cpu className="h-4 w-4 text-sky-400" aria-hidden="true" />
                Verified Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 font-mono text-xs text-sky-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-3">
                <p className="font-mono text-[11px] text-slate-400 uppercase">
                  Repository Evidence
                </p>
                <ul className="mt-2 space-y-2 text-xs text-slate-300">
                  {project.verifiedHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'architecture' ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {project.architectureNodes.map((node, idx) => (
                <div key={node.id} className="flex flex-1 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={cn(
                      'w-full rounded-xl border p-3 text-left transition-colors',
                      activeNode?.id === node.id
                        ? 'border-sky-400 bg-sky-400/15 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700',
                    )}
                  >
                    <p className="font-mono text-[10px] text-sky-300 uppercase">{node.layer}</p>
                    <p className="mt-1 text-xs font-semibold">{node.label}</p>
                  </button>
                  {idx < project.architectureNodes.length - 1 ? (
                    <ArrowRight
                      className="hidden h-4 w-4 shrink-0 text-sky-400/70 lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {activeNode ? (
              <div className="rounded-xl border border-sky-400/30 bg-slate-950/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                    <Shield className="h-4 w-4 text-sky-400" aria-hidden="true" />
                    {activeNode.label}
                  </h3>
                  <span className="rounded bg-sky-400/15 px-2 py-0.5 font-mono text-[11px] text-sky-300">
                    {activeNode.layer}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{activeNode.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeNode.controls.map((ctrl) => (
                    <span
                      key={ctrl}
                      className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-200"
                    >
                      {ctrl}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'learnings' ? (
          <div className="space-y-3">
            {project.learnings.map((learning) => (
              <div
                key={learning}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <span>{learning}</span>
              </div>
            ))}
          </div>
        ) : null}
      </DraggableWindow>
    </section>
  );
}
