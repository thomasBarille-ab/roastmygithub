import { cache } from "react";
import { unstable_cache } from "next/cache";
import { fetchGitHubData, type GitHubData } from "./github";
import { roastGitHubProfile } from "./claude";

// djb2 hash of key profile metrics — changes when the GitHub profile changes
function fingerprint(data: GitHubData): string {
  const str = JSON.stringify({
    repos: data.repos.map((r) => ({ n: r.name, p: r.pushed_at, s: r.stargazers_count })),
    followers: data.profile.followers,
    publicRepos: data.profile.public_repos,
    totalStars: data.stats.totalStars,
  });
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h, 33) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

// Persists in Next.js Data Cache — never auto-revalidates.
// Cache key includes the fingerprint so a profile change produces a fresh roast.
const cachedRoast = unstable_cache(
  async (username: string, _fp: string) => {
    const data = await fetchGitHubData(username);
    return roastGitHubProfile(data);
  },
  ["roast"],
  { revalidate: false }
);

// React cache deduplicates concurrent calls within a single request
export const getRoast = cache(async (username: string) => {
  const data = await fetchGitHubData(username);
  const fp = fingerprint(data);
  const roast = await cachedRoast(username, fp);
  return { roast, profile: data.profile, stats: data.stats };
});
