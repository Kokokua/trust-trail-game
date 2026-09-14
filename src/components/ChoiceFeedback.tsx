import { Scale } from "lucide-react";

interface Props {
  roomName: string;
  choiceTitle: string;
  principle: string;
  body: string;
  realWorld: string;
  remaining: number;
  onClose: () => void;
}

export function ChoiceFeedback({
  roomName,
  choiceTitle,
  principle,
  body,
  realWorld,
  remaining,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-4 py-8">
      <div className="animate-pop max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {roomName} · decision saved
        </p>
        <p className="mt-1 text-base font-semibold">{choiceTitle}</p>

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

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          {remaining > 0 ? `Back to the house · ${remaining} left` : "See what you shipped"}
        </button>
      </div>
    </div>
  );
}
