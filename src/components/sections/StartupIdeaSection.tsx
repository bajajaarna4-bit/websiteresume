'use client';

import { useState } from 'react';
import { Clock, FlaskConical, MapPin, Plane, RefreshCw, ShieldCheck } from 'lucide-react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { STARTUP_CONCEPT } from '@/content/startup-idea';
import { cn } from '@/lib/utils';

export function StartupIdeaSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simulateDelay, setSimulateDelay] = useState<boolean>(false);

  const currentLeg = STARTUP_CONCEPT.flowSteps[activeStep] ?? STARTUP_CONCEPT.flowSteps[0];

  return (
    <section
      id="startup-idea"
      data-section-id="startup-idea"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
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

        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-xs text-amber-200">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          All Market Claims = Hypotheses
        </span>
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
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <p className="text-sm leading-relaxed text-slate-200">{STARTUP_CONCEPT.subtitle}</p>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-mono text-xs tracking-wider text-rose-300 uppercase">Problem</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                {STARTUP_CONCEPT.problem}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-mono text-xs tracking-wider text-emerald-300 uppercase">
                Proposed Solution
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                {STARTUP_CONCEPT.solution}
              </p>
            </div>

            <div className="space-y-2">
              {STARTUP_CONCEPT.hypotheses.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3"
                >
                  <p className="font-mono text-[11px] font-semibold text-amber-300">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-300">{item.claim}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-sky-400/30 bg-slate-950/70 p-5 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <p className="font-mono text-xs tracking-wider text-sky-300 uppercase">
                    Interactive Prototype Walkthrough
                  </p>
                  <p className="text-xs text-slate-400">
                    Step through the user flow and test a +45m transit delay event.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSimulateDelay((prev) => !prev)}
                  aria-pressed={simulateDelay}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors',
                    simulateDelay
                      ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-400/40',
                  )}
                >
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {simulateDelay ? 'Delay Active (+45m)' : 'Simulate Transit Delay'}
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                {STARTUP_CONCEPT.flowSteps.map((step, idx) => (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      'rounded-xl border p-3 text-left transition-colors',
                      activeStep === idx
                        ? 'border-sky-400 bg-sky-400/15 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200',
                    )}
                  >
                    <p className="font-mono text-[10px] text-sky-300">STEP 0{step.step}</p>
                    <p className="mt-1 text-xs font-semibold">{step.title.replace(/^\d+\.\s*/, '')}</p>
                  </button>
                ))}
              </div>

              {currentLeg ? (
                <div className="mt-5 space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-sky-300">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {currentLeg.title}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      {currentLeg.actor}
                    </span>
                  </div>

                  <p
                    className={cn(
                      'rounded-lg border px-3 py-2.5 text-sm',
                      simulateDelay
                        ? 'border-amber-400/35 bg-amber-400/10 text-amber-100'
                        : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
                    )}
                  >
                    {simulateDelay ? currentLeg.delayedState : currentLeg.normalState}
                  </p>

                  <p className="flex items-center gap-2 font-mono text-xs text-amber-200/90">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
                    {currentLeg.hypothesisNote}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) % STARTUP_CONCEPT.flowSteps.length)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2 font-mono text-xs font-semibold text-slate-950 hover:bg-sky-300"
              >
                Advance Flow
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStep(0);
                  setSimulateDelay(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-slate-500"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Prototype
              </button>
            </div>
          </div>
        </div>
      </DraggableWindow>
    </section>
  );
}
