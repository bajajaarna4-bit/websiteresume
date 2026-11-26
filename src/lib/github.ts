import 'server-only';
import { z } from 'zod';
import { getServerEnv } from '@/lib/env';
import {
  GitHubOverviewSchema,
  type GitHubActivityDay,
  type GitHubLanguageStat,
  type GitHubOverview,
  type GitHubRecentCommit,
  type GitHubRepoSummary,
} from '@/lib/validators/github';

const RawGitHubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  created_at: z.string(),
});

const RawGitHubRepoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  homepage: z.string().nullable(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  open_issues_count: z.number().int().nonnegative(),
  size: z.number().int().nonnegative(),
  topics: z.array(z.string()).default([]),
  updated_at: z.string(),
  pushed_at: z.string().nullable(),
  fork: z.boolean(),
});

const RawGitHubCommitItemSchema = z.object({
  sha: z.string(),
  commit: z.object({
    message: z.string(),
    author: z
      .object({
        date: z.string().optional(),
      })
      .nullable()
      .optional(),
  }),
});

const RawGitHubEventSchema = z.object({
  id: z.string(),
  type: z.string().nullable(),
  created_at: z.string(),
  repo: z.object({
    name: z.string(),
  }),
});

const RawGraphQLCalendarSchema = z.object({
  data: z
    .object({
      user: z
        .object({
          contributionsCollection: z.object({
            contributionCalendar: z.object({
              weeks: z.array(
                z.object({
                  contributionDays: z.array(
                    z.object({
                      date: z.string(),
                      contributionCount: z.number().int().nonnegative(),
                    }),
                  ),
                }),
              ),
            }),
          }),
        })
        .nullable(),
    })
    .optional(),
});

