import type { RoomDef, Pick } from "@/game/content";

interface Props {
  room: RoomDef;
  onChoose: (pick: Pick) => void;
  onDismiss: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function DecisionCard({ room, onChoose, onDismiss, style, className }: Props) {
  return (
    <div
      style={style}
      className={`animate-pop w-[min(20rem,90vw)] rounded-2xl border border-border bg-popover p-4 shadow-[var(--shadow-card)] ${className ?? ""}`}
    >
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {room.roomName}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed">{room.scenario}</p>
      <div className="mt-3 space-y-2">
        {(["care", "max"] as const).map((k) => (
          <button
            key={k}
            onClick={() => onChoose(k)}
            className="w-full rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-soft)]"
          >
            <p className="text-sm font-semibold">{room[k].title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {room[k].argument}
            </p>
          </button>
        ))}
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
