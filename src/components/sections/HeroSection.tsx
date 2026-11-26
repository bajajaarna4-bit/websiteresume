'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowDownRight,
  Command,
  FolderGit2,
  MapPin,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { useOS } from '@/components/motion/AppProviders';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { JarvisOrbCanvas } from '@/components/three/JarvisOrbCanvas';
import type { GitHubOverview } from '@/lib/validators/github';

interface HeroSectionProps {
  github: GitHubOverview;
}

export function HeroSection({ github }: HeroSectionProps) {
  const { scrollToSection, setCommandPaletteOpen } = useOS();
  const rawName = github.profile.name?.trim() || 'Aarna Bajaj';
  const displayName = rawName.toLowerCase() === 'aarna bajaj' ? 'Aarna Bajaj' : rawName;

  return (
    <section
      id="hero"
      data-section-id="hero"
      className="relative mx-auto flex min-h-[calc(100dvh-2.75rem)] max-w-7xl scroll-mt-14 items-center px-4 pt-20 pb-16 sm:px-6 lg:pt-24"
    >
      <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 font-mono text-xs text-sky-200"
          >
            <Activity className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden="true" />
            <span className="shrink-0">Now Building:</span>
            <a
              href={github.nowBuilding.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-semibold text-white underline decoration-sky-400/60 underline-offset-4 hover:text-sky-200"
            >
              {github.nowBuilding.repoName}
            </a>
          </motion.div>

          <div className="flex items-center gap-4">
            <Image
              src={github.profile.avatarUrl}
              alt={`${displayName} GitHub avatar`}
              width={64}
              height={64}
              sizes="64px"
              priority
              unoptimized={github.profile.avatarUrl.endsWith('.svg')}
              className="h-16 w-16 rounded-2xl border border-sky-400/40 object-cover shadow-lg shadow-sky-500/10"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                {displayName}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-slate-300">
                <span>@{github.profile.login}</span>
                {github.profile.location ? (
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                    {github.profile.location}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <p className="max-w-2xl text-xl leading-relaxed font-medium text-slate-100 sm:text-2xl">
            &ldquo;A dumb who tries beats a genius who only thinks of doing.&rdquo;
          </p>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {github.profile.bio ??
              'B.Tech CSE builder shipping AI systems, immutable Linux tooling, and security-first web applications with a relentless bias for action.'}{' '}
            <span className="text-sky-300">
              Latest signal: {github.nowBuilding.summary}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => scrollToSection('featured-project')}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-sky-300"
            >
              Inspect Featured Build
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('security-lab')}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-400/10 px-4 py-2.5 text-sm font-medium text-sky-100 transition-colors hover:bg-sky-400/20"
            >
              <ShieldCheck className="h-4 w-4 text-sky-400" aria-hidden="true" />
              Attack vs Defend Lab
            </button>

            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 font-mono text-xs text-slate-200 transition-colors hover:border-slate-500"
            >
              <Command className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              Cmd / Ctrl + K
            </button>

            <a
              href={github.profile.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 px-3 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              <FolderGit2 className="h-4 w-4" aria-hidden="true" />
              {github.profile.publicRepos} Public Repos
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <DraggableWindow
            title="JARVIS // CORE"
            pathLabel="~/system/spatial-telemetry"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                <Terminal className="h-3 w-3" aria-hidden="true" />
                LIVE
              </span>
            }
          >
            <JarvisOrbCanvas />
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 font-mono text-xs">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Repos</p>
                <p className="text-sm font-semibold text-white">{github.profile.publicRepos}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Active Stack</p>
                <p className="truncate text-sm font-semibold text-sky-300">
                  {github.languages[0]?.language ?? 'TypeScript'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Mode</p>
                <p className="text-sm font-semibold text-emerald-300">Ship &gt; Think</p>
              </div>
            </div>
          </DraggableWindow>
        </div>
      </div>
    </section>
  );
}