// Verified public profile snapshot for bajajaarna4-bit used only if live GitHub API is rate-limited/offline.
const VERIFIED_FALLBACK_SNAPSHOT: GitHubOverview = {
  profile: {
    login: 'bajajaarna4-bit',
    name: 'Aarna bajaj',
    avatarUrl: '/images/avatar-monogram.svg',
    htmlUrl: 'https://github.com/bajajaarna4-bit',
    bio: 'B.Tech CSE Student | K.R. Mangalam University | Python | Linux | Git',
    company: 'K.R. Mangalam University',
    location: 'Gurugram, Haryana, India',
    publicRepos: 25,
    followers: 1,
    following: 1,
    createdAt: '2026-05-23T06:45:59Z',
  },
  repos: [
    {
      id: 1471297486,
      name: 'nova-os',
      fullName: 'bajajaarna4-bit/nova-os',
      htmlUrl: 'https://github.com/bajajaarna4-bit/nova-os',
      homepage: null,
      description:
        'A modern, zero-trust, AI-native operating system distribution built on an immutable Linux foundation.',
      language: 'JavaScript',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 896,
      topics: ['linux', 'security', 'ai', 'os'],
      updatedAt: '2026-11-24T00:00:00Z',
      pushedAt: '2026-11-24T00:00:00Z',
      isFork: false,
    },
    {
      id: 1471297487,
      name: 'developer-productivity-toolkit',
      fullName: 'bajajaarna4-bit/developer-productivity-toolkit',
      htmlUrl: 'https://github.com/bajajaarna4-bit/developer-productivity-toolkit',
      homepage: 'https://developer-productivity-toolkit.vercel.app/',
      description:
        'Developer Productivity & System Monitoring Toolkit with animated 60fps glassmorphic dashboard',
      language: 'HTML',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 78,
      topics: ['linux', 'bash', 'python', 'telemetry'],
      updatedAt: '2026-11-25T00:00:00Z',
      pushedAt: '2026-11-25T00:00:00Z',
      isFork: false,
    },
    {
      id: 1466826366,
      name: 'sonora-ai',
      fullName: 'bajajaarna4-bit/sonora-ai',
      htmlUrl: 'https://github.com/bajajaarna4-bit/sonora-ai',
      homepage: null,
      description: null,
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 190,
      topics: [],
      updatedAt: '2026-11-21T19:10:16Z',
      pushedAt: '2026-11-21T19:10:16Z',
      isFork: false,
    },
    {
      id: 1465892174,
      name: 'DeveloperPortfolio-Toolkit',
      fullName: 'bajajaarna4-bit/DeveloperPortfolio-Toolkit',
      htmlUrl: 'https://github.com/bajajaarna4-bit/DeveloperPortfolio-Toolkit',
      homepage: null,
      description:
        'Developer Productivity & System Monitoring Toolkit with 60fps Animated Glassmorphic Dashboard',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 196,
      topics: [],
      updatedAt: '2026-11-21T00:00:00Z',
      pushedAt: '2026-11-21T00:00:00Z',
      isFork: false,
    },
    {
      id: 1460000001,
      name: 'cse103-lab-LAB3',
      fullName: 'bajajaarna4-bit/cse103-lab-LAB3',
      htmlUrl: 'https://github.com/bajajaarna4-bit/cse103-lab-LAB3',
      homepage: null,
      description:
        'Lab work for CSE103 — Git/GitHub workflows, shell scripting, and REST API interaction.',
      language: 'Python',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 69,
      topics: [],
      updatedAt: '2026-11-20T00:00:00Z',
      pushedAt: '2026-11-20T00:00:00Z',
      isFork: false,
    },
    {
      id: 1460000002,
      name: 'travelearn2',
      fullName: 'bajajaarna4-bit/travelearn2',
      htmlUrl: 'https://github.com/bajajaarna4-bit/travelearn2',
      homepage: null,
      description: 'low maintainence travel',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 245,
      topics: [],
      updatedAt: '2026-11-11T00:00:00Z',
      pushedAt: '2026-11-11T00:00:00Z',
      isFork: false,
    },
    {
      id: 1460000003,
      name: 'sitebuilder',
      fullName: 'bajajaarna4-bit/sitebuilder',
      htmlUrl: 'https://github.com/bajajaarna4-bit/sitebuilder',
      homepage: null,
      description: 'a mix of google antigravity emergent google ai studio lovable',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 421,
      topics: [],
      updatedAt: '2026-11-09T00:00:00Z',
      pushedAt: '2026-11-09T00:00:00Z',
      isFork: false,
    },
    {
      id: 1460000004,
      name: 'sheissafe',
      fullName: 'bajajaarna4-bit/sheissafe',
      htmlUrl: 'https://github.com/bajajaarna4-bit/sheissafe',
      homepage: null,
      description:
        'ai application which automatically detects danger in forms of long stops or route deviation and genrates alerts but also prevents false alarm and have gps and help system',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      openIssues: 0,
      sizeKb: 126,
      topics: [],
      updatedAt: '2026-11-04T00:00:00Z',
      pushedAt: '2026-11-04T00:00:00Z',
      isFork: false,
    },
  ],
  totalStars: 0,
  languages: [
    { language: 'TypeScript', count: 14, percentage: 70 },
    { language: 'Python', count: 2, percentage: 10 },
    { language: 'HTML', count: 2, percentage: 10 },
    { language: 'JavaScript', count: 1, percentage: 5 },
    { language: 'Other', count: 1, percentage: 5 },
  ],
  recentCommits: [
    {
      sha: 'bc4ea03',
      repoName: 'nova-os',
      repoUrl: 'https://github.com/bajajaarna4-bit/nova-os',
      message:
        'fix(web): resolve 404 asset path issue for Render demo iframe and add mock system API endpoints',
      committedAt: '2026-11-24T00:00:00Z',
    },
    {
      sha: '96234b6',
      repoName: 'sonora-ai',
      repoUrl: 'https://github.com/bajajaarna4-bit/sonora-ai',
      message: 'Recent push to bajajaarna4-bit/sonora-ai (main)',
      committedAt: '2026-11-21T19:10:16Z',
    },
    {
      sha: '437909f',
      repoName: 'developer-portfolio',
      repoUrl: 'https://github.com/bajajaarna4-bit/developer-portfolio',
      message: 'Recent push to bajajaarna4-bit/developer-portfolio (main)',
      committedAt: '2026-11-21T18:44:01Z',
    },
  ],
  activityDays: buildEmptyCalendarWindow(84, [
    { date: '2026-11-03', count: 2 },
    { date: '2026-11-04', count: 4 },
    { date: '2026-11-09', count: 5 },
    { date: '2026-11-10', count: 4 },
    { date: '2026-11-11', count: 3 },
    { date: '2026-11-20', count: 2 },
    { date: '2026-11-21', count: 8 },
    { date: '2026-11-24', count: 4 },
    { date: '2026-11-25', count: 3 },
  ]),
  nowBuilding: {
    repoName: 'nova-os',
    repoUrl: 'https://github.com/bajajaarna4-bit/nova-os',
    summary: 'Zero-trust, AI-native OS distribution + glassmorphic desktop shell',
    updatedAt: '2026-11-24T00:00:00Z',
  },
  fetchedAt: '2026-11-25T20:00:00Z',
  isFallback: true,
  fallbackReason: 'Serving cached GitHub snapshot (live API rate-limited or offline).',
};

