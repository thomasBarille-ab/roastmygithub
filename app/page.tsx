import { roastAction } from "./actions";
import { Snow } from "@/components/Snow";

export const metadata = {
  title: "Roast My GitHub — Get brutally honest feedback on your profile",
  description:
    "Paste your GitHub username and get a savage roast of your developer profile. Share the pain.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4 overflow-hidden">
      <Snow />

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="text-6xl">🎄</div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Roast My GitHub
          </h1>
          <p className="text-slate-400 text-lg">
            Get a brutally honest roast of your GitHub profile.
            <br />
            Share the pain. Embrace the truth.
          </p>
        </div>

        <form action={roastAction} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="username"
              placeholder="github.com/your-username or just username"
              required
              className="flex-1 bg-[#0f172a] border border-[#1e3a5f] text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c41e3a] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#c41e3a] hover:bg-[#a01830] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Roast me 🎅
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          <span>🔓 Public profiles only</span>
          <span>·</span>
          <span>🎁 Free</span>
          <span>·</span>
          <span>💀 No mercy</span>
        </div>
      </div>

      <footer className="absolute bottom-6 z-10 text-slate-500 text-xs">
        Built by{" "}
        <a
          href="https://github.com/thomasBarille-ab"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c41e3a] hover:underline"
        >
          @thomasBarille-ab
        </a>
      </footer>
    </main>
  );
}
