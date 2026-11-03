import { notFound } from "next/navigation";
import Link from "next/link";
import { Snow } from "@/components/Snow";
import { fetchGitHubData } from "@/lib/github";
import { roastGitHubProfile } from "@/lib/claude";
import { ShareButton } from "@/components/ShareButton";
import type { Metadata } from "next";

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://roast-my-github-snowy.vercel.app";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const ogUrl = `${BASE_URL}/api/og?username=${encodeURIComponent(username)}`;
  return {
    title: `${username}'s GitHub Roast 🔥`,
    description: `See how ${username}'s GitHub profile got roasted. Share the pain.`,
    openGraph: {
      title: `${username} just got roasted 🔥`,
      description: `See how ${username}'s GitHub profile got roasted.`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} just got roasted 🔥`,
      description: `See how ${username}'s GitHub profile got roasted.`,
      images: [ogUrl],
    },
  };
}

export default async function RoastPage({ params }: Props) {
  const { username } = await params;

  if (!GITHUB_USERNAME_RE.test(username)) notFound();

  const githubData = await fetchGitHubData(username).catch((err: Error) => {
    if (err.message.includes("not found")) notFound();
    throw err;
  });

  const roast = await roastGitHubProfile(githubData);

  const { profile, stats } = githubData;
  const paragraphs = roast.roast.split(/\n+/).filter(Boolean);

  const ogUrl = `${BASE_URL}/api/og?${new URLSearchParams({
    username: profile.login,
    type: roast.developerType,
    emoji: roast.emoji,
    score: String(roast.score),
    label: roast.scoreLabel,
  }).toString()}`;

  return (
    <main className="relative min-h-screen bg-[#0a0e1a] px-4 py-12 overflow-hidden">
      <Snow />
      <div className="relative z-10 max-w-2xl mx-auto space-y-8">

        <div className="text-center space-y-4">
          <Link href="/" className="text-slate-500 text-sm hover:text-white transition-colors">
            ← Roast another profile
          </Link>
          <div className="flex items-center justify-center gap-3 mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="w-12 h-12 rounded-full border-2 border-[#c41e3a]"
            />
            <div className="text-left">
              <div className="text-white font-semibold">{profile.name ?? profile.login}</div>
              <div className="text-slate-400 text-sm">@{profile.login}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-[#1e3a5f] rounded-xl p-6 text-center space-y-3">
          <div className="text-5xl">{roast.emoji}</div>
          <h1 className="text-2xl font-bold text-white">{roast.developerType}</h1>
          <p className="text-slate-400">{roast.typeDescription}</p>
          <div className="inline-flex items-center gap-2 bg-[#0a0e1a] border border-[#1e3a5f] rounded-full px-4 py-1.5">
            <span className="text-yellow-400 font-bold text-lg">{roast.score}/10</span>
            <span className="text-slate-400 text-sm">GitHub Rizz Score</span>
            <span className="text-slate-500 text-xs">— {roast.scoreLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Repos", value: profile.public_repos },
            { label: "Stars", value: stats.totalStars },
            { label: "Abandoned", value: stats.abandonedRepos },
            { label: "Followers", value: profile.followers },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#0f172a] border border-[#1e3a5f] rounded-lg p-3 text-center">
              <div className="text-white font-bold text-lg">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0f172a] border border-[#1e3a5f] rounded-xl p-6 space-y-4">
          <h2 className="text-[#c41e3a] font-semibold text-sm uppercase tracking-wider">🎄 The Roast</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-slate-300 leading-relaxed">{p}</p>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-slate-500 text-sm">Think you can handle the truth? Share it.</p>
          <ShareButton username={profile.login} developerType={roast.developerType} score={roast.score} ogUrl={ogUrl} />
        </div>

        <p className="text-center text-slate-600 text-xs pb-4">
          Built by{" "}
          <a href="https://github.com/thomasBarille-ab" target="_blank" rel="noopener noreferrer" className="text-[#c41e3a] hover:underline">
            @thomasBarille-ab
          </a>
        </p>
      </div>
    </main>
  );
}
