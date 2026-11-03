import Anthropic from "@anthropic-ai/sdk";
import type { GitHubData } from "./github";

export type RoastResult = {
  developerType: string;
  emoji: string;
  typeDescription: string;
  roast: string;
  score: number;
  scoreLabel: string;
};

const client = new Anthropic();

export async function roastGitHubProfile(data: GitHubData): Promise<RoastResult> {
  const { profile, repos, stats } = data;
  const accountAge = Math.floor(
    (Date.now() - new Date(profile.created_at).getTime()) / (365 * 24 * 60 * 60 * 1000)
  );

  const repoLines = repos
    .slice(0, 10)
    .map((r) => `- ${r.name} (${r.language ?? "no lang"}, ${r.stargazers_count}⭐, pushed ${r.pushed_at.slice(0, 10)})`)
    .join("\n");

  const langList = Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([l, n]) => `${l} (${n})`)
    .join(", ");

  const prompt = `You are a brutally honest but funny tech roast comedian with a Christmas twist. Roast this GitHub profile.

PROFILE:
- Username: ${profile.login}
- Name: ${profile.name ?? "none"}
- Bio: ${profile.bio ?? "none"}
- Account age: ${accountAge} years old
- Followers: ${profile.followers} | Following: ${profile.following}
- Public repos: ${profile.public_repos} | Stars earned: ${stats.totalStars}
- Original: ${stats.originalRepos} | Forks: ${stats.forkedRepos} | Abandoned (1y+): ${stats.abandonedRepos}
- Languages: ${langList || "none"}

TOP REPOS:
${repoLines}

INSTRUCTIONS:
- The roast must weave in Christmas/holiday metaphors naturally — Santa's naughty list, elves, coal, gift-wrapping bad code, reindeers, Christmas trees, etc.
- Don't force it on every sentence — use 2-3 Christmas references across the 3 paragraphs, keep it natural and funny.
- The developer type and score label should also have a Christmas spin when it fits.
- Be brutal about the actual data (repos, stars, languages) first — Christmas is the seasoning, not the main dish.

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "developerType": "a funny specific title based on the data, with a Christmas twist when it fits",
  "emoji": "one emoji (can be Christmas-themed)",
  "typeDescription": "one sentence max 15 words",
  "roast": "3 short paragraphs separated by newlines, brutal and funny, referencing specific repos/stats with Christmas metaphors woven in",
  "score": <number 1-10>,
  "scoreLabel": "a one-liner for the score, Christmas-flavored"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned) as RoastResult;
}