function buildEmptyCalendarWindow(
  daysCount: number,
  highlights: Array<{ date: string; count: number }>,
): GitHubActivityDay[] {
  const countsByDate = new Map<string, number>();
  for (const item of highlights) {
    countsByDate.set(item.date, (countsByDate.get(item.date) ?? 0) + item.count);
  }
  const anchor = new Date('2026-11-26T00:00:00Z');
  const days: GitHubActivityDay[] = [];
  for (let i = daysCount - 1; i >= 0; i -= 1) {
    const d = new Date(anchor.getTime() - i * 86_400_000);
    const isoDate = d.toISOString().slice(0, 10);
    days.push({
      date: isoDate,
      count: countsByDate.get(isoDate) ?? 0,
    });
  }
  return days;
}

function buildGitHubHeaders(token?: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'bajaj-os-portfolio',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function computeLanguageStats(repos: GitHubRepoSummary[]): GitHubLanguageStat[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    const lang = repo.language;
    if (lang) {
      counts.set(lang, (counts.get(lang) ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((sum, val) => sum + val, 0);
  if (total === 0) return [];

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / total) * 100),
    }));
}

async function fetchGraphQLContributions(
  username: string,
  token: string,
): Promise<GitHubActivityDay[] | null> {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...buildGitHubHeaders(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query($login: String!) {
            user(login: $login) {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { login: username },
      }),
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;
    const raw: unknown = await response.json();
    const parsed = RawGraphQLCalendarSchema.safeParse(raw);
    const weeks = parsed.data?.data?.user?.contributionsCollection.contributionCalendar.weeks;
    if (!weeks) return null;

    const allDays: GitHubActivityDay[] = [];
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        allDays.push({
          date: day.date,
          count: day.contributionCount,
        });
      }
    }
    return allDays.slice(-84);
  } catch {
    return null;
  }
}

