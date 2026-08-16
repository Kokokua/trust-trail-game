import { useState } from "react";
import { HelpCircle } from "lucide-react";
import type { RoomDef, Pick } from "@/game/content";

interface Props {
  room: RoomDef;
  onChoose: (pick: Pick) => void;
  onDismiss: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function DecisionCard({ room, onChoose, onDismiss, style, className }: Props) {
  const [asked, setAsked] = useState(false);

  return (
    <div
      style={style}
      className={`animate-pop w-[min(21rem,90vw)] rounded-2xl border border-border bg-popover p-4 shadow-[var(--shadow-card)] ${className ?? ""}`}
    >
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {room.roomName}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed">{room.scenario}</p>

      {!asked ? (
        <button
          onClick={() => setAsked(true)}
          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-3.5 w-3.5" /> Ask a follow-up question
        </button>
      ) : (
        <p className="mt-2.5 rounded-xl bg-secondary/70 p-2.5 text-xs leading-relaxed">
          {room.followUp}
        </p>
      )}

      <div className="mt-3 space-y-2">
        <button
          onClick={() => onChoose("care")}
          className="w-full rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-soft)]"
        >
          <p className="text-sm font-semibold">{room.care.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {room.care.argument}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed opacity-70">{room.care.consequence}</p>
        </button>
        <button
          onClick={() => onChoose("max")}
          className="w-full rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-soft)]"
        >
          <p className="text-sm font-semibold">{room.max.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {room.max.role}: “{room.max.argument}”
          </p>
          <p className="mt-1.5 text-xs leading-relaxed opacity-70">{room.max.consequence}</p>
        </button>
      </div>

      <button
        onClick={onDismiss}
        className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:underline"
      >
        Not right now
      </button>
    </div>
  );
}
