'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Cpu, FastForward } from 'lucide-react';
import { useOS } from '@/components/motion/AppProviders';

const BOOT_STORAGE_KEY = 'bajaj_os_boot_seen_v1';

const BOOT_LINES = [
  'BAJAJ.OS v16.4 // INITIALIZING KERNEL',
  'MOUNTING STRICT CSP + ZERO-TRUST BOUNDARY... OK',
  'LINKING GITHUB LIVE TELEMETRY (bajajaarna4-bit)... OK',
  'WARMING JARVIS SPATIAL CORE... READY',
];

export function BootSequence() {
  const { reducedMotion } = useOS();
  const [visible, setVisible] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  useEffect(() => {
    if (reducedMotion) return;

    try {
      if (window.sessionStorage.getItem(BOOT_STORAGE_KEY) === '1') {
        return;
      }
      window.sessionStorage.setItem(BOOT_STORAGE_KEY, '1');
    } catch {
      // SessionStorage unavailable; still run once cleanly.
    }

    const startTimer = window.setTimeout(() => {
      setVisible(true);
    }, 0);

    const interval = window.setInterval(() => {
      setStepIndex((prev) => Math.min(BOOT_LINES.length - 1, prev + 1));
    }, 260);

    const dismissTimer = window.setTimeout(() => {
      setVisible(false);
    }, 1250);

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
        setVisible(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
      window.clearTimeout(dismissTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [reducedMotion]);

  const shouldRender = visible && !reducedMotion;

  return (
    <AnimatePresence>
      {shouldRender ? (
        <motion.div
          role="status"
          aria-label="System boot sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070c]/95 px-6 backdrop-blur-xl"
        >
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-sky-400/30 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
                <Cpu className="h-4 w-4 text-sky-400" aria-hidden="true" />
                <span>BAJAJ.OS // BOOT</span>
              </div>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1 font-mono text-xs text-slate-200 transition-colors hover:border-sky-400/50 hover:text-sky-200"
              >
                <FastForward className="h-3.5 w-3.5" aria-hidden="true" />
                Skip
              </button>
            </div>
            <div className="space-y-1.5 font-mono text-xs text-slate-300">
              {BOOT_LINES.slice(0, stepIndex + 1).map((line) => (
                <p key={line} className="truncate">
                  <span className="mr-2 text-sky-400">&gt;</span>
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full bg-sky-400"
                initial={{ width: '15%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
