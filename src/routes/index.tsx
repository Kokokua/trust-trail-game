import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Shield, Eye, ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { HouseMap, roomFill, DATA_TRAIL_DESTINATIONS } from "@/components/HouseMap";
import { DecisionCard } from "@/components/DecisionCard";
import { EndingScreen } from "@/components/EndingScreen";
import { DebriefScreen } from "@/components/DebriefScreen";
import { ChoiceFeedback } from "@/components/ChoiceFeedback";
import { UnderstandingCheck } from "@/components/UnderstandingCheck";
import { StoryPrologue } from "@/components/StoryPrologue";
import { TitleScreen } from "@/components/TitleScreen";
import { ROOMS, resolveEnding, type Pick } from "@/game/content";
import { feedbackFor, scoreCheck } from "@/game/learning";
import { saveParticipantRecord } from "@/game/participantStorage";
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
  const {
    state,
    hydrated,
    choose,
    unchoose,
    recordMisplacement,
    setPhase,
    answerCheck,
    setLikert,
    setSurveyField,
    setReflection,
    reset,
    startNewParticipant,
    goToTitle,
  } = useGameState();
  const narrow = useNarrow();
  const [dragging, setDragging] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openRoom, setOpenRoom] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [feedback, setFeedback] = useState<{ roomId: string; pick: Pick } | null>(null);
  const [showDataTrail, setShowDataTrail] = useState(false);
  const zoomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state.phase !== "zoom" || feedback) return;
    zoomTimer.current = setTimeout(() => setPhase("ending"), 2400);
    return () => {
      if (zoomTimer.current) clearTimeout(zoomTimer.current);
    };
  }, [state.phase, feedback, setPhase]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("new=true")) {
      startNewParticipant();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [startNewParticipant]);

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  const { ending, decidingRoom } = resolveEnding(state.choices);

  if (state.phase === "title") {
    return <TitleScreen onStart={startNewParticipant} />;
  }
  if (state.phase === "story") {
    return <StoryPrologue onComplete={() => setPhase("pre")} onGoToTitle={goToTitle} />;
  }
  if (state.phase === "pre") {
    return (
      <UnderstandingCheck
        mode="before"
        answers={state.preAnswers}
        onAnswer={(item, opt) => answerCheck("preAnswers", item, opt)}
        likertAnswers={state.preLikert}
        onLikertAnswer={(qId, val) => setLikert("preLikert", qId, val)}
        onDone={() => setPhase("play")}
        onGoToTitle={goToTitle}
      />
    );
  }
  if (state.phase === "ending") {
    return (
      <EndingScreen
        ending={ending}
        choices={state.choices}
        onContinue={() => setPhase("debrief")}
        onGoToTitle={goToTitle}
      />
    );
  }
  if (state.phase === "debrief") {
    return (
      <DebriefScreen
        ending={ending}
        decidingRoom={decidingRoom}
        choices={state.choices}
        reflection={state.reflection}
        onReflection={setReflection}
        onRestart={() => setPhase("post")}
        onGoToTitle={goToTitle}
      />
    );
  }
  if (state.phase === "post") {
    const handleSaveRecord = () => {
      const mappedMisplacements = state.misplacements.map((m) => {
        const d = ROOMS.find((r) => r.id === m.deviceId);
        const rm = ROOMS.find((r) => r.id === m.attemptedRoomId);
        return {
          deviceName: d ? d.deviceName : m.deviceId,
          roomName: rm ? rm.roomName : m.attemptedRoomId,
          note: m.note,
        };
      });

      const rec = saveParticipantRecord({
        priorExp: state.priorExp === "No" ? "No" : "Yes",
        preKnowledgeScore: scoreCheck(state.preAnswers),
        postKnowledgeScore: scoreCheck(state.postAnswers),
        endingReached: ending.title,
        preLikert: state.preLikert,
        postLikert: state.postLikert,
        concepts: state.selectedConcepts,
        whyUnfair: state.whyUnfair,
        satisfaction: state.satisfaction,
        improvement: state.improvement,
        misplacements: mappedMisplacements,
      });
      setSurveyField("submittedRecordId", rec.id);
      toast.success(`Participant ${rec.id} recorded successfully!`);
    };

    return (
      <UnderstandingCheck
        mode="after"
        answers={state.postAnswers}
        baseline={state.preAnswers}
        onAnswer={(item, opt) => answerCheck("postAnswers", item, opt)}
        likertAnswers={state.postLikert}
        onLikertAnswer={(qId, val) => setLikert("postLikert", qId, val)}
        baselineLikert={state.preLikert}
        endingTitle={ending.title}
        priorExp={state.priorExp}
        onPriorExp={(v) => setSurveyField("priorExp", v)}
        selectedConcepts={state.selectedConcepts}
        onToggleConcept={(c) => {
          const exists = state.selectedConcepts.includes(c);
          setSurveyField(
            "selectedConcepts",
            exists
              ? state.selectedConcepts.filter((x) => x !== c)
              : [...state.selectedConcepts, c],
          );
        }}
        whyUnfair={state.whyUnfair}
        onWhyUnfair={(v) => setSurveyField("whyUnfair", v)}
        satisfaction={state.satisfaction}
        onSatisfaction={(v) => setSurveyField("satisfaction", v)}
        improvement={state.improvement}
        onImprovement={(v) => setSurveyField("improvement", v)}
        onDone={() => setPhase("play")}
        onRestart={reset}
        onStartNewParticipant={startNewParticipant}
        onGoToTitle={goToTitle}
        onSubmitRecord={handleSaveRecord}
        submittedRecordId={state.submittedRecordId}
      />
    );
  }

  const remaining = ROOMS.filter((r) => !state.choices[r.id]);

  const place = (roomId: string, fromDevice?: string) => {
    if (state.choices[roomId]) {
      setOpenRoom(roomId);
      return;
    }
    const device = fromDevice ?? dragging;
    // If no device is dragged/selected, clicking the room opens its decision setup directly!
    if (!device) {
      setOpenRoom(roomId);
      return;
    }
    if (device !== roomId) {
      const dev = ROOMS.find((r) => r.id === device);
      const target = ROOMS.find((r) => r.id === roomId);
      const correct = ROOMS.find((r) => r.id === device);
      recordMisplacement(
        device,
        roomId,
        `Attempted placing ${dev?.deviceName || device} into ${target?.roomName || roomId}`
      );
      toast.warning(
        `${dev?.deviceName || "Device"} belongs in ${correct?.roomName || "another room"}`,
        {
          description: "Test bay mismatch logged for user testing metrics.",
        }
      );
      return;
    }
    setDragging(null);
    setOpenRoom(roomId);
  };

  const decide = (roomId: string, pick: Pick) => {
    const room = ROOMS.find((r) => r.id === roomId)!;
    choose(roomId, pick);
    setOpenRoom(null);
    setFeedback({ roomId, pick });
  };

  const fbRoom = feedback ? ROOMS.find((r) => r.id === feedback.roomId) : null;
  const fb = fbRoom && feedback ? feedbackFor(fbRoom.id, feedback.pick) : null;
  const openRoomDef = openRoom ? ROOMS.find((r) => r.id === openRoom) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {fbRoom && fb && feedback && (
        <ChoiceFeedback
          roomName={fbRoom.roomName}
          choiceTitle={fbRoom[feedback.pick].title}
          pick={feedback.pick}
          principle={fb.principle}
          body={fb.body}
          realWorld={fb.realWorld}
          remaining={ROOMS.filter((r) => !state.choices[r.id]).length}
          onClose={() => setFeedback(null)}
          onReconsider={() => {
            unchoose(feedback.roomId);
            setOpenRoom(feedback.roomId);
            setFeedback(null);
          }}
        />
      )}
      <Dashboard
        trust={state.trust}
        risk={state.risk}
        users={state.users}
        configuredCount={Object.keys(state.choices).length}
        hasActiveSession={Object.keys(state.choices).length > 0}
        onGoToTitle={goToTitle}
      />

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Your first home is ready for hardware
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Move each device into the room it belongs in. Five calls to make, in whatever order you
              like.
            </p>
          </div>
          <button
            onClick={() => setShowDataTrail(!showDataTrail)}
            className={`inline-flex items-center gap-2 self-start sm:self-auto rounded-full px-4 py-2 text-xs font-semibold backdrop-blur-md transition-all shadow-sm ${
              showDataTrail
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary"
                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
            title="Toggle real-time data flow and privacy architecture overlay"
          >
            <Radio className={`h-3.5 w-3.5 ${showDataTrail ? "animate-pulse text-red-300" : ""}`} />
            <span>Live Data Trail: {showDataTrail ? "ACTIVE" : "OFF"}</span>
          </button>
        </div>

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
            showDataTrail={showDataTrail}
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
                    <div
                      key={room.id}
                      role="button"
                      tabIndex={0}
                      draggable={!done}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", room.id);
                        e.dataTransfer.effectAllowed = "move";
                        setDragging(room.id);
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setHovered(null);
                      }}
                      onClick={() => {
                        setOpenRoom(room.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setOpenRoom(room.id);
                        }
                      }}
                      title={
                        done
                          ? "Configured · Click to review or change settings"
                          : "Drag to room, or click to configure directly"
                      }
                      className={`flex w-full items-center gap-2 rounded-2xl border p-2.5 text-left text-xs font-medium transition-all select-none ${
                        done
                          ? "border-border/60 bg-secondary/70 hover:border-primary/50 hover:bg-secondary cursor-pointer"
                          : dragging === room.id
                            ? "border-primary bg-primary/10 shadow-[var(--shadow-soft)] ring-2 ring-primary/40 cursor-grabbing"
                            : "cursor-grab active:cursor-grabbing border-border bg-card hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{room.deviceName}</span>
                      {done &&
                        (state.choices[room.id] === "care" ? (
                          <Shield className="ml-auto h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Eye className="ml-auto h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        ))}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted-foreground">
                {remaining.length > 0
                  ? `${remaining.length} left to set up. Drag a device or click any room directly.`
                  : "Everything is placed · Tap any room to review settings."}
              </p>
            </aside>

            <HouseMap
              choices={state.choices}
              placed={dragging}
              hovered={hovered}
              selected={openRoom}
              zoomOut={state.phase === "zoom"}
              showDataTrail={showDataTrail}
              onRoomEnter={setHovered}
              onRoomDrop={(id, fromDevice) => place(id, fromDevice)}
              onRoomClick={(id) => place(id)}
            >
              {openRoomDef && (
                <DecisionCard
                  key={openRoomDef.id}
                  room={openRoomDef}
                  currentPick={state.choices[openRoomDef.id]}
                  onChoose={(p) => decide(openRoomDef.id, p)}
                  onDismiss={() => setOpenRoom(null)}
                  className="absolute z-20"
                  style={{
                    left: `${Math.min(openRoomDef.rect.x + 4, 46)}%`,
                    top: `${openRoomDef.rect.y > 20 ? 4 : Math.min(openRoomDef.rect.y + 6, 12)}%`,
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
  showDataTrail = false,
  onPlace,
  onDecide,
  onDismiss,
}: {
  slide: number;
  setSlide: (n: number) => void;
  choices: Record<string, Pick>;
  openRoom: string | null;
  showDataTrail?: boolean;
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
        style={{ backgroundColor: roomFill(room, choices, openRoom === room.id) }}
      >
        <div className="flex aspect-[4/3] flex-col justify-between rounded-2xl border-2 border-wall/60 p-4">
          <p className="text-xs font-semibold opacity-70">{room.roomName}</p>
          <div className="flex items-center gap-2 self-start rounded-full bg-card/80 px-3 py-2">
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{room.deviceName}</span>
            {pick === "care" && <Shield className="h-4 w-4 text-emerald-500" />}
            {pick === "max" && <Eye className="h-4 w-4 text-amber-500" />}
          </div>

          {showDataTrail && pick && (
            <div
              className={`my-1 rounded-xl p-2.5 text-left border ${
                pick === "care"
                  ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-200"
                  : "border-amber-500/60 bg-amber-950/90 text-amber-200 animate-pulse"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {pick === "care" ? (
                  <>
                    <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Protected: {DATA_TRAIL_DESTINATIONS[room.id]?.care}</span>
                  </>
                ) : (
                  <>
                    <Radio className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span className="truncate">➔ {DATA_TRAIL_DESTINATIONS[room.id]?.maxDestination}</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-[10px] opacity-85 leading-tight">
                {pick === "care"
                  ? "Zero third-party telemetry"
                  : DATA_TRAIL_DESTINATIONS[room.id]?.maxLabel}
              </p>
            </div>
          )}

          {pick ? (
            <button
              onClick={() => onPlace(room.id)}
              className="self-start rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              Review / Change setting
            </button>
          ) : (
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
          currentPick={choices[room.id]}
          onChoose={(p) => onDecide(room.id, p)}
          onDismiss={onDismiss}
          className="mt-4 w-full"
        />
      )}
    </div>
  );
}
