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

function buildPrompt(data: GitHubData): string {
  const { profile, repos, stats } = data;
  const accountAge = Math.floor(
    (Date.now() - new Date(profile.created_at).getTime()) / (365 * 24 * 60 * 60 * 1000)
  );

  const repoSummary = repos
    .slice(0, 10)
    .map((r) => `- ${r.name} (${r.language ?? "no language"}, ${r.stargazers_count}⭐, last push: ${r.pushed_at.slice(0, 10)})`)
    .join("\n");

  const languageList = Object.entries(data.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([lang, count]) => `${lang} (${count} repos)`)
    .join(", ");

  return `You are a brutally honest but funny tech roast comedian. Roast this GitHub profile.

GITHUB PROFILE DATA:
- Username: ${profile.login}
- Name: ${profile.name ?? "No name (mysterious)"}
- Bio: ${profile.bio ?? "No bio (a true enigma)"}
- Account age: ${accountAge} years
- Followers: ${profile.followers} | Following: ${profile.following}
- Public repos: ${profile.public_repos}
- Total stars: ${stats.totalStars}
- Original repos: ${stats.originalRepos} | Forked repos: ${stats.forkedRepos}
- Abandoned repos (no push in 1+ year): ${stats.abandonedRepos}
- Languages: ${languageList || "none"}
- Most used language: ${stats.mostUsedLanguage ?? "none"}

TOP REPOS:
${repoSummary}

INSTRUCTIONS:
Return a JSON object with exactly these fields:
- "developerType": a funny, specific title (e.g. "The Side-Project Graveyard Keeper", "The README Artist", "The Tutorial Hoarder") — be creative, base it on the actual data
- "emoji": one single emoji matching the developer type
- "typeDescription": one short sentence describing this developer type (max 15 words)
- "roast": 3 short paragraphs roasting this developer. Be brutal but funny. Reference specific repos, languages, stats. Do NOT be generic. Each paragraph is 2-3 sentences.
- "score": a number from 1 to 10 representing their "GitHub Rizz Score" — be harsh
- "scoreLabel": a one-liner label for the score (e.g. "Barely sentient" for 1, "Glorified tutorial cloner" for 3, etc.)

Return ONLY valid JSON, no markdown, no explanation.`;
}

export async function roastGitHubProfile(data: GitHubData): Promise<RoastResult> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: buildPrompt(data) }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  const result = JSON.parse(cleaned) as RoastResult;
  return result;
}
