'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ExternalLink,
  FolderGit2,
  GitCommitHorizontal,
  GitFork,
  RefreshCw,
  Star,
} from 'lucide-react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import type { GitHubOverview } from '@/lib/validators/github';
import { cn } from '@/lib/utils';

interface GitHubLiveSectionProps {
  initialData: GitHubOverview;
}

export function GitHubLiveSection({ initialData }: GitHubLiveSectionProps) {
  const [data, setData] = useState<GitHubOverview>(initialData);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

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

        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-400/10 px-3.5 py-2 font-mono text-xs text-sky-100 transition-colors hover:bg-sky-400/20 disabled:opacity-50"
        >
          <RefreshCw
            className={cn('h-3.5 w-3.5 text-sky-400', refreshing ? 'animate-spin' : '')}
            aria-hidden="true"
          />
          {refreshing ? 'Refreshing...' : 'Sync /api/github'}
        </button>
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
            {data.isFallback ? 'CACHED FALLBACK' : 'LIVE ISR 300s'}
          </span>
        }
      >
        {data.isFallback && data.fallbackReason ? (
          <div
            role="status"
            className="mb-5 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-2 font-mono text-xs text-amber-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{data.fallbackReason}</span>
          </div>
        ) : null}

        {refreshError ? (
          <div
            role="alert"
            className="mb-5 flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3.5 py-2 font-mono text-xs text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{refreshError}</span>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="font-mono text-[11px] text-slate-400 uppercase">Public Repos</p>
            <p className="mt-1 text-2xl font-bold text-white">{data.profile.publicRepos}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="font-mono text-[11px] text-slate-400 uppercase">Total Stars</p>
            <p className="mt-1 text-2xl font-bold text-sky-300">{data.totalStars}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="font-mono text-[11px] text-slate-400 uppercase">Primary Language</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {data.languages[0]?.language ?? 'TypeScript'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="font-mono text-[11px] text-slate-400 uppercase">Network</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {data.profile.followers} <span className="text-xs font-normal text-slate-400">followers</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 lg:col-span-5">
            <h3 className="font-mono text-xs tracking-wider text-slate-300 uppercase">
              Language Distribution
            </h3>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              {data.languages.map((lang, idx) => (
                <div
                  key={lang.language}
                  style={{ width: `${Math.max(4, lang.percentage)}%` }}
                  className={cn(
                    idx === 0
                      ? 'bg-sky-400'
                      : idx === 1
                        ? 'bg-cyan-400'
                        : idx === 2
                          ? 'bg-indigo-400'
                          : idx === 3
                            ? 'bg-emerald-400'
                            : 'bg-slate-500',
                  )}
                  title={`${lang.language}: ${lang.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((lang) => (
                <span
                  key={lang.language}
                  className="rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1 font-mono text-[11px] text-slate-200"
                >
                  {lang.language} · {lang.percentage}%
                </span>
              ))}
            </div>

            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-mono text-xs tracking-wider text-slate-300 uppercase">
                  84-Day Public Activity
                </h3>
                <span className="font-mono text-[10px] text-slate-400">Recent window</span>
              </div>
              <div
                aria-label="84-day GitHub activity heatmap"
                className="grid grid-cols-12 gap-1"
              >
                {data.activityDays.slice(-84).map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} event(s)`}
                    className={cn(
                      'h-3 w-full rounded-[3px]',
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
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 lg:col-span-7">
            <h3 className="font-mono text-xs tracking-wider text-slate-300 uppercase">
              Recent Commits
            </h3>
            <ul className="space-y-2.5">
              {data.recentCommits.slice(0, 5).map((commit) => (
                <li
                  key={`${commit.repoName}-${commit.sha}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-800/80 bg-slate-900/50 px-3 py-2.5 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <GitCommitHorizontal className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden="true" />
                      <a
                        href={commit.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-semibold text-sky-300 hover:underline"
                      >
                        {commit.repoName}
                      </a>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                        {commit.sha}
                      </span>
                    </div>
                    <p className="truncate text-slate-200">{commit.message}</p>
                  </div>
                  <time className="shrink-0 font-mono text-[10px] text-slate-400">
                    {commit.committedAt.slice(0, 10)}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-mono text-xs tracking-wider text-slate-300 uppercase">
              Active Public Repositories
            </h3>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter repositories by language">
              {languageTabs.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 font-mono text-[11px] transition-colors',
                    selectedLanguage === lang
                      ? 'bg-sky-400 text-slate-950 font-semibold'
                      : 'border border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700',
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => (
              <article
                key={repo.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-sky-400/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-white hover:text-sky-300"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden="true" />
                    </a>
                    {repo.language ? (
                      <span className="shrink-0 rounded bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                        {repo.language}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">
                    {repo.description ?? 'Public engineering repository under active iteration.'}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 font-mono text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-300" aria-hidden="true" />
                      {repo.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3 w-3" aria-hidden="true" />
                      {repo.forks}
                    </span>
                  </div>
                  <span>Updated {repo.pushedAt.slice(0, 10)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </DraggableWindow>
    </section>
  );
}
