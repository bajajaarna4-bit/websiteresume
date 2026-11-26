'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Code2,
  FlaskConical,
  Lock,
  Play,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
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

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-200">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          Educational Simulation — Local In-Browser Mock Only
        </span>
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
        <div
          role="note"
          className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sky-400/25 bg-sky-400/5 px-4 py-2.5 font-mono text-xs text-sky-200"
        >
          <span>
            Educational Simulation: Runs 100% locally against synthetic mock records. No external
            hosts, scanning, or real exploit payloads.
          </span>
        </div>

        <div
          className="mb-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Security Lab scenarios"
        >
          {SECURITY_SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === scenario.id}
              onClick={() => handleSelectScenario(item.id)}
              className={cn(
                'rounded-xl px-3 py-1.5 font-mono text-xs transition-colors',
                item.id === scenario.id
                  ? 'bg-sky-400 font-semibold text-slate-950'
                  : 'border border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600',
              )}
            >
              {item.shortLabel}
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-7">
            <h3 className="text-base font-semibold text-white">{scenario.title}</h3>
            <p className="text-xs leading-relaxed text-slate-300">{scenario.summary}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label htmlFor="sec-lab-input" className="sr-only">
                {scenario.inputLabel}
              </label>
              <input
                id="sec-lab-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={120}
                className="min-w-52 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-100 focus:border-sky-400 focus:outline-none"
              />
              {scenario.presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setInputValue(preset.value);
                    if (scenario.id === 'bruteforce') {
                      setAttemptCount(Number(preset.value) || 1);
                    }
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-[11px] text-slate-200 hover:border-sky-400/50"
                >
                  {preset.label}
                </button>
              ))}
              {scenario.id === 'bruteforce' ? (
                <button
                  type="button"
                  onClick={() => setAttemptCount((prev) => prev + 1)}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-400 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-slate-950 hover:bg-sky-300"
                >
                  <Play className="h-3 w-3" aria-hidden="true" />
                  Attempt +1 ({attemptCount})
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-slate-800 pt-3 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
            <p className="font-mono text-[11px] text-slate-400 uppercase">Simulation Mode</p>
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
                <ShieldAlert className="h-4 w-4 text-rose-400" aria-hidden="true" />
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
                <Lock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                Hardened
              </button>
            </div>
            <span
              className={cn(
                'inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold',
                outcome.statusTone === 'danger'
                  ? 'bg-rose-500/20 text-rose-200'
                  : outcome.statusTone === 'warn'
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'bg-emerald-500/20 text-emerald-200',
              )}
            >
              {outcome.statusTone === 'safe' ? (
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {outcome.statusBadge}
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-4">
            <h4 className="flex items-center gap-2 font-mono text-xs tracking-wider text-rose-300 uppercase">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
              {outcome.attackerViewTitle}
            </h4>
            <div className="mt-3 space-y-2 font-mono text-xs text-slate-200">
              {outcome.attackerLines.map((line) => (
                <p
                  key={line}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 break-words"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-4">
            <h4 className="flex items-center gap-2 font-mono text-xs tracking-wider text-sky-300 uppercase">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              Defender Server Logs (Simulated JSON)
            </h4>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs text-sky-100">
              <code>{outcome.defenderLogJson}</code>
            </pre>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div
            className={cn(
              'rounded-xl border p-4',
              mode === 'vulnerable'
                ? 'border-rose-400/50 bg-rose-950/15'
                : 'border-slate-800 bg-slate-950/50 opacity-80',
            )}
          >
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-rose-300 uppercase">
              <span className="inline-flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                Vulnerable Pattern
              </span>
              {mode === 'vulnerable' ? <span>ACTIVE</span> : null}
            </div>
            <pre className="overflow-x-auto font-mono text-xs text-slate-200">
              <code>{scenario.vulnerableCode}</code>
            </pre>
          </div>

          <div
            className={cn(
              'rounded-xl border p-4',
              mode === 'hardened'
                ? 'border-emerald-400/50 bg-emerald-950/15'
                : 'border-slate-800 bg-slate-950/50 opacity-80',
            )}
          >
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-emerald-300 uppercase">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Hardened Code Fix
              </span>
              {mode === 'hardened' ? <span>ACTIVE</span> : null}
            </div>
            <pre className="overflow-x-auto font-mono text-xs text-emerald-100">
              <code>{scenario.hardenedCode}</code>
            </pre>
          </div>
        </div>

        <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-300">
          <span className="font-mono font-semibold text-sky-300">Takeaway: </span>
          {outcome.mitigationNote}
        </p>
      </DraggableWindow>
    </section>
  );
}
