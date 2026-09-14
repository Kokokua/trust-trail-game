import { Shield, Eye, Radio } from "lucide-react";
import { ROOMS, type Pick, type RoomDef } from "@/game/content";

export const DATA_TRAIL_DESTINATIONS: Record<
  string,
  { care: string; maxDestination: string; maxLabel: string }
> = {
  living: {
    care: "On-Chip Wake-Word Filter",
    maxDestination: "Cloud Voice Lake",
    maxLabel: "Continuous ambient audio stream",
  },
  hallway: {
    care: "24h Auto-Purge Cache",
    maxDestination: "Cloud Video Archive",
    maxLabel: "Indefinite storage archive",
  },
  bedroom: {
    care: "Local Processing (No Brokers)",
    maxDestination: "Ad & Insurance Brokers",
    maxLabel: "Health & sleep telemetry",
  },
  entry: {
    care: "Warrant & Public Log Audit",
    maxDestination: "Police Network Portal",
    maxLabel: "Warrantless law enforcement feed",
  },
  den: {
    care: "Zero Telemetry (Opt-in Only)",
    maxDestination: "ACR Ad-Tech Network",
    maxLabel: "Silent automated viewing tracker",
  },
};

interface Props {
  choices: Record<string, Pick>;
  placed: string | null;
  hovered: string | null;
  selected: string | null;
  zoomOut?: boolean;
  showDataTrail?: boolean;
  onRoomEnter: (id: string | null) => void;
  onRoomDrop: (id: string, fromDevice?: string) => void;
  onRoomClick: (id: string) => void;
  children?: React.ReactNode;
}

export function roomFill(room: RoomDef, choices: Record<string, Pick>, active: boolean) {
  const pick = choices[room.id];
  if (pick === "care") return "var(--room-care)";
  if (pick === "max") return "var(--room-max)";
  return active ? "var(--room-active)" : "var(--room-empty)";
}

export function HouseMap({
  choices,
  placed,
  hovered,
  selected,
  zoomOut,
  showDataTrail = false,
  onRoomEnter,
  onRoomDrop,
  onRoomClick,
  children,
}: Props) {
  const careCount = Object.values(choices).filter((p) => p === "care").length;
  const maxCount = Object.values(choices).filter((p) => p === "max").length;

  return (
    <div
      className="relative w-full transition-transform duration-1000"
      style={{ aspectRatio: "3 / 2", transform: zoomOut ? "scale(0.92)" : "scale(1)" }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] border-4 border-wall bg-secondary/60 p-2 shadow-[var(--shadow-card)]">
        {/* LIVE DATA TRAIL OVERLAY HEADER */}
        {showDataTrail && (
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between rounded-xl bg-background/95 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-md border border-primary/40 shadow-md">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Live Data Trail Active</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                🛡️ {careCount} Protected Local
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                📡 {maxCount} External Outbound
              </span>
            </div>
          </div>
        )}

        {ROOMS.map((room) => {
          const active = hovered === room.id || selected === room.id;
          const pick = choices[room.id];
          const Icon = room.icon;
          const trail = DATA_TRAIL_DESTINATIONS[room.id];

          return (
            <div
              key={room.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (!pick) onRoomEnter(room.id);
              }}
              onDragLeave={() => onRoomEnter(null)}
              onDrop={(e) => {
                e.preventDefault();
                onRoomEnter(null);
                const droppedDevice = e.dataTransfer.getData("text/plain") || undefined;
                onRoomDrop(room.id, droppedDevice);
              }}
              onClick={() => onRoomClick(room.id)}
              className="absolute cursor-pointer rounded-2xl border-2 transition-all duration-500"
              style={{
                left: `${room.rect.x}%`,
                top: `${room.rect.y}%`,
                width: `${room.rect.w}%`,
                height: `${room.rect.h}%`,
                backgroundColor: roomFill(room, choices, active),
                borderColor: active ? "var(--primary)" : "var(--wall)",
                boxShadow: active ? "var(--shadow-soft)" : "none",
              }}
            >
              <div className="flex h-full flex-col justify-between p-2 sm:p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] leading-tight font-semibold opacity-80 sm:text-xs">
                    {room.roomName}
                  </p>
                  <Icon className="h-3.5 w-3.5 opacity-60 shrink-0" />
                </div>

                {/* STANDARD BADGE OR LIVE DATA TRAIL OVERLAY */}
                {pick ? (
                  showDataTrail && trail ? (
                    pick === "care" ? (
                      <div className="flex flex-col gap-0.5 rounded-lg border border-emerald-500/40 bg-emerald-950/85 p-1 text-left">
                        <div className="flex items-center gap-1 text-[8.5px] font-bold text-emerald-300">
                          <Shield className="h-2.5 w-2.5 shrink-0 text-emerald-400" />
                          <span>Protected Local</span>
                        </div>
                        <span className="text-[7.5px] leading-tight text-emerald-200/90 font-medium truncate">
                          {trail.care}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5 rounded-lg border border-amber-500/60 bg-amber-950/90 p-1 text-left animate-pulse">
                        <div className="flex items-center gap-1 text-[8.5px] font-bold text-amber-200">
                          <Radio className="h-2.5 w-2.5 shrink-0 text-red-400" />
                          <span className="truncate">➔ {trail.maxDestination}</span>
                        </div>
                        <span className="text-[7.5px] leading-tight text-amber-100 font-medium truncate">
                          {trail.maxLabel}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-1.5 self-start rounded-full bg-card/85 px-2 py-1 shadow-sm">
                      <Icon className="h-3 w-3" />
                      {pick === "care" ? (
                        <Shield className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Eye className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      )}
                      <span className="text-[9px] font-semibold uppercase opacity-90">
                        {pick === "care" ? "Care" : "Max"}
                      </span>
                    </div>
                  )
                ) : (
                  showDataTrail ? (
                    <div className="rounded-lg border border-dashed border-zinc-600/40 bg-black/20 p-1 text-center text-[8px] text-muted-foreground italic">
                      Awaiting default
                    </div>
                  ) : (
                    <p className="text-[10px] opacity-45">
                      {placed ? "drop here" : "needs a device"}
                    </p>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}