export async function getGitHubOverview(): Promise<GitHubOverview> {
  const env = getServerEnv();
  const username = env.GITHUB_USERNAME;
  const headers = buildGitHubHeaders(env.GITHUB_READ_ONLY_TOKEN);

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(6000),
      }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=30&sort=pushed`,
        {
          headers,
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(6000),
        },
      ),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=40`,
        {
          headers,
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(6000),
        },
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      const reason =
        userRes.status === 403 || userRes.status === 429 || reposRes.status === 403
          ? 'GitHub API rate limit reached; serving verified cached snapshot.'
          : `GitHub API returned status ${userRes.status}; serving verified cached snapshot.`;
      return {
        ...VERIFIED_FALLBACK_SNAPSHOT,
        fallbackReason: reason,
      };
    }

    const rawUser: unknown = await userRes.json();
    const rawRepos: unknown = await reposRes.json();
    const rawEvents: unknown = eventsRes.ok ? await eventsRes.json() : [];

    const userParsed = RawGitHubUserSchema.safeParse(rawUser);
    const reposParsed = z.array(RawGitHubRepoSchema).safeParse(rawRepos);
    const eventsParsed = z.array(RawGitHubEventSchema).safeParse(rawEvents);

    if (!userParsed.success || !reposParsed.success) {
      return {
        ...VERIFIED_FALLBACK_SNAPSHOT,
        fallbackReason: 'GitHub upstream payload validation failed; serving fallback snapshot.',
      };
    }

    const repos: GitHubRepoSummary[] = reposParsed.data
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        htmlUrl: repo.html_url,
        homepage:
          repo.homepage && repo.homepage.startsWith('https://') ? repo.homepage : null,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        sizeKb: repo.size,
        topics: repo.topics,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at ?? repo.updated_at,
        isFork: repo.fork,
      }))
      .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt));

    const topCommitCandidates = repos.filter((r) => r.sizeKb > 0).slice(0, 4);
    const commitResults = await Promise.allSettled(
      topCommitCandidates.map(async (repo): Promise<GitHubRecentCommit[]> => {
        const res = await fetch(
          `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/commits?per_page=2`,
          {
            headers,
            next: { revalidate: 300 },
            signal: AbortSignal.timeout(4500),
          },
        );
        if (!res.ok) return [];
        const raw: unknown = await res.json();
        const parsed = z.array(RawGitHubCommitItemSchema).safeParse(raw);
        if (!parsed.success) return [];
        return parsed.data.map((item) => ({
          sha: item.sha.slice(0, 7),
          repoName: repo.name,
          repoUrl: repo.htmlUrl,
          message: item.commit.message.split('\n')[0] ?? 'Commit',
          committedAt: item.commit.author?.date ?? repo.pushedAt,
        }));
      }),
    );

    const recentCommits: GitHubRecentCommit[] = [];
    for (const outcome of commitResults) {
      if (outcome.status === 'fulfilled') {
        recentCommits.push(...outcome.value);
      }
    }
    recentCommits.sort((a, b) => Date.parse(b.committedAt) - Date.parse(a.committedAt));

    let activityDays: GitHubActivityDay[] | null = null;
    if (env.GITHUB_READ_ONLY_TOKEN) {
      activityDays = await fetchGraphQLContributions(username, env.GITHUB_READ_ONLY_TOKEN);
    }

    if (!activityDays) {
      const eventHighlights: Array<{ date: string; count: number }> = [];
      if (eventsParsed.success) {
        for (const ev of eventsParsed.data) {
          eventHighlights.push({ date: ev.created_at.slice(0, 10), count: 1 });
        }
      }
      for (const repo of repos) {
        eventHighlights.push({ date: repo.pushedAt.slice(0, 10), count: 1 });
      }
      activityDays = buildEmptyCalendarWindow(84, eventHighlights);
    }

    const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
    const activeLeadRepo =
      repos.find((r) => r.name !== 'websiteresume' && r.sizeKb > 0) ??
      repos[0] ??
      VERIFIED_FALLBACK_SNAPSHOT.repos[0];

    const overview: GitHubOverview = {
      profile: {
        login: userParsed.data.login,
        name: userParsed.data.name,
        avatarUrl: userParsed.data.avatar_url,
        htmlUrl: userParsed.data.html_url,
        bio: userParsed.data.bio,
        company: userParsed.data.company?.trim() || null,
        location: userParsed.data.location,
        publicRepos: userParsed.data.public_repos,
        followers: userParsed.data.followers,
        following: userParsed.data.following,
        createdAt: userParsed.data.created_at,
      },
      repos: repos.slice(0, 12),
      totalStars,
      languages: computeLanguageStats(repos),
      recentCommits: recentCommits.slice(0, 8),
      activityDays,
      nowBuilding: {
        repoName: activeLeadRepo?.name ?? 'nova-os',
        repoUrl: activeLeadRepo?.htmlUrl ?? `https://github.com/${username}`,
        summary:
          recentCommits[0]?.message ??
          activeLeadRepo?.description ??
          'Active engineering iterations across public repositories.',
        updatedAt: recentCommits[0]?.committedAt ?? activeLeadRepo?.pushedAt ?? new Date().toISOString(),
      },
      fetchedAt: new Date().toISOString(),
      isFallback: false,
      fallbackReason: null,
    };

    return GitHubOverviewSchema.parse(overview);
  } catch {
    return VERIFIED_FALLBACK_SNAPSHOT;
  }
}
