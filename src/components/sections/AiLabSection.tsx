'use client';

import { useState } from 'react';
import { BrainCircuit, GitBranch, Sparkles } from 'lucide-react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { AI_LAB_NODES } from '@/content/ai-lab';
import { cn } from '@/lib/utils';

export function AiLabSection() {
  const [viewMode, setViewMode] = useState<'constellation' | 'timeline'>('constellation');
  const [selectedId, setSelectedId] = useState<string>(AI_LAB_NODES[0]?.id ?? '');

  const activeNode = AI_LAB_NODES.find((node) => node.id === selectedId) ?? AI_LAB_NODES[0];

  return (
    <section
      id="ai-lab"
      data-section-id="ai-lab"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <BrainCircuit className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>05 // AI Lab & Curiosity Graph</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            AI Tools &amp; Learning Constellation
          </h2>
        </div>

        <div className="flex gap-2" role="group" aria-label="AI Lab layout mode">
          <button
            type="button"
            onClick={() => setViewMode('constellation')}
            className={cn(
              'rounded-xl px-3 py-1.5 font-mono text-xs transition-colors',
              viewMode === 'constellation'
                ? 'bg-sky-400 font-semibold text-slate-950'
                : 'border border-slate-800 bg-slate-900/70 text-slate-300',
            )}
          >
            Constellation
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={cn(
              'rounded-xl px-3 py-1.5 font-mono text-xs transition-colors',
              viewMode === 'timeline'
                ? 'bg-sky-400 font-semibold text-slate-950'
                : 'border border-slate-800 bg-slate-900/70 text-slate-300',
            )}
          >
            Timeline
          </button>
        </div>
      </div>

      <DraggableWindow
        title="AI LAB // EXPLORATION GRAPH"
        pathLabel="~/labs/ai-curiosity"
        badge={
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-300">
            TODO PLACEHOLDERS
          </span>
        }
      >
        <p className="mb-5 rounded-xl border border-amber-400/25 bg-amber-400/5 px-4 py-2.5 font-mono text-xs text-amber-200">
          Honesty Policy: Entries below are structured <code>TODO</code> slots awaiting your
          verified AI tool notes and experiment dates—zero fabricated claims.
        </p>

        {viewMode === 'constellation' ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {AI_LAB_NODES.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  className={cn(
                    'flex flex-col items-start rounded-xl border p-4 text-left transition-all',
                    selectedId === node.id
                      ? 'border-sky-400 bg-sky-400/15 shadow-lg shadow-sky-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700',
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-amber-300">{node.slotLabel}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                      {node.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{node.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{node.summary}</p>
                </button>
              ))}
            </div>

            {activeNode ? (
              <div className="flex flex-col justify-between rounded-xl border border-sky-400/30 bg-slate-950/70 p-5 lg:col-span-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-sky-300">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      {activeNode.category}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{activeNode.quarter}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{activeNode.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {activeNode.summary}
                  </p>
                </div>

                <div className="mt-6 rounded-lg border border-dashed border-amber-400/35 bg-amber-400/5 p-3 font-mono text-xs text-amber-200">
                  {activeNode.experimentPrompt}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <ol className="space-y-3 border-l border-slate-800 pl-5">
            {AI_LAB_NODES.map((node) => (
              <li
                key={node.id}
                className="relative rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-5 -left-[25px] h-2.5 w-2.5 rounded-full border border-sky-300 bg-sky-400"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                    <span className="font-mono text-xs text-amber-300">{node.slotLabel}</span>
                    <span className="text-sm font-semibold text-white">{node.title}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{node.quarter}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300">{node.summary}</p>
              </li>
            ))}
          </ol>
        )}
      </DraggableWindow>
    </section>
  );
}
