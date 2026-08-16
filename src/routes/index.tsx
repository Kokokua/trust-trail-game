import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Shield, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { HouseMap, roomFill } from "@/components/HouseMap";
import { DecisionCard } from "@/components/DecisionCard";
import { EndingScreen } from "@/components/EndingScreen";
import { DebriefScreen } from "@/components/DebriefScreen";
import { ROOMS, resolveEnding, type Pick } from "@/game/content";
import { useGameState } from "@/game/useGameState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustTrail — Build Your Smart Home Startup" },
      {
        name: "description",
        content:
          "Run a smart home startup, make five real product tradeoffs, and see where informed consent quietly breaks down.",
      },
      { property: "og:title", content: "TrustTrail — Build Your Smart Home Startup" },
      {
        property: "og:description",
        content:
          "Run a smart home startup, make five real product tradeoffs, and see where informed consent quietly breaks down.",
      },
    ],
  }),
  component: Index,
});

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

function Index() {
  const { state, hydrated, choose, setPhase, setReflection, reset } = useGameState();
  const narrow = useNarrow();
  const [dragging, setDragging] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openRoom, setOpenRoom] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const zoomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state.phase !== "zoom") return;
    zoomTimer.current = setTimeout(() => setPhase("ending"), 2400);
    return () => {
      if (zoomTimer.current) clearTimeout(zoomTimer.current);
    };
  }, [state.phase, setPhase]);

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  const { ending, decidingRoom } = resolveEnding(state.choices);

  if (state.phase === "ending") {
    return <EndingScreen ending={ending} onContinue={() => setPhase("debrief")} />;
  }
  if (state.phase === "debrief") {
    return (
      <DebriefScreen
        ending={ending}
        decidingRoom={decidingRoom}
        choices={state.choices}
        reflection={state.reflection}
        onReflection={setReflection}
        onRestart={reset}
      />
    );
  }

  const remaining = ROOMS.filter((r) => !state.choices[r.id]);

  const place = (roomId: string, fromDevice?: string) => {
    if (state.choices[roomId]) return;
    const device = fromDevice ?? dragging;
    if (!device) {
      toast("Pick up a device from the shelf first.");
      return;
    }
    if (device !== roomId) {
      toast("That device belongs in another room.");
      return;
    }
    setDragging(null);
    setOpenRoom(roomId);
  };

  const decide = (roomId: string, pick: Pick) => {
    const room = ROOMS.find((r) => r.id === roomId)!;
    choose(roomId, pick);
    setOpenRoom(null);
    toast.success(`${room.roomName} setup saved`, { description: room[pick].title });
  };

  const openRoomDef = openRoom ? ROOMS.find((r) => r.id === openRoom)! : null;

  return (
    <div className="min-h-screen bg-background">
      <Dashboard trust={state.trust} risk={state.risk} users={state.users} />

      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Your first home is ready for hardware
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Move each device into the room it belongs in. Five calls to make, in whatever order you
          like.
        </p>

        {state.phase === "zoom" && (
          <p className="animate-fade mt-4 text-sm font-medium">
            The house is fully wired. Stepping back to look at what you built…
          </p>
        )}

        {narrow ? (
          <MobileRooms
            slide={slide}
            setSlide={setSlide}
            choices={state.choices}
            openRoom={openRoom}
            onPlace={(id) => place(id, id)}
            onDecide={decide}
            onDismiss={() => setOpenRoom(null)}
          />
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-[190px_1fr]">
            <aside className="rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
              <p className="px-1 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Shelf
              </p>
              <div className="flex flex-wrap gap-2 md:block md:space-y-2">
                {ROOMS.map((room) => {
                  const done = !!state.choices[room.id];
                  const Icon = room.icon;
                  return (
                    <button
                      key={room.id}
                      draggable={!done}
                      onDragStart={() => setDragging(room.id)}
                      onDragEnd={() => {
                        setDragging(null);
                        setHovered(null);
                      }}
                      onClick={() => !done && setDragging(room.id)}
                      disabled={done}
                      className={`flex w-full items-center gap-2 rounded-2xl border p-2.5 text-left text-xs font-medium transition-all ${
                        done
                          ? "cursor-default border-transparent bg-secondary/60 opacity-50"
                          : dragging === room.id
                            ? "border-primary bg-primary/10 shadow-[var(--shadow-soft)]"
                            : "cursor-grab border-border bg-card hover:-translate-y-0.5 hover:border-primary/60"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{room.deviceName}</span>
                      {done &&
                        (state.choices[room.id] === "care" ? (
                          <Shield className="ml-auto h-3.5 w-3.5" />
                        ) : (
                          <Eye className="ml-auto h-3.5 w-3.5" />
                        ))}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted-foreground">
                {remaining.length > 0
                  ? `${remaining.length} left to set up. Drag, or tap a device then tap its room.`
                  : "Everything is placed."}
              </p>
            </aside>

            <HouseMap
              choices={state.choices}
              placed={dragging}
              hovered={hovered}
              selected={openRoom}
              zoomOut={state.phase === "zoom"}
              onRoomEnter={setHovered}
              onRoomDrop={(id) => place(id)}
              onRoomClick={(id) => place(id)}
            >
              {openRoomDef && (
                <DecisionCard
                  room={openRoomDef}
                  onChoose={(p) => decide(openRoomDef.id, p)}
                  onDismiss={() => setOpenRoom(null)}
                  className="absolute z-20"
                  style={{
                    left: `${Math.min(openRoomDef.rect.x + 4, 46)}%`,
                    top: `${Math.min(openRoomDef.rect.y + 6, 30)}%`,
                  }}
                />
              )}
            </HouseMap>
          </div>
        )}
      </main>
    </div>
  );
}

function MobileRooms({
  slide,
  setSlide,
  choices,
  openRoom,
  onPlace,
  onDecide,
  onDismiss,
}: {
  slide: number;
  setSlide: (n: number) => void;
  choices: Record<string, Pick>;
  openRoom: string | null;
  onPlace: (id: string) => void;
  onDecide: (id: string, p: Pick) => void;
  onDismiss: () => void;
}) {
  const room = ROOMS[Math.max(0, Math.min(slide, ROOMS.length - 1))]!;
  const pick = choices[room.id];
  const Icon = room.icon;
  const touch = useRef<number | null>(null);

  return (
    <div className="mt-5">
      <div
        onTouchStart={(e) => (touch.current = e.touches[0]!.clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0]!.clientX - touch.current;
          if (dx < -40) setSlide(Math.min(slide + 1, ROOMS.length - 1));
          if (dx > 40) setSlide(Math.max(slide - 1, 0));
          touch.current = null;
        }}
        className="rounded-[2rem] border-4 border-wall p-3 shadow-[var(--shadow-card)] transition-colors duration-500"
        style={{ backgroundColor: roomFill(room, choices, !!openRoom) }}
      >
        <div className="flex aspect-[4/3] flex-col justify-between rounded-2xl border-2 border-wall/60 p-4">
          <p className="text-xs font-semibold opacity-70">{room.roomName}</p>
          <div className="flex items-center gap-2 self-start rounded-full bg-card/80 px-3 py-2">
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{room.deviceName}</span>
            {pick === "care" && <Shield className="h-4 w-4" />}
            {pick === "max" && <Eye className="h-4 w-4" />}
          </div>
          {!pick && (
            <button
              onClick={() => onPlace(room.id)}
              className="self-start rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
            >
              Install the {room.deviceName.toLowerCase()}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setSlide(Math.max(slide - 1, 0))}
          className="rounded-full border border-border p-2"
          aria-label="Previous room"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {ROOMS.map((r, i) => (
            <span
              key={r.id}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: i === slide ? "var(--primary)" : "var(--border)",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setSlide(Math.min(slide + 1, ROOMS.length - 1))}
          className="rounded-full border border-border p-2"
          aria-label="Next room"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {openRoom === room.id && (
        <DecisionCard
          room={room}
          onChoose={(p) => onDecide(room.id, p)}
          onDismiss={onDismiss}
          className="mt-4 w-full"
        />
      )}
    </div>
  );
}
