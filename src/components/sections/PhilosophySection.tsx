'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, Flame } from 'lucide-react';
import { useOS } from '@/components/motion/AppProviders';
import { PHILOSOPHY_MOMENTS } from '@/content/philosophy';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PhilosophySection() {
  const { reducedMotion } = useOS();
  const containerRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>('.philosophy-card');
      for (const card of cards) {
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 86%',
            once: true,
          },
        });
      }

      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0.08 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 65%',
              end: 'bottom 75%',
              scrub: 0.4,
            },
          },
        );
      }
    },
    { scope: containerRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      ref={containerRef}
      id="philosophy"
      data-section-id="philosophy"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <Compass className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>02 // Operating Thesis</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Try &gt; Think: Built to Ship
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-300">
          Every project starts as a concrete prototype tested against real compilers, browsers, and
          edge cases.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-10">
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-2 w-0.5 bg-slate-800 sm:left-4"
        >
          <div
            ref={railRef}
            className="h-full w-full origin-top bg-linear-to-b from-sky-400 via-cyan-300 to-sky-500"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PHILOSOPHY_MOMENTS.map((moment) => (
            <article
              key={moment.step}
              className="philosophy-card glass-panel group rounded-2xl border border-slate-700/60 p-6 transition-colors hover:border-sky-400/40"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-md bg-sky-400/15 px-2.5 py-1 font-mono text-xs font-semibold text-sky-300">
                  STEP {moment.step}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
                  <Flame className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                  {moment.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">{moment.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{moment.narrative}</p>
              <p className="mt-4 border-t border-slate-800/80 pt-3 font-mono text-xs text-sky-200/90">
                {moment.proofAnchor}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
