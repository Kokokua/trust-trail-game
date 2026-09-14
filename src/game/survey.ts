export interface LikertQuestion {
  id: string;
  dimension: string;
  dimensionNum: number;
  prompt: string;
  reverse?: boolean;
}

export const LIKERT_QUESTIONS: LikertQuestion[] = [
  {
    id: "q1_collect",
    dimension: "Knowledge of data collection",
    dimensionNum: 1,
    prompt: "I know what data my smart devices collect and where it goes.",
  },
  {
    id: "q2_share",
    dimension: "Knowledge of data collection",
    dimensionNum: 1,
    prompt: "I believe my smart device data is shared with advertisers, insurance companies, or the government.",
  },
  {
    id: "q3_responsibility",
    dimension: "Engineering responsibility",
    dimensionNum: 2,
    prompt: "As a software engineer, I feel personally responsible for making sure users truly understand what they are agreeing to in a product I build.",
  },
  {
    id: "q4_deadline",
    dimension: "Engineering responsibility",
    dimensionNum: 2,
    prompt: "When a deadline makes it hard to build a proper consent screen, it is okay to ship a simpler version and fix it later.",
    reverse: true,
  },
  {
    id: "q5_default_trust",
    dimension: "Trust in default settings",
    dimensionNum: 3,
    prompt: "The default settings on smart devices are designed mainly to protect the user's privacy.",
  },
];

export const ETHICAL_CONCEPTS = [
  "Informed Consent",
  "Data Minimisation",
  "Purpose Limitation",
  "Due Process",
  "Transparency & Non-Deception",
  "Developer Responsibility",
];
