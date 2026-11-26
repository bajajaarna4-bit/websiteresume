'use client';

import { useState } from 'react';
import { BrainCircuit, GitBranch, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { AI_LAB_NODES, type AiLabNode } from '@/content/ai-lab';
import { cn } from '@/lib/utils';

export function AiLabSection() {
  const [viewMode, setViewMode] = useState<'constellation' | 'timeline'>('constellation');
  const [inspectNode, setInspectNode] = useState<AiLabNode | null>(null);

  return (
    <section
      id="ai-lab"
      data-section-id="ai-lab"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      {/* 1 Headline & 1 Supporting Line */}
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

        <p className="max-w-md text-sm font-normal text-slate-300">
          Interactive exploration graph of frontier model architectures and agents.
        </p>
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
        <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-mono text-xs text-slate-400">Layout Mode</span>
          <div className="flex gap-1.5" role="group" aria-label="AI Lab layout mode">
            <button
              type="button"
              onClick={() => setViewMode('constellation')}
              className={cn(
                'rounded-lg px-2.5 py-1 font-mono text-xs transition-colors',
                viewMode === 'constellation'
                  ? 'bg-sky-400 font-semibold text-slate-950'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200',
              )}
            >
              Constellation
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={cn(
                'rounded-lg px-2.5 py-1 font-mono text-xs transition-colors',
                viewMode === 'timeline'
                  ? 'bg-sky-400 font-semibold text-slate-950'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200',
              )}
            >
              Timeline
            </button>
          </div>
        </div>

        {viewMode === 'constellation' ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AI_LAB_NODES.map((node) => (
              <div
                key={node.id}
                onClick={() => setInspectNode(node)}
                className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-sky-400/50 hover:bg-slate-900/50"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-amber-300">{node.slotLabel}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                      {node.category}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white group-hover:text-sky-300">
                    {node.title}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono text-[10px] text-slate-400">
                  <span>{node.quarter}</span>
                  <span className="text-sky-400">Inspect ↗</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ol className="space-y-2.5 border-l border-slate-800 pl-4">
            {AI_LAB_NODES.map((node) => (
              <li
                key={node.id}
                onClick={() => setInspectNode(node)}
                className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/50 p-3 transition-colors hover:border-sky-400/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-3.5 w-3.5 text-sky-400" />
                    <span className="font-mono text-xs font-semibold text-amber-300">
                      {node.slotLabel}
                    </span>
                    <span className="text-xs text-white">{node.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{node.quarter}</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </DraggableWindow>

      {/* Progressive Disclosure: Node Details Modal */}
      <AnimatePresence>
        {inspectNode ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI Lab Node Details"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectNode(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel relative z-10 w-full max-w-md rounded-2xl border border-sky-400/30 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="inline-flex items-center gap-1 font-mono text-xs text-sky-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  {inspectNode.slotLabel} · {inspectNode.category}
                </span>
                <button
                  type="button"
                  onClick={() => setInspectNode(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mt-3 text-base font-semibold text-white">{inspectNode.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{inspectNode.summary}</p>

              <div className="mt-4 rounded-xl border border-dashed border-amber-400/35 bg-amber-400/5 p-3 font-mono text-xs text-amber-200">
                {inspectNode.experimentPrompt}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
