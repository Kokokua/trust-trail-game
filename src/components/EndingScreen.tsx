import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Ending, Pick } from "@/game/content";

export function EndingScreen({
  ending,
  choices = {},
  onContinue,
  onGoToTitle,
}: {
  ending: Ending;
  choices?: Record<string, Pick>;
  onContinue: () => void;
  onGoToTitle?: () => void;
}) {
  const warm = ending.tone === "warm";
  const careCount = Object.values(choices).filter((p) => p === "care").length;
  const isHighEthics = careCount >= 4;
  const isModerateEthics = careCount >= 2;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div
        className="animate-pop w-full max-w-xl rounded-3xl border p-8 shadow-[var(--shadow-card)]"
        style={{
          backgroundColor: warm ? "var(--room-care)" : "var(--room-max)",
          borderColor: warm ? "var(--trust)" : "var(--risk-soft)",
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase opacity-70">
            Two years later
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isHighEthics
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                : isModerateEthics
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                  : "bg-destructive/15 text-destructive border border-destructive/30"
            }`}
          >
            {isHighEthics ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : isModerateEthics ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            Ethical Score: {careCount}/5 Sound Calls
          </span>
        </div>

        <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight">{ending.title}</h1>
        <p className="mt-4 text-sm leading-relaxed">{ending.summary}</p>

        {/* ETHICAL VERDICT CARD */}
        <div className="mt-5 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-[var(--shadow-soft)]">
          <p className="text-[11px] font-semibold tracking-wide uppercase opacity-75">
            Ethical Verdict & Professional Standpoint
          </p>
          <p className="mt-1 text-sm font-medium">
            {isHighEthics
              ? "🌟 High Ethical Integrity: Decisions prioritized user trust, privacy, and safety."
              : isModerateEthics
                ? "⚖️ Compromised Integrity: Several decisions sacrificed user agency for commercial metrics."
                : "🚫 Critical Ethical Liability: Product defaults violate fundamental Privacy by Design principles."}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-card/60 p-4">
          <p className="text-[11px] font-semibold tracking-wide uppercase opacity-70">
            In the real world
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{ending.realWorld}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onContinue}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            See debrief & principles breakdown →
          </button>
          {onGoToTitle && (
            <button
              onClick={() => {
                if (window.confirm("Return to Main Menu?")) {
                  onGoToTitle();
                }
              }}
              className="rounded-full border border-border bg-card/60 px-4 py-2.5 text-xs font-medium hover:bg-secondary transition-colors"
            >
              Main Menu
            </button>
          )}
        </div>
        {ending.citation && (
          <p className="mt-6 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
            {ending.citation.text}{" "}
            <a
              href={ending.citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Read more
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
