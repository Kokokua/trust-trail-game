import { Scale, CheckCircle2, AlertTriangle, Shield, Users } from "lucide-react";
import type { Pick } from "@/game/content";

interface Props {
  roomName: string;
  choiceTitle: string;
  pick: Pick;
  principle: string;
  body: string;
  realWorld: string;
  remaining: number;
  onClose: () => void;
}

export function ChoiceFeedback({
  roomName,
  choiceTitle,
  pick,
  principle,
  body,
  realWorld,
  remaining,
  onClose,
}: Props) {
  const isEthical = pick === "care";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-4 py-8">
      <div className="animate-pop max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {roomName} · decision saved
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isEthical
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
            }`}
          >
            {isEthical ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Ethically Sound
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" /> Ethical Concern
              </>
            )}
          </span>
        </div>
        <p className="mt-2 text-base font-semibold">{choiceTitle}</p>

        {/* METRIC IMPACT SUMMARY BAR */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/60 p-2.5 border border-border/60 text-xs">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">
            Impact:
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-[11px] ${
              isEthical
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            <Shield className="h-3 w-3" /> {isEthical ? "+1 Trust" : "-1 Trust"}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-[11px] ${
              isEthical
                ? "bg-secondary text-muted-foreground"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
            }`}
          >
            <AlertTriangle className="h-3 w-3" /> {isEthical ? "0 Risk" : "+1 Risk"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-[11px] bg-primary/15 text-primary ml-auto">
            <Users className="h-3 w-3" /> {isEthical ? "+210 Users" : "+640 Users"}
          </span>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-secondary/70 p-3">
          <Scale className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-sm font-medium leading-relaxed">{principle}</p>
        </div>

        <p className="mt-4 text-sm leading-relaxed">{body}</p>

        <div className="mt-4 rounded-2xl border border-border/70 p-3">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Out in the world
          </p>
          <p className="mt-1 text-sm leading-relaxed">{realWorld}</p>
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 shadow-sm"
          >
            {remaining > 0 ? `Back to the house · ${remaining} left` : "See what you shipped"}
          </button>
        </div>
      </div>
    </div>
  );
}
