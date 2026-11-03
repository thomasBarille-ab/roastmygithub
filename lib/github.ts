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
  topics: string[];
};

export type GitHubData = {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  languages: Record<string, number>;
  stats: {
    totalStars: number;
    originalRepos: number;
    forkedRepos: number;
    abandonedRepos: number;
    avgRepoAge: number;
    mostUsedLanguage: string | null;
  };
};

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

const GITHUB_HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function githubFetch<T>(url: string): Promise<T> {
  let res = await fetch(url, { headers: GITHUB_HEADERS, next: { revalidate: 3600 } });

  // Token invalid or revoked — retry without auth
  if (res.status === 401) {
    res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
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

  const encodedUsername = encodeURIComponent(username);
  const [profile, repos] = await Promise.all([
    githubFetch<GitHubProfile>(`https://api.github.com/users/${encodedUsername}`),
    githubFetch<GitHubRepo[]>(
      `https://api.github.com/users/${encodedUsername}/repos?per_page=100&sort=pushed`
    ),
  ]);

  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;

  const languageCounts: Record<string, number> = {};
  let totalStars = 0;
  let forkedRepos = 0;
  let abandonedRepos = 0;
  let totalAgeMs = 0;

  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    if (repo.fork) forkedRepos++;
    const lastPush = new Date(repo.pushed_at).getTime();
    if (now - lastPush > oneYearMs) abandonedRepos++;
    totalAgeMs += now - new Date(repo.created_at).getTime();
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] ?? 0) + 1;
    }
  }

  const mostUsedLanguage =
    Object.entries(languageCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

  return {
    profile,
    repos: repos.slice(0, 30),
    languages: languageCounts,
    stats: {
      totalStars,
      originalRepos: repos.length - forkedRepos,
      forkedRepos,
      abandonedRepos,
      avgRepoAge: repos.length ? Math.floor(totalAgeMs / repos.length / oneYearMs) : 0,
      mostUsedLanguage,
    },
  };
}
