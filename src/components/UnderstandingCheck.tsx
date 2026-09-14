import { useState } from "react";
import { Check, X } from "lucide-react";
import { CHECK_ITEMS, scoreCheck } from "@/game/learning";

interface Props {
  mode: "before" | "after";
  answers: Record<string, string>;
  onAnswer: (itemId: string, optionId: string) => void;
  /** baseline answers, for the after pass */
  baseline?: Record<string, string>;
  onDone: () => void;
  onRestart?: () => void;
}

export function UnderstandingCheck({
  mode,
  answers,
  onAnswer,
  baseline,
  onDone,
  onRestart,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const after = mode === "after";
  const answeredAll = CHECK_ITEMS.every((i) => answers[i.id]);
  const score = scoreCheck(answers);
  const before = baseline ? scoreCheck(baseline) : 0;
  const delta = score - before;

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="animate-fade mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {after ? "After the build" : "Before you start"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {after ? "The same five calls, one more time" : "Five founder's calls, on paper"}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {after
            ? "You answered these before you built anything. Answer again — then we'll show both runs side by side."
            : "Answer from instinct. Nothing is scored yet, and nothing here is right or wrong until you've seen what your product does."}
        </p>

        <div className="mt-7 space-y-5">
          {CHECK_ITEMS.map((item, idx) => {
            const picked = answers[item.id];
            const wasPicked = baseline?.[item.id];
            return (
              <section
                key={item.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {idx + 1} of {CHECK_ITEMS.length} · {item.principle}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{item.prompt}</p>
                <div className="mt-3 space-y-2">
                  {item.options.map((opt) => {
                    const chosen = picked === opt.id;
                    const isKey = opt.id === item.key;
                    const show = after && revealed;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => !revealed && onAnswer(item.id, opt.id)}
                        disabled={revealed}
                        className={`flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left text-sm transition-all ${
                          show && isKey
                            ? "border-primary bg-primary/10"
                            : chosen
                              ? "border-primary bg-primary/5"
                              : "border-border hover:-translate-y-0.5 hover:border-primary/60"
                        }`}
                      >
                        {show && (isKey ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : chosen ? <X className="mt-0.5 h-4 w-4 shrink-0" /> : <span className="h-4 w-4 shrink-0" />)}
                        <span className="leading-relaxed">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                {after && revealed && (
                  <div className="mt-3 rounded-2xl bg-secondary/70 p-3">
                    <p className="text-sm leading-relaxed">{item.explain}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Before playing you chose:{" "}
                      {item.options.find((o) => o.id === wasPicked)?.label ?? "—"}
                      {wasPicked === item.key ? " (already on the mark)" : ""}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {after && revealed && (
          <section className="mt-7 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              What changed
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {before} → {score} of {CHECK_ITEMS.length}
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              {delta > 0
                ? `You shifted on ${delta} ${delta === 1 ? "call" : "calls"} after building the product. The reasoning above is what moved.`
                : delta === 0 && score === CHECK_ITEMS.length
                  ? "You came in reading these the way practice does, and the build didn't shake it. The debrief is where the harder cost lives."
                  : delta === 0
                    ? "Your reading held steady. Look at the items still off the mark — the reasoning under each one is the part worth arguing with."
                    : "You moved away from practice on some items. That's worth sitting with: which argument in the house convinced you?"}
            </p>
          </section>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!after && (
            <button
              onClick={onDone}
              disabled={!answeredAll}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start building
            </button>
          )}
          {after && !revealed && (
            <button
              onClick={() => setRevealed(true)}
              disabled={!answeredAll}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Compare with your first run
            </button>
          )}
          {after && revealed && onRestart && (
            <button
              onClick={onRestart}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Play again, different path
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
