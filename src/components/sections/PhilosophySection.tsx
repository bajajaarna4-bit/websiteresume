'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Flame, ArrowUpRight, X } from 'lucide-react';
import { useOS } from '@/components/motion/AppProviders';
import { PHILOSOPHY_MOMENTS, type PhilosophyMoment } from '@/content/philosophy';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PhilosophySection() {
  const { reducedMotion } = useOS();
  const containerRef = useRef<HTMLElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<string>('01');

  useGSAP(
    () => {
      if (reducedMotion || !quoteRef.current) return;

      gsap.from(quoteRef.current, {
        opacity: 0,
        scale: 0.96,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { scope: containerRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  const currentMoment: PhilosophyMoment =
    PHILOSOPHY_MOMENTS.find((m) => m.step === activeStep) ??
    PHILOSOPHY_MOMENTS[0] ?? {
      step: '01',
      label: 'Velocity > Perfection',
      headline: 'A dumb who tries beats a genius who only thinks of doing.',
      narrative: 'Over-engineering inside your head produces zero telemetry.',
      proofAnchor: 'Shipped 25 public repositories.',
    };

  return (
    <section
      ref={containerRef}
      id="philosophy"
      data-section-id="philosophy"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-24 sm:px-6"
    >
      {/* 1 Headline & 1 Supporting Line */}
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <Compass className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>02 // Operating Thesis</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Try &gt; Think: Built to Ship
          </h2>
        </div>
        <p className="max-w-md text-sm font-normal text-slate-300">
          Bias toward shipping working code over endless theoretical planning.
        </p>
      </div>

      {/* Hero Display Quote with Reveal Animation */}
      <div
        ref={quoteRef}
        className="glass-panel relative overflow-hidden rounded-3xl border border-sky-400/30 p-8 text-center sm:p-14"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 font-mono text-xs text-sky-300">
            <Flame className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
            Core Philosophy
          </span>

          <blockquote className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            &ldquo;A dumb who tries beats a genius who thinks of doing.&rdquo;
          </blockquote>

          {/* Interactive Steps Mini-Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {PHILOSOPHY_MOMENTS.map((m) => (
              <button
                key={m.step}
                type="button"
                onClick={() => {
                  setActiveStep(m.step);
                  setShowDrawer(true);
                }}
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 font-mono text-xs text-slate-300 transition-colors hover:border-sky-400/50 hover:text-white"
              >
                <span className="text-sky-400 font-semibold">{m.step}</span>
                <span>{m.label}</span>
                <ArrowUpRight className="h-3 w-3 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progressive Disclosure: Thesis Steps Modal */}
      <AnimatePresence>
        {showDrawer ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Operating Thesis Deep-Dive"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="glass-panel relative z-10 w-full max-w-2xl rounded-2xl border border-sky-400/30 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-mono text-xs tracking-wider text-sky-300 uppercase">
                  Thesis Steps // Progressive Architecture
                </div>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex gap-2 border-b border-slate-800 pb-3">
                {PHILOSOPHY_MOMENTS.map((m) => (
                  <button
                    key={m.step}
                    type="button"
                    onClick={() => setActiveStep(m.step)}
                    className={`rounded-lg px-3 py-1 font-mono text-xs transition-colors ${
                      activeStep === m.step
                        ? 'bg-sky-400 font-semibold text-slate-950'
                        : 'border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Step {m.step}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <h3 className="text-lg font-semibold text-white">{currentMoment.headline}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{currentMoment.narrative}</p>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs text-sky-300">
                  Proof: {currentMoment.proofAnchor}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
