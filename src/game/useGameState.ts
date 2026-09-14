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
  /** 1-5 Likert scale responses based on Proposal page 8 */
  preLikert: Record<string, number>;
  postLikert: Record<string, number>;
  priorExp: "Yes" | "No" | "";
  selectedConcepts: string[];
  whyUnfair: string;
  satisfaction: number;
  improvement: string;
  submittedRecordId?: string | undefined;
  phase: "title" | "story" | "pre" | "play" | "zoom" | "ending" | "debrief" | "post";
}

const KEY = "trusttrail.v5";

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
  preLikert: {},
  postLikert: {},
  priorExp: "",
  selectedConcepts: [],
  whyUnfair: "",
  satisfaction: 9,
  improvement: "",
  phase: "title",
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
      const prevPick = s.choices[roomId];
      if (prevPick === pick) return s;

      let newTrust = s.trust;
      let newRisk = s.risk;
      let newUsers = s.users;

      if (prevPick) {
        newTrust -= prevPick === "care" ? 1 : -1;
        newRisk = Math.max(0, newRisk - (prevPick === "max" ? 1 : 0));
        newUsers = Math.max(1200, newUsers - (prevPick === "max" ? 640 : 210));
      }

      newTrust += pick === "care" ? 1 : -1;
      newRisk += pick === "max" ? 1 : 0;
      newUsers += (pick === "max" ? 640 : 210) + (prevPick ? 0 : Math.floor(Math.random() * 90));

      const choices = { ...s.choices, [roomId]: pick };
      const done = Object.keys(choices).length === 5;
      return {
        ...s,
        choices,
        trust: newTrust,
        risk: newRisk,
        users: newUsers,
        phase: done ? "zoom" : "play",
      };
    });
  }, []);

  const unchoose = useCallback((roomId: string) => {
    setState((s) => {
      const prevPick = s.choices[roomId];
      if (!prevPick) return s;
      const { [roomId]: _, ...restChoices } = s.choices;
      return {
        ...s,
        choices: restChoices,
        trust: s.trust - (prevPick === "care" ? 1 : -1),
        risk: Math.max(0, s.risk - (prevPick === "max" ? 1 : 0)),
        users: Math.max(1200, s.users - (prevPick === "max" ? 640 : 210)),
        phase: "play",
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
  const answerCheck = useCallback(
    (which: "preAnswers" | "postAnswers", itemId: string, optionId: string) =>
      setState((s) => ({ ...s, [which]: { ...s[which], [itemId]: optionId } })),
    [],
  );
  const setLikert = useCallback(
    (which: "preLikert" | "postLikert", qId: string, val: number) =>
      setState((s) => ({ ...s, [which]: { ...s[which], [qId]: val } })),
    [],
  );
  const setSurveyField = useCallback(
    <K extends keyof GameState>(field: K, val: GameState[K]) =>
      setState((s) => ({ ...s, [field]: val })),
    [],
  );
  const setReflection = useCallback(
    (reflection: string) => setState((s) => ({ ...s, reflection })),
    [],
  );
  /** replay the house; the before-play baseline is kept so the comparison stays meaningful */
  const reset = useCallback(() => {
    setState((s) => ({
      ...initial,
      preAnswers: s.preAnswers,
      preLikert: s.preLikert,
      phase: "play",
    }));
  }, []);

  /** start a completely fresh session for a new participant (P-01, P-02, etc.) */
  const startNewParticipant = useCallback(() => {
    setState({
      ...initial,
      phase: "story",
    });
  }, []);

  /** return to title screen */
  const goToTitle = useCallback(() => {
    setState({
      ...initial,
      phase: "title",
    });
  }, []);

  return {
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
  };
}
