import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, X, Award, BarChart3, CheckCircle2, ChevronLeft } from "lucide-react";
import { CHECK_ITEMS, scoreCheck } from "@/game/learning";
import { LIKERT_QUESTIONS, ETHICAL_CONCEPTS } from "@/game/survey";
import type { ParticipantRecord } from "@/game/participantStorage";

interface Props {
  mode: "before" | "after";
  answers: Record<string, string>;
  onAnswer: (itemId: string, optionId: string) => void;
  likertAnswers: Record<string, number>;
  onLikertAnswer: (qId: string, val: number) => void;
  baseline?: Record<string, string> | undefined;
  baselineLikert?: Record<string, number> | undefined;
  endingTitle?: string | undefined;
  priorExp?: "Yes" | "No" | "" | undefined;
  onPriorExp?: ((v: "Yes" | "No") => void) | undefined;
  selectedConcepts?: string[] | undefined;
  onToggleConcept?: ((concept: string) => void) | undefined;
  whyUnfair?: string | undefined;
  onWhyUnfair?: ((v: string) => void) | undefined;
  satisfaction?: number | undefined;
  onSatisfaction?: ((v: number) => void) | undefined;
  improvement?: string | undefined;
  onImprovement?: ((v: string) => void) | undefined;
  onDone: () => void;
  onRestart?: (() => void) | undefined;
  onStartNewParticipant?: (() => void) | undefined;
  onGoToTitle?: (() => void) | undefined;
  onSubmitRecord?: (() => void) | undefined;
  submittedRecordId?: string | undefined;
}

