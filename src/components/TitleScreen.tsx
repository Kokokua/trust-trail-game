import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, BarChart3, Info, Shield, X } from "lucide-react";

interface Props {
  onStart: () => void;
}

export function TitleScreen({ onStart }: Props) {
  const [showBriefing, setShowBriefing] = useState(false);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Background Cover Image with atmospheric overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('/images/office_night_desk.jpg')` }}
      />
      {/* Dark Vignette & Gradient Overlays for enhanced readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Main Title Content Card */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Game Title - Clean typography without wavy underline highlight */}
        <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-lg">
          TRUST <span className="text-primary">TRAIL</span>
        </h1>
        <p className="mt-3 text-lg sm:text-xl font-semibold tracking-wide text-zinc-100 drop-shadow">
          The Smart Home Dilemma
        </p>

        {/* Narrative Hook - Crisp, high contrast, easy to read */}
        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-zinc-200 drop-shadow">
          You are the Lead Software & Firmware Engineer at a smart IoT startup shipping to 1,200 homes.
          Management wants high-growth defaults. The final code settings are up to you.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:scale-105 hover:shadow-primary/30 hover:shadow-xl"
          >
            <Play className="h-4 w-4 fill-current transition-transform group-hover:translate-x-0.5" />
            <span>START GAME</span>
          </button>

          <Link
            to="/results"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-zinc-100 backdrop-blur-md transition-all hover:bg-zinc-800 hover:text-white shadow"
          >
            <BarChart3 className="h-4 w-4 text-primary" />
            <span>User Testing & Results</span>
          </Link>

          <button
            onClick={() => setShowBriefing(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-600 bg-zinc-900/80 px-4 py-3.5 text-xs font-semibold text-zinc-200 backdrop-blur-md hover:bg-zinc-800 hover:text-white transition-colors shadow"
          >
            <Info className="h-4 w-4 text-primary" />
            <span>About</span>
          </button>
        </div>


      </div>

      {/* ABOUT / MISSION BRIEFING MODAL */}
      {showBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-700 bg-zinc-950 p-6 sm:p-7 text-left shadow-2xl text-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">About TrustTrail</h3>
                  <p className="text-xs text-zinc-400">Smart Home Ethics Simulation</p>
                </div>
              </div>
              <button
                onClick={() => setShowBriefing(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-zinc-300">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
                <p className="font-semibold text-white flex items-center gap-2">
                  <span>🎯</span> What is this game?
                </p>
                <p className="mt-1 text-xs text-zinc-300">
                  You play as a software engineer at a smart-home tech company preparing for product launch.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
                <p className="font-semibold text-white flex items-center gap-2">
                  <span>⚖️</span> What do you do?
                </p>
                <p className="mt-1 text-xs text-zinc-300">
                  Configure default settings for 5 devices (speaker, TV, doorbell, camera, and sleep tracker). You must balance company growth targets against user privacy rights.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
                <p className="font-semibold text-white flex items-center gap-2">
                  <span>💡</span> What will you learn?
                </p>
                <p className="mt-1 text-xs text-zinc-300">
                  See how everyday default settings impact real users and learn to build software with privacy and responsibility in mind.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowBriefing(false);
                onStart();
              }}
              className="mt-6 w-full rounded-full bg-primary py-3 text-center text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
            >
              Start Game →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
