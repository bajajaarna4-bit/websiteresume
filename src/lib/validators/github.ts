import { z } from 'zod';

export const GitHubProfileSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string().min(1),
  htmlUrl: z.string().url(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  publicRepos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  createdAt: z.string(),
});

export const GitHubRepoSummarySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  fullName: z.string(),
  htmlUrl: z.string().url(),
  homepage: z.string().nullable(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  openIssues: z.number().int().nonnegative(),
  sizeKb: z.number().int().nonnegative(),
  topics: z.array(z.string()),
  updatedAt: z.string(),
  pushedAt: z.string(),
  isFork: z.boolean(),
});

export const GitHubRecentCommitSchema = z.object({
  sha: z.string(),
  repoName: z.string(),
  repoUrl: z.string().url(),
  message: z.string(),
  committedAt: z.string(),
});

export const GitHubLanguageStatSchema = z.object({
  language: z.string(),
  count: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
});

export const GitHubActivityDaySchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative(),
});

export const GitHubOverviewSchema = z.object({
  profile: GitHubProfileSchema,
  repos: z.array(GitHubRepoSummarySchema),
  totalStars: z.number().int().nonnegative(),
  languages: z.array(GitHubLanguageStatSchema),
  recentCommits: z.array(GitHubRecentCommitSchema),
  activityDays: z.array(GitHubActivityDaySchema),
  nowBuilding: z.object({
    repoName: z.string(),
    repoUrl: z.string().url(),
    summary: z.string(),
    updatedAt: z.string(),
  }),
  fetchedAt: z.string(),
  isFallback: z.boolean(),
  fallbackReason: z.string().nullable(),
});

export type GitHubProfile = z.infer<typeof GitHubProfileSchema>;
export type GitHubRepoSummary = z.infer<typeof GitHubRepoSummarySchema>;
export type GitHubRecentCommit = z.infer<typeof GitHubRecentCommitSchema>;
export type GitHubLanguageStat = z.infer<typeof GitHubLanguageStatSchema>;
export type GitHubActivityDay = z.infer<typeof GitHubActivityDaySchema>;
export type GitHubOverview = z.infer<typeof GitHubOverviewSchema>;
