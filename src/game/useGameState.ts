import { useCallback, useEffect, useState } from "react";
import type { Pick } from "./content";

export interface MisplacementNote {
  deviceId: string;
  attemptedRoomId: string;
  note: string;
  timestamp: number;
}

export interface GameState {
  choices: Record<string, Pick>;
  users: number;
  trust: number; // -5..5
  risk: number; // 0..5
  reflection: string;
  /** device ids that already triggered the curious wrong-room prompt */
  askedDevices: string[];
  misplacements: MisplacementNote[];
  /** understanding check answers, before and after playing */
  preAnswers: Record<string, string>;
  postAnswers: Record<string, string>;
  phase: "pre" | "play" | "zoom" | "ending" | "debrief" | "post";
}

const KEY = "trusttrail.v3";

const initial: GameState = {
  choices: {},
  users: 1200,
  trust: 0,
  risk: 0,
  reflection: "",
  askedDevices: [],
  misplacements: [],
  preAnswers: {},
  postAnswers: {},
  phase: "pre",
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const choose = useCallback((roomId: string, pick: Pick) => {
    setState((s) => {
      if (s.choices[roomId]) return s;
      const choices = { ...s.choices, [roomId]: pick };
      const done = Object.keys(choices).length === 5;
      return {
        ...s,
        choices,
        trust: s.trust + (pick === "care" ? 1 : -1),
        risk: s.risk + (pick === "max" ? 1 : 0),
        users: s.users + (pick === "max" ? 640 : 210) + Math.floor(Math.random() * 90),
        phase: done ? "zoom" : "play",
      };
    });
  }, []);

  const recordMisplacement = useCallback(
    (deviceId: string, attemptedRoomId: string, note: string) => {
      setState((s) => ({
        ...s,
        askedDevices: s.askedDevices.includes(deviceId)
          ? s.askedDevices
          : [...s.askedDevices, deviceId],
        misplacements: [
          ...s.misplacements,
          { deviceId, attemptedRoomId, note, timestamp: Date.now() },
        ],
      }));
    },
    [],
  );

  const setPhase = useCallback(
    (phase: GameState["phase"]) => setState((s) => ({ ...s, phase })),
    [],
  );
  const setReflection = useCallback(
    (reflection: string) => setState((s) => ({ ...s, reflection })),
    [],
  );
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setState(initial);
  }, []);

  return { state, hydrated, choose, recordMisplacement, setPhase, setReflection, reset };
}
