import { Shield, Eye } from "lucide-react";
import { ROOMS, type Pick, type RoomDef } from "@/game/content";

interface Props {
  choices: Record<string, Pick>;
  placed: string | null;
  hovered: string | null;
  selected: string | null;
  zoomOut?: boolean;
  onRoomEnter: (id: string | null) => void;
  onRoomDrop: (id: string) => void;
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
  onRoomEnter,
  onRoomDrop,
  onRoomClick,
  children,
}: Props) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[2rem] border-4 border-wall bg-secondary/60 p-2 shadow-[var(--shadow-card)] transition-transform duration-1000"
      style={{ aspectRatio: "3 / 2", transform: zoomOut ? "scale(0.92)" : "scale(1)" }}
    >
      {ROOMS.map((room) => {
        const active = hovered === room.id || selected === room.id;
        const pick = choices[room.id];
        const Icon = room.icon;
        return (
          <div
            key={room.id}
            onDragOver={(e) => {
              e.preventDefault();
              if (!pick) onRoomEnter(room.id);
            }}
            onDragLeave={() => onRoomEnter(null)}
            onDrop={(e) => {
              e.preventDefault();
              onRoomEnter(null);
              onRoomDrop(room.id);
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
            <div className="flex h-full flex-col justify-between p-2 sm:p-3">
              <p className="text-[10px] leading-tight font-semibold opacity-70 sm:text-xs">
                {room.roomName}
              </p>
              {pick ? (
                <div className="flex items-center gap-1.5 self-start rounded-full bg-card/80 px-2 py-1">
                  <Icon className="h-3.5 w-3.5" />
                  {pick === "care" ? (
                    <Shield className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </div>
              ) : (
                <p className="text-[10px] opacity-45">
                  {placed ? "drop here" : "needs a device"}
                </p>
              )}
            </div>
          </div>
        );
      })}
      {children}
    </div>
  );
}
