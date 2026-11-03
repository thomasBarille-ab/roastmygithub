"use client";

type ShareButtonProps = {
  username: string;
  developerType: string;
  score: number;
};

export function ShareButton({ username, developerType, score }: ShareButtonProps) {
  const url = `https://roastmygithub.dev/${username}`;
  const text = `I just got roasted 🔥\n\nVerdict: "${developerType}" — ${score}/10 GitHub Rizz Score\n\nFind out yours 👇`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <a
      href={twitterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 border border-[#30363d] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
      Share on X
    </a>
  );
}
