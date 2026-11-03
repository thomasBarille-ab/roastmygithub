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

  const prompt = `You are a brutally honest but funny tech roast comedian. Roast this GitHub profile.

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

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "developerType": "a funny specific title based on the data",
  "emoji": "one emoji",
  "typeDescription": "one sentence max 15 words",
  "roast": "3 short paragraphs separated by newlines, brutal and funny, referencing specific repos and stats",
  "score": <number 1-10>,
  "scoreLabel": "a one-liner for the score"
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
