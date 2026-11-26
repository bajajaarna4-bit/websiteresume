'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Code2,
  Lock,
  Play,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import {
  runSecuritySimulation,
  SECURITY_SCENARIOS,
  type SecurityMode,
  type SecurityScenarioId,
} from '@/lib/security-lab/simulator';
import { cn } from '@/lib/utils';

export function SecurityLabSection() {
  const [scenarioId, setScenarioId] = useState<SecurityScenarioId>('sqli');
  const [mode, setMode] = useState<SecurityMode>('vulnerable');
  const [inputValue, setInputValue] = useState<string>(SECURITY_SCENARIOS[0]?.defaultInput ?? '');
  const [attemptCount, setAttemptCount] = useState<number>(4);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);

  const scenario =
    SECURITY_SCENARIOS.find((item) => item.id === scenarioId) ?? SECURITY_SCENARIOS[0];

  if (!scenario) return null;

  const outcome = runSecuritySimulation(scenario.id, mode, inputValue, attemptCount);

  const handleSelectScenario = (nextId: SecurityScenarioId): void => {
    setScenarioId(nextId);
    const nextScenario = SECURITY_SCENARIOS.find((item) => item.id === nextId);
    if (nextScenario) {
      setInputValue(nextScenario.defaultInput);
      setAttemptCount(nextId === 'bruteforce' ? 4 : 1);
    }
  };

  return (
    <section
      id="security-lab"
      data-section-id="security-lab"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      {/* 1 Headline & 1 Supporting Line */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <ShieldCheck className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>08 // Security Lab: Attack vs Defend</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Interactive Defense Sandbox
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-200">
            Educational simulation · 100% Local Mock
          </span>
        </div>
      </div>

      <DraggableWindow
        title="SECURITY LAB // ATTACK VS DEFEND"
        pathLabel={`~/sandbox/${scenario.id}/${mode}`}
        badge={
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
            ZERO EXTERNAL REQUESTS
          </span>
        }
      >
        {/* Scenario Pill Switcher */}
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"
          role="tablist"
          aria-label="Security Lab scenarios"
        >
          <div className="flex flex-wrap gap-1.5">
            {SECURITY_SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === scenario.id}
                onClick={() => handleSelectScenario(item.id)}
                className={cn(
                  'rounded-lg px-2.5 py-1 font-mono text-xs transition-colors',
                  item.id === scenario.id
                    ? 'bg-sky-400 font-semibold text-slate-950'
                    : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200',
                )}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCodeModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-xs text-slate-300 hover:border-slate-600"
          >
            <Code2 className="h-3.5 w-3.5 text-sky-400" />
            <span>Inspect Diff &amp; Logs</span>
          </button>
        </div>

        {/* Live Attack / Defend Visual Terminal */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Controls & Input */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 lg:col-span-5">
            <h3 className="text-sm font-semibold text-white">{scenario.title}</h3>

            <div className="flex items-center gap-2">
              <label htmlFor="sec-lab-input" className="sr-only">
                {scenario.inputLabel}
              </label>
              <input
                id="sec-lab-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={120}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-100 focus:border-sky-400 focus:outline-none"
              />
              {scenario.id === 'bruteforce' ? (
                <button
                  type="button"
                  onClick={() => setAttemptCount((prev) => prev + 1)}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-400 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-950 hover:bg-sky-300"
                >
                  <Play className="h-3 w-3" />
                  +{attemptCount}
                </button>
              ) : null}
            </div>

            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Toggle Vulnerable or Hardened mode">
              <button
                type="button"
                aria-pressed={mode === 'vulnerable'}
                onClick={() => setMode('vulnerable')}
                className={cn(
                  'inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs transition-colors',
                  mode === 'vulnerable'
                    ? 'border-rose-400 bg-rose-500/20 font-semibold text-rose-100'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200',
                )}
              >
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                Vulnerable
              </button>
              <button
                type="button"
                aria-pressed={mode === 'hardened'}
                onClick={() => setMode('hardened')}
                className={cn(
                  'inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs transition-colors',
                  mode === 'hardened'
                    ? 'border-emerald-400 bg-emerald-500/20 font-semibold text-emerald-100'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200',
                )}
              >
                <Lock className="h-4 w-4 text-emerald-400" />
                Hardened
              </button>
            </div>
          </div>

          {/* Outcome Visual Display */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 lg:col-span-7">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-xs text-slate-400">Execution Outcome</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold',
                    outcome.statusTone === 'danger'
                      ? 'bg-rose-500/20 text-rose-200'
                      : outcome.statusTone === 'warn'
                        ? 'bg-amber-500/20 text-amber-200'
                        : 'bg-emerald-500/20 text-emerald-200',
                  )}
                >
                  {outcome.statusTone === 'safe' ? (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  {outcome.statusBadge}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 font-mono text-xs text-slate-300">
                {outcome.attackerLines.slice(0, 2).map((line, idx) => (
                  <p key={idx} className="rounded-md bg-slate-900/80 p-2 break-all">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className="font-mono text-[11px] text-sky-400 hover:underline"
              >
                View mitigation &amp; logs ↗
              </button>
            </div>
          </div>
        </div>
      </DraggableWindow>

      {/* Progressive Disclosure: Code Diff & Defender Logs Modal */}
      <AnimatePresence>
        {showCodeModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Security Exploit & Fix Diff"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCodeModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel relative z-10 w-full max-w-2xl rounded-2xl border border-sky-400/30 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs text-sky-300 uppercase">
                  Security Diff // Vulnerable Pattern vs Hardened Fix
                </span>
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-rose-400/30 bg-rose-950/15 p-3">
                  <h4 className="font-mono text-xs text-rose-300 uppercase">Vulnerable Pattern</h4>
                  <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-slate-300">
                    <code>{scenario.vulnerableCode}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/15 p-3">
                  <h4 className="font-mono text-xs text-emerald-300 uppercase">Hardened Fix</h4>
                  <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-slate-300">
                    <code>{scenario.hardenedCode}</code>
                  </pre>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <h4 className="flex items-center gap-1.5 font-mono text-xs text-sky-300 uppercase">
                  <Terminal className="h-3.5 w-3.5" />
                  Defender Server Logs (JSON)
                </h4>
                <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-sky-100">
                  <code>{outcome.defenderLogJson}</code>
                </pre>
              </div>

              <p className="mt-3 text-xs text-slate-300">
                <span className="font-semibold text-white">Mitigation: </span>
                {outcome.mitigationNote}
              </p>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