export function UnderstandingCheck({
  mode,
  answers,
  onAnswer,
  likertAnswers,
  onLikertAnswer,
  baseline,
  baselineLikert,
  priorExp = "Yes",
  onPriorExp,
  selectedConcepts = [],
  onToggleConcept,
  whyUnfair = "",
  onWhyUnfair,
  satisfaction = 9,
  onSatisfaction,
  improvement = "",
  onImprovement,
  onDone,
  onRestart,
  onStartNewParticipant,
  onGoToTitle,
  onSubmitRecord,
  submittedRecordId,
}: Props) {
  const [revealed, setRevealed] = useState(!!submittedRecordId);
  const after = mode === "after";

  const answeredKnowledgeCount = CHECK_ITEMS.filter((i) => answers[i.id]).length;
  const answeredLikertCount = LIKERT_QUESTIONS.filter((q) => typeof likertAnswers[q.id] === "number").length;
  const answeredKnowledge = answeredKnowledgeCount === CHECK_ITEMS.length;
  const answeredLikert = answeredLikertCount === LIKERT_QUESTIONS.length;
  const totalMandatory = after ? 11 : 10;
  const answeredMandatory = answeredKnowledgeCount + answeredLikertCount + (after ? (whyUnfair.trim().length > 0 || revealed ? 1 : 0) : 0);
  const progressPct = Math.min(100, Math.round((answeredMandatory / totalMandatory) * 100));

  const answeredAll = after
    ? answeredKnowledge && answeredLikert && (whyUnfair.trim().length > 0 || revealed)
    : answeredKnowledge && answeredLikert;

  const score = scoreCheck(answers);
  const before = baseline ? scoreCheck(baseline) : 0;
  const delta = score - before;

  const handleSubmit = () => {
    if (onSubmitRecord) {
      onSubmitRecord();
    }
    setRevealed(true);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="animate-fade mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onGoToTitle && (
              <button
                onClick={() => {
                  if (window.confirm("Return to Main Menu? Current progress in this session will be reset.")) {
                    onGoToTitle();
                  }
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="Return to Main Menu"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Main Menu</span>
              </button>
            )}
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {after ? "After the build · Post-test & Survey" : "Before you start · Pre-test & Baseline"}
            </p>
          </div>
          <Link
            to="/results"
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <BarChart3 className="h-3 w-3" /> View Results
          </Link>
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {after ? "Knowledge & Awareness Post-Check" : "Five founder's calls & Awareness Baseline"}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {after
            ? "Answer the five founder's decisions again and complete the short awareness check. We will compare your before & after results and save your response."
            : "Answer from instinct. Part 1 presents five real product situations, and Part 2 establishes your initial baseline on IoT privacy and engineering responsibility."}
        </p>

        {submittedRecordId && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-primary/10 p-3.5 text-sm font-medium text-primary">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>
              Your testing data has been saved as <strong>Participant #{submittedRecordId}</strong>.
            </span>
          </div>
        )}

        {/* STICKY PROGRESS BANNER */}
        <div className="mt-6 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur-md sticky top-3 z-20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Completion Progress:</span>
              <span className="font-semibold text-primary tabular-nums">
                {answeredMandatory} / {totalMandatory} answered ({progressPct}%)
              </span>
            </div>
            {answeredMandatory === totalMandatory ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" /> All questions completed!
              </span>
            ) : (
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                {totalMandatory - answeredMandatory} pending
              </span>
            )}
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* PART 1: 5 SCENARIO QUESTIONS */}
        <div className="mt-8">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Award className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Part 1: Ethical Knowledge & Judgment (5 Decisions)
            </h2>
          </div>

          <div className="mt-5 space-y-5">
            {CHECK_ITEMS.map((item, idx) => {
              const picked = answers[item.id];
              const wasPicked = baseline?.[item.id];
              return (
                <section
                  key={item.id}
                  className={`rounded-3xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all ${
                    picked
                      ? "border-border"
                      : "border-amber-500/40 ring-1 ring-amber-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {idx + 1} of {CHECK_ITEMS.length} · {item.principle}
                    </p>
                    {picked ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        ✓ Answered
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
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
                              ? "border-primary bg-primary/10 font-medium"
                              : chosen
                                ? "border-primary bg-primary/5"
                                : "border-border hover:-translate-y-0.5 hover:border-primary/60"
                          }`}
                        >
                          {show &&
                            (isKey ? (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            ) : chosen ? (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                            ) : (
                              <span className="h-4 w-4 shrink-0" />
                            ))}
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
        </div>

        {/* PART 2: 5 LIKERT SCALE ATTITUDE QUESTIONS (PROPOSAL PAGE 8) */}
        <div className="mt-10">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Part 2: Privacy Awareness & Engineering Responsibility (Scale 1–5)
            </h2>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            From 1 (Strongly Disagree / Not at all) to 5 (Strongly Agree / Completely).
          </p>

          <div className="mt-5 space-y-4">
            {LIKERT_QUESTIONS.map((q, idx) => {
              const val = likertAnswers[q.id];
              const prevVal = baselineLikert?.[q.id];
              const answered = typeof val === "number";
              return (
                <section
                  key={q.id}
                  className={`rounded-3xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all ${
                    answered
                      ? "border-border"
                      : "border-amber-500/40 ring-1 ring-amber-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Statement {idx + 1} of {LIKERT_QUESTIONS.length} · {q.dimension}
                    </p>
                    {answered ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        ✓ Answered
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed">{q.prompt}</p>

                  <div className="mt-3 flex items-center justify-between gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        disabled={revealed}
                        onClick={() => !revealed && onLikertAnswer(q.id, n)}
                        className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border text-sm font-semibold transition-all ${
                          val === n
                            ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                            : "border-border bg-background hover:border-primary/60 hover:bg-secondary"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                    <span>1 (Strongly Disagree)</span>
                    <span>3 (Neutral)</span>
                    <span>5 (Strongly Agree)</span>
                  </div>

                  {after && revealed && typeof prevVal === "number" && (
                    <p className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
                      Before playing rating: <strong>{prevVal} / 5</strong> → After playing:{" "}
                      <strong>{val} / 5</strong>
                      {q.reverse && (
                        <span className="ml-1 text-[11px] opacity-80">
                          (Reverse-scored: lower agreement shows increased ethical caution)
                        </span>
                      )}
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        {/* PART 3: QUALITATIVE & USER TESTING SURVEY (AFTER PASS ONLY) */}
        {after && (
          <div className="mt-10">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Award className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Part 3: Qualitative Reflection & Evaluation
              </h2>
            </div>

            <div className="mt-5 space-y-5">
              {/* Prior Experience */}
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-medium">
                  Have you ever used or owned a smart-home device?
                </p>
                <div className="mt-3 flex gap-3">
                  {(["Yes", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      disabled={revealed}
                      onClick={() => !revealed && onPriorExp && onPriorExp(opt)}
                      className={`rounded-2xl border px-5 py-2 text-sm font-medium transition-all ${
                        priorExp === opt
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-secondary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </section>

              {/* Ethical Concepts Multi-select */}
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-medium">
                  Which ethical concepts did this simulator make you think about?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ETHICAL_CONCEPTS.map((concept) => {
                    const selected = selectedConcepts.includes(concept);
                    return (
                      <button
                        key={concept}
                        disabled={revealed}
                        onClick={() => !revealed && onToggleConcept && onToggleConcept(concept)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                          selected
                            ? "border-primary bg-primary/15 text-foreground font-semibold"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {concept}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Qualitative Insight */}
              <section
                className={`rounded-3xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all ${
                  whyUnfair.trim().length > 0
                    ? "border-border"
                    : "border-amber-500/40 ring-1 ring-amber-500/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="whyUnfair" className="text-sm font-medium">
                    In your own words: Why is &ldquo;agreeing to legal terms&rdquo; not the same as
                    &ldquo;informed consent&rdquo;?
                  </label>
                  {whyUnfair.trim().length > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      ✓ Answered
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      Required
                    </span>
                  )}
                </div>
                <textarea
                  id="whyUnfair"
                  disabled={revealed}
                  value={whyUnfair}
                  onChange={(e) => onWhyUnfair && onWhyUnfair(e.target.value)}
                  rows={3}
                  placeholder="Share a thought from your experience playing the startup founder..."
                  className="mt-2.5 w-full resize-y rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                />
              </section>

              {/* Satisfaction */}
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Overall satisfaction with this learning platform:
                  </span>
                  <span className="text-base font-bold text-primary">{satisfaction} / 10</span>
                </div>
                <input
                  type="range"
                  disabled={revealed}
                  min={1}
                  max={10}
                  value={satisfaction}
                  onChange={(e) => onSatisfaction && onSatisfaction(Number(e.target.value))}
                  className="mt-3 w-full accent-primary cursor-pointer"
                />
              </section>

              {/* Suggestions */}
              <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <label htmlFor="improvement" className="text-sm font-medium">
                  What part of the experience do you think we should improve? (Optional)
                </label>
                <textarea
                  id="improvement"
                  disabled={revealed}
                  value={improvement}
                  onChange={(e) => onImprovement && onImprovement(e.target.value)}
                  rows={2}
                  placeholder="Suggestions or bug reports..."
                  className="mt-2.5 w-full resize-y rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                />
              </section>
            </div>
          </div>
        )}

        {/* COMPARISON RESULT SECTION */}
        {after && revealed && (
          <section className="animate-pop mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              What changed · Knowledge & Awareness Shift
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              Knowledge Score: {before} → {score} of {CHECK_ITEMS.length}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {delta > 0
                ? `You shifted on ${delta} ${delta === 1 ? "call" : "calls"} after building the product. The reasoning above explains what changed.`
                : delta === 0 && score === CHECK_ITEMS.length
                  ? "You came in reading these the way practice does, and the build confirmed it. The debrief is where the harder cost lives."
                  : delta === 0
                    ? "Your reading held steady. Look at the items still off the mark — the reasoning under each one is the part worth arguing with."
                    : "You moved away from practice on some items. That's worth sitting with: which argument in the house convinced you?"}
            </p>
          </section>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {!after && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={onDone}
                disabled={!answeredAll}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
              >
                Proceed to Smart Home Blueprint →
              </button>
              {!answeredAll && (
                <span className="text-xs text-muted-foreground italic">
                  * Please answer all 5 knowledge calls and 5 survey questions above to proceed.
                </span>
              )}
            </div>
          )}

          {after && !revealed && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={!answeredAll}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
              >
                Submit Awareness Check & Compare Results
              </button>
              {!answeredAll && (
                <span className="text-xs text-muted-foreground italic">
                  * Please answer the 5 knowledge calls, 5 survey questions, and brief reflection above to submit.
                </span>
              )}
            </div>
          )}

          {after && revealed && (
            <>
              {onStartNewParticipant && (
                <button
                  onClick={onStartNewParticipant}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 shadow-sm"
                >
                  + Start Next Participant Session
                </button>
              )}
              {onRestart && (
                <button
                  onClick={onRestart}
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Replay same baseline
                </button>
              )}
              <Link
                to="/results"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <BarChart3 className="h-4 w-4" /> View All Participant Data (/results)
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
