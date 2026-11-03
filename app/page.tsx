import { roastAction } from "./actions";

export const metadata = {
  title: "Roast My GitHub — Get brutally honest AI feedback on your profile",
  description:
    "Paste your GitHub username and get a savage, AI-powered roast of your developer profile. Share the pain.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="text-6xl">🔥</div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Roast My GitHub
          </h1>
          <p className="text-[#8b949e] text-lg">
            Get a brutally honest AI-powered roast of your GitHub profile.
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
              className="flex-1 bg-[#161b22] border border-[#30363d] text-white placeholder-[#8b949e] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#58a6ff] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#238636] hover:bg-[#2ea043] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Roast me 🔥
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-6 text-xs text-[#8b949e]">
          <span>⚡ Powered by Claude AI</span>
          <span>·</span>
          <span>🔓 Public profiles only</span>
          <span>·</span>
          <span>💀 No mercy</span>
        </div>
      </div>

      <footer className="absolute bottom-6 text-[#8b949e] text-xs">
        Built by{" "}
        <a
          href="https://github.com/thomasbarillot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#58a6ff] hover:underline"
        >
          @thomasbarillot
        </a>
      </footer>
    </main>
  );
}
