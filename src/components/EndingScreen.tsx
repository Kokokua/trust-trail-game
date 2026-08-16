import type { Ending } from "@/game/content";

export function EndingScreen({ ending, onContinue }: { ending: Ending; onContinue: () => void }) {
  const warm = ending.tone === "warm";
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div
        className="animate-pop w-full max-w-xl rounded-3xl border p-8 shadow-[var(--shadow-card)]"
        style={{
          backgroundColor: warm ? "var(--room-care)" : "var(--room-max)",
          borderColor: warm ? "var(--trust)" : "var(--risk-soft)",
        }}
      >
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase opacity-70">
          Two years later
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight">{ending.title}</h1>
        <p className="mt-4 text-sm leading-relaxed">{ending.summary}</p>
        <div className="mt-5 rounded-2xl bg-card/70 p-4">
          <p className="text-[11px] font-semibold tracking-wide uppercase opacity-70">
            In the real world
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{ending.realWorld}</p>
        </div>
        <button
          onClick={onContinue}
          className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          See how you got here
        </button>
      </div>
    </main>
  );
}
