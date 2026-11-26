'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ExternalLink,
  FolderGit2,
  GitFork,
  RefreshCw,
  Star,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import type { GitHubOverview, GitHubRepoSummary } from '@/lib/validators/github';
import { cn } from '@/lib/utils';

interface GitHubLiveSectionProps {
  initialData: GitHubOverview;
}

export function GitHubLiveSection({ initialData }: GitHubLiveSectionProps) {
  const [data, setData] = useState<GitHubOverview>(initialData);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [inspectRepo, setInspectRepo] = useState<GitHubRepoSummary | null>(null);
  const [showCommitsModal, setShowCommitsModal] = useState<boolean>(false);

  const languageTabs = useMemo(() => {
    const langs = new Set<string>(['All']);
    for (const repo of data.repos) {
      if (repo.language) langs.add(repo.language);
    }
    return Array.from(langs);
  }, [data.repos]);

  const filteredRepos = useMemo(() => {
    if (selectedLanguage === 'All') return data.repos.slice(0, 6);
    return data.repos.filter((repo) => repo.language === selectedLanguage).slice(0, 6);
  }, [data.repos, selectedLanguage]);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const response = await fetch('/api/github', { method: 'GET' });
      if (!response.ok) {
        setRefreshError(`Telemetry refresh returned HTTP ${response.status}.`);
        return;
      }
      const nextPayload = (await response.json()) as GitHubOverview;
      setData(nextPayload);
    } catch {
      setRefreshError('Could not reach /api/github telemetry endpoint.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section
      id="github-live"
      data-section-id="github-live"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      {/* 1 Headline & 1 Supporting Line */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <FolderGit2 className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>03 // GitHub Live Telemetry</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Live Public Engineering Signal
          </h2>
        </div>

        <p className="max-w-md text-sm font-normal text-slate-300">
          Automated telemetry synced directly from verified public GitHub activity.
        </p>
      </div>

      <DraggableWindow
        title="GITHUB // TELEMETRY"
        pathLabel={`~/api/github/${data.profile.login}`}
        badge={
          <span
            className={cn(
              'rounded-full px-2 py-0.5 font-mono text-[10px]',
              data.isFallback
                ? 'bg-amber-500/15 text-amber-300'
                : 'bg-emerald-500/15 text-emerald-300',
            )}
          >
            {data.isFallback ? 'CACHED FALLBACK' : 'LIVE ISR'}
          </span>
        }
      >
        {refreshError ? (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3.5 py-2 font-mono text-xs text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{refreshError}</span>
          </div>
        ) : null}

        {/* Compact Stat Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="font-mono text-[10px] text-slate-400 uppercase">Repos</p>
            <p className="mt-0.5 text-xl font-bold text-white">{data.profile.publicRepos}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="font-mono text-[10px] text-slate-400 uppercase">Stars</p>
            <p className="mt-0.5 text-xl font-bold text-sky-300">{data.totalStars}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="font-mono text-[10px] text-slate-400 uppercase">Stack</p>
            <p className="mt-0.5 truncate text-xl font-bold text-white">
              {data.languages[0]?.language ?? 'TypeScript'}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div>
              <p className="font-mono text-[10px] text-slate-400 uppercase">Commits</p>
              <button
                type="button"
                onClick={() => setShowCommitsModal(true)}
                className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs font-semibold text-sky-400 hover:underline"
              >
                <span>View Stream</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={refreshing}
              title="Sync telemetry"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', refreshing ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>

        {/* 84-Day Activity Heatmap (compact) */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-mono text-[11px] tracking-wider text-slate-400 uppercase">
              84-Day Public Activity
            </h3>
            <span className="font-mono text-[10px] text-sky-400">Live Pulse</span>
          </div>
          <div
            aria-label="84-day GitHub activity heatmap"
            className="grid grid-cols-12 gap-1 sm:grid-cols-28"
          >
            {data.activityDays.slice(-84).map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} event(s)`}
                className={cn(
                  'h-3 w-full rounded-[2px]',
                  day.count === 0
                    ? 'bg-slate-800/80'
                    : day.count <= 2
                      ? 'bg-sky-500/35'
                      : day.count <= 4
                        ? 'bg-sky-400/65'
                        : 'bg-sky-300',
                )}
              />
            ))}
          </div>
        </div>

        {/* Compact Repo Tiles */}
        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-mono text-[11px] tracking-wider text-slate-400 uppercase">
              Repositories
            </h3>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter repositories by language">
              {languageTabs.slice(0, 4).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={cn(
                    'rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors',
                    selectedLanguage === lang
                      ? 'bg-sky-400 font-semibold text-slate-950'
                      : 'border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200',
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => setInspectRepo(repo)}
                className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 transition-colors hover:border-sky-400/40 hover:bg-slate-900/40"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-mono text-xs font-semibold text-white group-hover:text-sky-300">
                      {repo.name}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-slate-400">
                    {repo.language ? (
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        {repo.language}
                      </span>
                    ) : null}
                    <span>·</span>
                    <span>{repo.pushedAt.slice(0, 10)}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-300" />
                    {repo.stars}
                  </span>
                  <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-sky-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DraggableWindow>

      {/* Progressive Disclosure: Repo Detail Modal */}
      <AnimatePresence>
        {inspectRepo ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Repository Details"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectRepo(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel relative z-10 w-full max-w-md rounded-2xl border border-sky-400/30 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs text-sky-300">{inspectRepo.name}</span>
                <button
                  type="button"
                  onClick={() => setInspectRepo(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-300">
                {inspectRepo.description || 'Public engineering repository under active iteration.'}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-xs text-slate-400">
                <span>Updated: {inspectRepo.pushedAt.slice(0, 10)}</span>
                <div className="flex gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-300" /> {inspectRepo.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {inspectRepo.forks}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <a
                  href={inspectRepo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 font-mono text-xs font-semibold text-slate-950 hover:bg-sky-300"
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  Open GitHub Repo
                </a>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Progressive Disclosure: Commits Modal */}
      <AnimatePresence>
        {showCommitsModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Recent Commits Stream"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommitsModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel relative z-10 w-full max-w-lg rounded-2xl border border-sky-400/30 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs text-sky-300">Live Commit Stream</span>
                <button
                  type="button"
                  onClick={() => setShowCommitsModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ul className="mt-3 space-y-2">
                {data.recentCommits.slice(0, 5).map((commit) => (
                  <li
                    key={`${commit.repoName}-${commit.sha}`}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                      <span className="font-semibold text-sky-300">{commit.repoName}</span>
                      <span>{commit.committedAt.slice(0, 10)}</span>
                    </div>
                    <p className="mt-1 truncate text-slate-200">{commit.message}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
