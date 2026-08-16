import { Shield, Eye, ExternalLink } from "lucide-react";
import { ROOMS, type Ending, type Pick } from "@/game/content";

interface Props {
  ending: Ending;
  decidingRoom: string | null;
  choices: Record<string, Pick>;
  reflection: string;
  onReflection: (v: string) => void;
  onRestart: () => void;
}

export function DebriefScreen({
  ending,
  decidingRoom,
  choices,
  reflection,
  onReflection,
  onRestart,
}: Props) {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="animate-fade mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {ending.title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">The five rooms you walked</h1>

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
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{room.roomName}</p>
                  <p className="text-sm">{pick ? room[pick].title : "—"}</p>
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

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://forms.google.com/placeholder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Share your awareness check <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={onRestart}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Run the startup again
          </button>
        </div>
      </div>
    </main>
  );
}
