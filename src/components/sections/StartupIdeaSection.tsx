'use client';

import { useState } from 'react';
import { Clock, Home, MapPin, Plane, Car, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { STARTUP_CONCEPT } from '@/content/startup-idea';
import { cn } from '@/lib/utils';

export function StartupIdeaSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simulateDelay, setSimulateDelay] = useState<boolean>(false);
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);

  const currentLeg = STARTUP_CONCEPT.flowSteps[activeStep] ?? STARTUP_CONCEPT.flowSteps[0];

  const stepIcons = [Plane, Home, Car, MapPin];

  return (
    <section
      id="startup-idea"
      data-section-id="startup-idea"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      {/* 1 Headline & 1 Supporting Line */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <Plane className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>06 // Startup Concept Lab</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            {STARTUP_CONCEPT.title}
          </h2>
        </div>

        <p className="max-w-md text-sm font-normal text-slate-300">
          Hypothesis prototype merging autonomous door-to-door transit and bookings.
        </p>
      </div>

      <DraggableWindow
        title="CONCEPT // TRANSIT + STAYS OS"
        pathLabel="~/ventures/unified-mobility-stays"
        badge={
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-300">
            HYPOTHESIS PROTOTYPE
          </span>
        }
      >
        {/* Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulateDelay((prev) => !prev)}
              aria-pressed={simulateDelay}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-mono text-xs transition-colors',
                simulateDelay
                  ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-400/40',
              )}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {simulateDelay ? 'Delay Active (+45m)' : 'Simulate Transit Delay'}
            </button>

            <button
              type="button"
              onClick={() => setShowPitchModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-slate-600"
            >
              <FileText className="h-3.5 w-3.5 text-sky-400" />
              <span>Read Pitch</span>
            </button>
          </div>

          <span className="font-mono text-[11px] text-slate-400">
            {simulateDelay ? 'Status: Rescheduled dynamically' : 'Status: Optimal routing'}
          </span>
        </div>

        {/* 3-Step Animated Flow: Travel > Stay > Ride */}
        <div className="grid gap-3 sm:grid-cols-4">
          {STARTUP_CONCEPT.flowSteps.map((step, idx) => {
            const Icon = stepIcons[idx] ?? MapPin;
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                  isSelected
                    ? 'border-sky-400 bg-sky-400/15 shadow-md shadow-sky-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-900 text-sky-400',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-sky-300">0{step.step}</p>
                  <p className="truncate text-xs font-semibold text-white">{step.title.replace(/^\d+\.\s*/, '')}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Live Telemetry */}
        {currentLeg ? (
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-sky-300">
                {currentLeg.title}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                {currentLeg.actor}
              </span>
            </div>

            <p
              className={cn(
                'mt-3 rounded-lg border px-3 py-2 text-xs font-mono',
                simulateDelay
                  ? 'border-amber-400/35 bg-amber-400/10 text-amber-200'
                  : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
              )}
            >
              {simulateDelay ? currentLeg.delayedState : currentLeg.normalState}
            </p>
          </div>
        ) : null}
      </DraggableWindow>

      {/* Progressive Disclosure: Full Pitch & Hypotheses Modal */}
      <AnimatePresence>
        {showPitchModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Startup Pitch & Hypotheses"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPitchModal(false)}
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
                  Venture Thesis // Pitch
                </span>
                <button
                  type="button"
                  onClick={() => setShowPitchModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <h4 className="font-mono text-rose-300 uppercase">Problem</h4>
                  <p className="mt-1">{STARTUP_CONCEPT.problem}</p>
                </div>

                <div>
                  <h4 className="font-mono text-emerald-300 uppercase">Proposed Solution</h4>
                  <p className="mt-1">{STARTUP_CONCEPT.solution}</p>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <h4 className="font-mono text-amber-300 uppercase">Hypotheses</h4>
                  <ul className="mt-1.5 space-y-2">
                    {STARTUP_CONCEPT.hypotheses.map((h) => (
                      <li key={h.label} className="rounded-lg bg-slate-900/60 p-2.5">
                        <span className="font-semibold text-white">{h.label}: </span>
                        <span>{h.claim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
