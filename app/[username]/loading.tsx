export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="text-5xl animate-bounce">🔥</div>
        <h2 className="text-2xl font-bold text-white">Roasting in progress...</h2>
        <p className="text-[#8b949e]">
          Claude is carefully reading your commits and judging your life choices.
        </p>
        <div className="flex justify-center gap-1.5 pt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#238636] animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
