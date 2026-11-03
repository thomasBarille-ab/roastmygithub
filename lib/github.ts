export type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  avatar_url: string;
};

export type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
  created_at: string;
};

export type GitHubData = {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  stats: {
    totalStars: number;
    originalRepos: number;
    forkedRepos: number;
    abandonedRepos: number;
    mostUsedLanguage: string | null;
    languages: Record<string, number>;
  };
};

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

function buildHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim().replace(/^﻿/, "");
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate: 3600 },
  });

  if (res.status === 401) {
    // Token invalid — retry without auth
    const res2 = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res2.ok) {
      if (res2.status === 404) throw new Error("GitHub user not found");
      throw new Error(`GitHub API error: ${res2.status}`);
    }
    return res2.json();
  }

  if (!res.ok) {
    if (res.status === 404) throw new Error("GitHub user not found");
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  if (!GITHUB_USERNAME_RE.test(username)) {
    throw new Error("GitHub user not found");
  }

  const encoded = encodeURIComponent(username);

  const [profile, repos] = await Promise.all([
    githubFetch<GitHubProfile>(`https://api.github.com/users/${encoded}`),
    githubFetch<GitHubRepo[]>(
      `https://api.github.com/users/${encoded}/repos?per_page=100&sort=pushed`
    ),
  ]);

  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const languages: Record<string, number> = {};
  let totalStars = 0;
  let forkedRepos = 0;
  let abandonedRepos = 0;

  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    if (repo.fork) forkedRepos++;
    if (new Date(repo.pushed_at).getTime() < oneYearAgo) abandonedRepos++;
    if (repo.language) languages[repo.language] = (languages[repo.language] ?? 0) + 1;
  }

  const mostUsedLanguage =
    Object.entries(languages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

  return {
    profile,
    repos: repos.slice(0, 20),
    stats: {
      totalStars,
      originalRepos: repos.length - forkedRepos,
      forkedRepos,
      abandonedRepos,
      mostUsedLanguage,
      languages,
    },
  };
}
