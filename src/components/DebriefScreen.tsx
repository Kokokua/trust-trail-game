import { Shield, Eye, ExternalLink } from "lucide-react";
import { ROOMS, type Ending, type Pick } from "@/game/content";
import { ROOM_FEEDBACK } from "@/game/learning";

interface Props {
  ending: Ending;
  decidingRoom: string | null;
  choices: Record<string, Pick>;
  reflection: string;
  onReflection: (v: string) => void;
  onRestart: () => void;
  onGoToTitle?: () => void;
}

export function DebriefScreen({
  ending,
  decidingRoom,
  choices,
  reflection,
  onReflection,
  onRestart,
  onGoToTitle,
}: Props) {
  const careCount = Object.values(choices).filter((p) => p === "care").length;

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="animate-fade mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {ending.title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">The five rooms you walked</h1>

        {/* ETHICAL AUDIT SUMMARY CARD */}
        <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground">
                Professional Ethics Audit
              </p>
              <h2 className="text-base sm:text-lg font-bold">
                {careCount === 5
                  ? "🌟 Full Compliance (5/5 Ethical Calls)"
                  : careCount >= 3
                    ? `⚖️ Moderate Compliance (${careCount}/5 Ethical Calls)`
                    : `⚠️ Critical Ethical Deficit (${careCount}/5 Ethical Calls)`}
              </h2>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                careCount >= 4
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                  : careCount >= 2
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                    : "bg-destructive/15 text-destructive border border-destructive/30"
              }`}
            >
              {careCount} Sound / {5 - careCount} Dark Pattern{5 - careCount === 1 ? "" : "s"}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {careCount === 5
              ? "All your configurations prioritized human agency, purpose limitation, and user consent over growth metrics."
              : careCount >= 3
                ? `You protected privacy in ${careCount} areas, but sacrificed user autonomy in ${5 - careCount} room(s) to optimize for metrics.`
                : "Your defaults leaned heavily into excessive tracking, compromising user privacy and safety for business growth."}
          </p>
        </div>

        <ol className="mt-6 space-y-2.5">
          {ROOMS.map((room) => {
            const pick = choices[room.id];
            const care = pick === "care";
            const deciding = room.id === decidingRoom;
            return (
              <li
                key={room.id}
                className="flex items-start gap-3 rounded-2xl border p-4 shadow-[var(--shadow-soft)]"
                style={{
                  backgroundColor: care ? "var(--room-care)" : "var(--room-max)",
                  borderColor: deciding ? "var(--risk)" : "transparent",
                  borderWidth: deciding ? 2 : 1,
                }}
              >
                <span className="mt-0.5 rounded-full bg-card/70 p-1.5">
                  {care ? <Shield className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <p className="text-sm font-semibold">{room.roomName}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        care
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {care ? "✅ Ethically Sound" : "⚠️ Ethical Risk / Dark Pattern"}
                    </span>
                  </div>
                  <p className="text-sm">{pick ? room[pick].title : "—"}</p>
                  {pick && ROOM_FEEDBACK[room.id] && (
                    <>
                      <p className="mt-1.5 text-xs font-medium opacity-75">
                        {ROOM_FEEDBACK[room.id]!.principle}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed opacity-80">
                        {ROOM_FEEDBACK[room.id]![pick]}
                      </p>
                    </>
                  )}
                  {deciding && (
                    <p className="mt-1 text-xs font-medium opacity-80">
                      This is the decision that shaped your ending.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Principle at stake
          </p>
          <p className="mt-1 text-sm font-medium">{ending.principle}</p>
          <p className="mt-4 text-sm leading-relaxed">{ending.debrief}</p>
        </section>

        <section className="mt-6">
          <label htmlFor="reflection" className="text-sm font-medium">
            What surprised you about this ending?
          </label>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => onReflection(e.target.value)}
            rows={4}
            placeholder="Write it down while it's fresh…"
            className="mt-2 w-full resize-y rounded-2xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Complete Post-test & Awareness Check →
          </button>
          {onGoToTitle && (
            <button
              onClick={() => {
                if (window.confirm("Return to Main Menu?")) {
                  onGoToTitle();
                }
              }}
              className="rounded-full border border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              Main Menu
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
