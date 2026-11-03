import { Snow } from "@/components/Snow";

export default function LoadingPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4 overflow-hidden">
      <Snow />
      <div className="relative z-10 max-w-xl w-full text-center space-y-6">
        <div className="text-5xl animate-bounce">🎅</div>
        <h2 className="text-2xl font-bold text-white">Checking the naughty list...</h2>
        <p className="text-slate-400">
          Carefully reading your commits and judging your life choices.
        </p>
        <div className="flex justify-center gap-1.5 pt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#c41e3a] animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
