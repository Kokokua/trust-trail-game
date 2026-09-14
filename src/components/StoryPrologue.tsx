import { useState } from "react";
import {
  Bell,
  MessageSquare,
  Send,
  SkipForward,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

interface Props {
  onComplete: () => void;
  onGoToTitle?: () => void;
}

export function StoryPrologue({ onComplete, onGoToTitle }: Props) {
  // 0 = Night Desk Intro, 1 = Phone Notification on Living Room Scene, 2 = Full Chat Screen
  const [scene, setScene] = useState<0 | 1 | 2>(0);
  const [chatStep, setChatStep] = useState<number>(0);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black font-sans select-none">
      {/* BACKGROUND IMAGE DEPENDING ON SCENE */}
      {scene === 0 && (
        <div
          className="animate-fade absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url('/images/office_night_desk.jpg')` }}
        />
      )}
      {(scene === 1 || scene === 2) && (
        <div
          className="animate-fade absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url('/images/smart_home_living_room.jpg')` }}
        />
      )}

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

      {/* TOP BAR: MENU & SKIP BUTTON */}
      <div className="absolute top-6 inset-x-6 z-30 flex items-center justify-between pointer-events-auto">
        {onGoToTitle ? (
          <button
            onClick={() => {
              if (scene === 0 || window.confirm("Return to Main Menu?")) {
                onGoToTitle();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Main Menu</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
        >
          <span>Skip Prologue</span>
          <SkipForward className="h-3 w-3" />
        </button>
      </div>

      {/* SCENE 0: NIGHT WORKSTATION DIALOGUE (VISUAL NOVEL STYLE) */}
      {scene === 0 && (
        <div className="animate-fade relative z-20 flex min-h-screen w-full max-w-3xl flex-col justify-end px-4 pb-12 sm:pb-16">
          <div className="animate-pop w-full rounded-3xl border border-white/15 bg-zinc-950/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-amber-400 uppercase">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>23:45 PM · Startup Engineering Floor</span>
            </div>

            <p className="mt-4 text-base sm:text-lg font-medium leading-relaxed text-zinc-100">
              “Finally… what a long sprint. Tomorrow morning, our smart-home hardware ships to our
              first 1,200 early backers.”
            </p>

            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              You stare at your monitors in the quiet office. Five IoT devices—Smart Speaker, TV,
              Doorbell, Security Cam, and Sleep Tracker—are loaded into the test bay, awaiting
              factory default firmware flashes.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setScene(1)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-lg hover:-translate-y-0.5 hover:shadow-primary/30 transition-all"
              >
                <span>Check test apartment feeds</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 1: APARTMENT PREVIEW WITH PHONE NOTIFICATION (MATCHING USER SCREENSHOT 1) */}
      {scene === 1 && (
        <div className="animate-fade relative z-20 flex min-h-screen w-full max-w-4xl flex-col justify-between p-6 sm:p-12">
          {/* Top prompt */}
          <div className="max-w-md rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md text-xs text-zinc-300">
            <span className="font-bold text-white">Virtual Test Apartment</span> — Previewing living
            room environment before hardware activation.
          </div>

          <div className="flex flex-col sm:flex-row items-end justify-between gap-6 pb-4">
            {/* Bottom dialogue bar */}
            <div className="w-full sm:max-w-md rounded-3xl border border-white/15 bg-zinc-950/85 p-5 backdrop-blur-xl shadow-2xl">
              <p className="text-sm sm:text-base font-medium text-zinc-100">
                “A notification breaks the silence.”
              </p>
              <p className="mt-1 text-xs text-zinc-400">Your phone vibrates on the desk.</p>
            </div>

            {/* Realistic Phone Notification Widget (like Screenshot 1) */}
            <div
              onClick={() => setScene(2)}
              className="animate-bounce group relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-zinc-700 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105"
              style={{ width: "230px" }}
            >
              {/* Badge 1 */}
              <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-black shadow-md">
                1
              </div>

              {/* Notification icon */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40">
                  <Bell className="h-7 w-7 fill-current" />
                </div>
                <p className="mt-3 text-sm font-bold text-white">Sarah (VP Product)</p>
                <p className="mt-1 text-[11px] text-zinc-400">“Hey! Are you free right now?”</p>

                <button className="mt-3 w-full rounded-xl bg-white/10 py-1.5 text-[11px] font-semibold text-white group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Tap to open message 💬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 2: FULL CHAT SCREEN (MATCHING USER SCREENSHOT 2) */}
      {scene === 2 && (
        <div className="animate-pop relative z-20 flex h-[90vh] max-h-[720px] w-full max-w-md flex-col overflow-hidden rounded-[2.5rem] border border-zinc-700 bg-zinc-950 shadow-2xl backdrop-blur-2xl">
          {/* Chat Header (like Screenshot 2) */}
          <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 px-5 py-4">
            <div className="relative">
              <img
                src="/images/sarah_avatar.jpg"
                alt="Sarah"
                className="h-11 w-11 rounded-full border-2 border-primary object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white">Sarah (VP of Product)</h3>
              <p className="text-[11px] font-medium text-emerald-400">Active now</p>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs sm:text-sm">
            {/* Sarah Message 1 */}
            <div className="flex items-start gap-2.5">
              <img
                src="/images/sarah_avatar.jpg"
                alt="Sarah"
                className="mt-1 h-7 w-7 rounded-full object-cover shrink-0"
              />
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-3 text-zinc-100 shadow-sm leading-relaxed">
                Hey bro! 👋 Are you still at the office? Urgent note on tomorrow&apos;s launch...
              </div>
            </div>

            {/* Player Reply 1 */}
            {chatStep >= 1 && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground shadow-sm leading-relaxed">
                  Yeah, what&apos;s up? I&apos;m finalizing the firmware release packages right now.
                </div>
              </div>
            )}

            {/* Sarah Message 2 */}
            {chatStep >= 2 && (
              <div className="flex items-start gap-2.5">
                <img
                  src="/images/sarah_avatar.jpg"
                  alt="Sarah"
                  className="mt-1 h-7 w-7 rounded-full object-cover shrink-0"
                />
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-3 text-zinc-100 shadow-sm leading-relaxed">
                  Investors just sent an urgent memo. They want always-on audio, continuous telemetry,
                  and ad-sharing enabled by default. Our Series A runway depends on this monetization
                  data.
                </div>
              </div>
            )}

            {/* Player Reply 2 */}
            {chatStep >= 3 && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground shadow-sm leading-relaxed">
                  Isn&apos;t that a violation of informed consent and Privacy by Default?
                </div>
              </div>
            )}

            {/* Sarah Message 3 */}
            {chatStep >= 4 && (
              <div className="flex items-start gap-2.5">
                <img
                  src="/images/sarah_avatar.jpg"
                  alt="Sarah"
                  className="mt-1 h-7 w-7 rounded-full object-cover shrink-0"
                />
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-3 text-zinc-100 shadow-sm leading-relaxed border border-amber-500/30">
                  Management made their target clear. But you&apos;re the Lead Engineer with commit
                  access. Whatever defaults you compile tonight will run inside 1,200 families&apos;
                  intimate homes for years.
                </div>
              </div>
            )}
          </div>

          {/* Chat Action Footer (Interactive Reply Buttons) */}
          <div className="border-t border-zinc-800 bg-zinc-900/90 p-4">
            {chatStep === 0 && (
              <button
                onClick={() => setChatStep(1)}
                className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
              >
                “Yeah, what&apos;s up?”
              </button>
            )}

            {chatStep === 1 && (
              <button
                onClick={() => setChatStep(2)}
                className="w-full rounded-2xl bg-zinc-800 py-3 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                Read Sarah&apos;s message...
              </button>
            )}

            {chatStep === 2 && (
              <button
                onClick={() => setChatStep(3)}
                className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
              >
                “Isn&apos;t that a violation of informed consent?”
              </button>
            )}

            {chatStep === 3 && (
              <button
                onClick={() => setChatStep(4)}
                className="w-full rounded-2xl bg-zinc-800 py-3 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                Read final response...
              </button>
            )}

            {chatStep >= 4 && (
              <button
                onClick={onComplete}
                className="animate-pop w-full rounded-2xl bg-gradient-to-r from-primary to-amber-500 py-3.5 text-xs font-black text-black uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform"
              >
                Take Founder&apos;s Baseline & Configure Hardware →
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
