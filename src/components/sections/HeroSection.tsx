'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowDownRight,
  Command,
  FolderGit2,
  Info,
  MapPin,
  Terminal,
  X,
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
  const [showBioModal, setShowBioModal] = useState<boolean>(false);
  const rawName = github.profile.name?.trim() || 'Aarna Bajaj';
  const displayName = rawName.toLowerCase() === 'aarna bajaj' ? 'Aarna Bajaj' : rawName;

  return (
    <section
      id="hero"
      data-section-id="hero"
      className="relative mx-auto flex min-h-[calc(100dvh-2.75rem)] max-w-7xl scroll-mt-14 items-center px-4 pt-20 pb-16 sm:px-6 lg:pt-24"
    >
      <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          {/* Live GitHub status chip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 font-mono text-xs text-sky-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="shrink-0 text-slate-300">Now Building:</span>
            <a
              href={github.nowBuilding.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-semibold text-white underline decoration-sky-400/60 underline-offset-4 hover:text-sky-200"
            >
              {github.nowBuilding.repoName}
            </a>
          </motion.div>

          {/* Name & Avatar */}
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
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {displayName}
              </h1>
              <div className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-400">
                <span>@{github.profile.login}</span>
                {github.profile.location ? (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <MapPin className="h-3 w-3 text-sky-400" aria-hidden="true" />
                      {github.profile.location}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Headline Quote (max 15 words) */}
          <p className="max-w-xl text-lg font-normal leading-relaxed text-slate-200 sm:text-xl">
            &ldquo;A dumb who tries beats a genius who only thinks of doing.&rdquo;
          </p>

          {/* Clean Action Chips */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => scrollToSection('featured-project')}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 font-mono text-xs font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-sky-300"
            >
              Explore System
              <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              <Command className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span>⌘K</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBioModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 px-3 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
            >
              <Info className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span>Signal</span>
            </button>
          </div>
        </div>

        {/* 3D JARVIS Telemetry Visual */}
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
                <p className="text-[10px] text-slate-400 uppercase">Stack</p>
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

      {/* Progressive Disclosure: Bio & Signal Modal */}
      <AnimatePresence>
        {showBioModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Engineer Signal & Bio"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBioModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel relative z-10 w-full max-w-lg rounded-2xl border border-sky-400/30 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-mono text-xs tracking-wider text-sky-300 uppercase">
                  Engineer Signal // Background
                </div>
                <button
                  type="button"
                  onClick={() => setShowBioModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>
                  {github.profile.bio ??
                    'B.Tech CSE builder shipping AI systems, immutable Linux tooling, and security-first web applications.'}
                </p>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs">
                  <span className="text-sky-300">Active Build: </span>
                  {github.nowBuilding.summary}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <a
                  href={github.profile.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 font-mono text-xs font-semibold text-slate-950 hover:bg-sky-300"
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  View GitHub Profile
                </a>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
