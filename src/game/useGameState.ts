import { useCallback, useEffect, useState } from "react";
import type { Pick } from "./content";

export interface GameState {
  choices: Record<string, Pick>;
  users: number;
  trust: number; // -5..5
  risk: number; // 0..5
  reflection: string;
  phase: "play" | "zoom" | "ending" | "debrief";
}

const KEY = "trusttrail.v1";

const initial: GameState = {
  choices: {},
  users: 1200,
  trust: 0,
  risk: 0,
  reflection: "",
  phase: "play",
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

  const setPhase = useCallback(
    (phase: GameState["phase"]) => setState((s) => ({ ...s, phase })),
    [],
  );
  const setReflection = useCallback(
    (reflection: string) => setState((s) => ({ ...s, reflection })),
    [],
  );
  const reset = useCallback(() => setState(initial), []);

  return { state, hydrated, choose, setPhase, setReflection, reset };
}
