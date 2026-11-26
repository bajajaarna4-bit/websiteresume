'use client';

import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Shield,
  FileText,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [showOverviewModal, setShowOverviewModal] = useState<boolean>(false);

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
      {/* 1 Headline & 1 Supporting Line */}
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

        <p className="max-w-md text-sm font-normal text-slate-300">
          Zero-trust developer operating system with hardware-isolated execution.
        </p>
      </div>

      {/* Hero Visual + 3 Stat Chips */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Switch featured project candidate">
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

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-sky-200">
          <span className="rounded-lg border border-sky-400/25 bg-sky-400/10 px-2.5 py-1">
            96 Commits
          </span>
          <span className="rounded-lg border border-sky-400/25 bg-sky-400/10 px-2.5 py-1">
            v0.1.0 Kernel
          </span>
          <span className="rounded-lg border border-sky-400/25 bg-sky-400/10 px-2.5 py-1">
            SELinux
          </span>
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
        <div
          className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"
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
                    ? 'border border-sky-400/40 bg-sky-400/15 text-sky-200 font-semibold'
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
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-white">{project.tagline}</p>
              <button
                type="button"
                onClick={() => setShowOverviewModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-200 hover:border-sky-400/40"
              >
                <FileText className="h-3.5 w-3.5 text-sky-400" />
                <span>Read Full Brief</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[11px] text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'architecture' ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              {project.architectureNodes.map((node, idx) => (
                <div key={node.id} className="flex flex-1 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={cn(
                      'w-full rounded-xl border p-2.5 text-left transition-colors',
                      activeNode?.id === node.id
                        ? 'border-sky-400 bg-sky-400/15 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200',
                    )}
                  >
                    <p className="font-mono text-[10px] text-sky-300 uppercase">{node.layer}</p>
                    <p className="mt-0.5 text-xs font-semibold">{node.label}</p>
                  </button>
                  {idx < project.architectureNodes.length - 1 ? (
                    <ArrowRight
                      className="hidden h-3.5 w-3.5 shrink-0 text-slate-600 lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {activeNode ? (
              <div className="rounded-xl border border-sky-400/30 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Shield className="h-4 w-4 text-sky-400" aria-hidden="true" />
                    {activeNode.label}
                  </h3>
                  <span className="rounded bg-sky-400/15 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                    {activeNode.layer}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300">{activeNode.summary}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {activeNode.controls.map((ctrl) => (
                    <span
                      key={ctrl}
                      className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[11px] text-slate-300"
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
          <div className="space-y-2">
            {project.verifiedHighlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ) : null}
      </DraggableWindow>

      {/* Progressive Disclosure: Full Problem & Solution Modal */}
      <AnimatePresence>
        {showOverviewModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Case Study Overview"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverviewModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel relative z-10 w-full max-w-lg rounded-2xl border border-sky-400/30 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs text-sky-300 uppercase">
                  {project.name} {'//'} Architectural Brief
                </span>
                <button
                  type="button"
                  onClick={() => setShowOverviewModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-300">
                <div>
                  <h4 className="font-mono text-rose-300 uppercase">Problem</h4>
                  <p className="mt-1">{project.problem}</p>
                </div>
                <div>
                  <h4 className="font-mono text-emerald-300 uppercase">Engineering Solution</h4>
                  <p className="mt-1">{project.solution}</p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
