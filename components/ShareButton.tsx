"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  username: string;
  developerType: string;
  score: number;
  ogUrl: string;
};

export function ShareButton({ username, developerType, score, ogUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const tweetText = `I just got roasted 🎄🔥\n\nVerdict: "${developerType}" — ${score}/10 GitHub Rizz Score\n\nFind out yours 👇`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(`https://roast-my-github-snowy.vercel.app/${username}`)}`;

  async function downloadCard() {
    setDownloading(true);
    try {
      const res = await fetch(ogUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${username}-roast-card.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 bg-[#c41e3a] hover:bg-[#a01830] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
      >
        🎁 Share my roast
      </button>

      {open && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#0f172a] border border-[#1e3a5f] rounded-xl p-3 flex gap-2 shadow-xl w-72">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex-1 flex flex-col items-center gap-2 bg-black hover:bg-zinc-900 border border-[#1e3a5f] rounded-lg px-4 py-3 text-white text-xs font-medium transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
            Post on X
          </a>

          <button
            onClick={downloadCard}
            disabled={downloading}
            className="flex-1 flex flex-col items-center gap-2 bg-[#0a0e1a] hover:bg-[#0f172a] border border-[#1e3a5f] rounded-lg px-4 py-3 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {downloading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            )}
            {downloading ? "Saving..." : "Save card"}
          </button>
        </div>
      )}
    </div>
  );
}
