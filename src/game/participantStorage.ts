export interface MisplacementLog {
  deviceName: string;
  roomName: string;
  note: string;
}

export interface ParticipantRecord {
  id: string; // e.g. "P-01"
  timestamp: string;
  priorExp: "Yes" | "No";
  preKnowledgeScore: number;
  postKnowledgeScore: number;
  endingReached: string;
  preLikert: Record<string, number>;
  postLikert: Record<string, number>;
  concepts: string[];
  whyUnfair: string;
  satisfaction: number;
  improvement: string;
  misplacements?: MisplacementLog[];
}

const STORAGE_KEY = "trusttrail.participant_records.v2";

export const INITIAL_MOCK_PARTICIPANTS: ParticipantRecord[] = [
  {
    id: "P-01",
    timestamp: "2026-09-12 09:14:22",
    priorExp: "Yes",
    preKnowledgeScore: 2,
    postKnowledgeScore: 5,
    endingReached: "The Product They Can Actually Trust",
    preLikert: { q1_collect: 3, q2_share: 3, q3_responsibility: 3, q4_deadline: 4, q5_default_trust: 4 },
    postLikert: { q1_collect: 5, q2_share: 1, q3_responsibility: 5, q4_deadline: 1, q5_default_trust: 1 },
    concepts: ["Informed Consent", "Data Minimisation", "Purpose Limitation", "Developer Responsibility"],
    whyUnfair: "Users never read 40-page EULAs. Since 95% of consumers keep default factory settings, shipping aggressive data collection as default takes advantage of user trust.",
    satisfaction: 10,
    improvement: "The Live Data Trail toggle made the consequences of each choice instantly visible. Very clear simulation.",
    misplacements: [{ deviceName: "Smart Speaker", roomName: "Bedroom", note: "Expected speaker could go in bedroom nightstand" }],
  },
  {
    id: "P-02",
    timestamp: "2026-09-12 10:28:45",
    priorExp: "No",
    preKnowledgeScore: 1,
    postKnowledgeScore: 4,
    endingReached: "The Quiet Premium Hike",
    preLikert: { q1_collect: 2, q2_share: 4, q3_responsibility: 3, q4_deadline: 4, q5_default_trust: 5 },
    postLikert: { q1_collect: 4, q2_share: 2, q3_responsibility: 5, q4_deadline: 2, q5_default_trust: 2 },
    concepts: ["Informed Consent", "Data Minimisation", "Developer Responsibility"],
    whyUnfair: "Saying 'user agreed to terms' is not real consent when health and driving signals are quietly sold to insurance brokers without explicit warnings.",
    satisfaction: 9,
    improvement: "Liked the real-world General Motors case study connection at the ending screen.",
    misplacements: [],
  },
  {
    id: "P-03",
    timestamp: "2026-09-12 13:05:11",
    priorExp: "Yes",
    preKnowledgeScore: 3,
    postKnowledgeScore: 5,
    endingReached: "The Network They Never Joined",
    preLikert: { q1_collect: 3, q2_share: 3, q3_responsibility: 4, q4_deadline: 3, q5_default_trust: 4 },
    postLikert: { q1_collect: 5, q2_share: 1, q3_responsibility: 5, q4_deadline: 1, q5_default_trust: 1 },
    concepts: ["Purpose Limitation", "Due Process", "Transparency & Non-Deception"],
    whyUnfair: "People buy a doorbell for home security, not to become a warrantless neighborhood surveillance node for law enforcement.",
    satisfaction: 9,
    improvement: "The tradeoff between startup growth metrics and user safety was very realistic.",
    misplacements: [{ deviceName: "Video Doorbell", roomName: "Media Den", note: "Misclicked room bay on tablet" }],
  },
  {
    id: "P-04",
    timestamp: "2026-09-12 15:42:19",
    priorExp: "No",
    preKnowledgeScore: 2,
    postKnowledgeScore: 4,
    endingReached: "The Product They Can Actually Trust",
    preLikert: { q1_collect: 2, q2_share: 3, q3_responsibility: 3, q4_deadline: 4, q5_default_trust: 4 },
    postLikert: { q1_collect: 4, q2_share: 1, q3_responsibility: 4, q4_deadline: 2, q5_default_trust: 2 },
    concepts: ["Informed Consent", "Data Minimisation", "Developer Responsibility"],
    whyUnfair: "Default settings do all the heavy lifting. When defaults favor data harvesting, consent is an illusion.",
    satisfaction: 8,
    improvement: "Clear UI and very easy to follow.",
    misplacements: [],
  },
  {
    id: "P-05",
    timestamp: "2026-09-13 09:30:04",
    priorExp: "Yes",
    preKnowledgeScore: 2,
    postKnowledgeScore: 5,
    endingReached: "The Update Nobody Read",
    preLikert: { q1_collect: 3, q2_share: 4, q3_responsibility: 3, q4_deadline: 4, q5_default_trust: 3 },
    postLikert: { q1_collect: 5, q2_share: 1, q3_responsibility: 5, q4_deadline: 1, q5_default_trust: 1 },
    concepts: ["Informed Consent", "Transparency & Non-Deception", "Developer Responsibility"],
    whyUnfair: "Pushing automated content recognition (ACR) silently in a firmware update violates user trust, even if buried in a changelog.",
    satisfaction: 10,
    improvement: "The visual novel prologue with Sarah set up the startup pressure really well.",
    misplacements: [{ deviceName: "Fitness Wearable", roomName: "Living Room", note: "Thought wearable belonged near smart hub" }],
  },
  {
    id: "P-06",
    timestamp: "2026-09-13 11:15:38",
    priorExp: "No",
    preKnowledgeScore: 1,
    postKnowledgeScore: 4,
    endingReached: "The Quiet Premium Hike",
    preLikert: { q1_collect: 1, q2_share: 4, q3_responsibility: 2, q4_deadline: 5, q5_default_trust: 5 },
    postLikert: { q1_collect: 4, q2_share: 2, q3_responsibility: 5, q4_deadline: 2, q5_default_trust: 2 },
    concepts: ["Informed Consent", "Data Minimisation", "Developer Responsibility"],
    whyUnfair: "Non-technical consumers assume devices only listen when spoken to. Default always-on mics exploit that assumption.",
    satisfaction: 9,
    improvement: "Great debrief breakdown showing care vs max choices.",
    misplacements: [],
  },
  {
    id: "P-07",
    timestamp: "2026-09-13 14:02:50",
    priorExp: "Yes",
    preKnowledgeScore: 3,
    postKnowledgeScore: 5,
    endingReached: "The Product They Can Actually Trust",
    preLikert: { q1_collect: 4, q2_share: 3, q3_responsibility: 4, q4_deadline: 3, q5_default_trust: 4 },
    postLikert: { q1_collect: 5, q2_share: 1, q3_responsibility: 5, q4_deadline: 1, q5_default_trust: 1 },
    concepts: ["Informed Consent", "Data Minimisation", "Purpose Limitation", "Due Process", "Developer Responsibility"],
    whyUnfair: "Consent must be granular and actively chosen. Bundling third-party data broker rights into initial setup is fundamentally coercive.",
    satisfaction: 10,
    improvement: "Exporting to CSV for research makes this an actual evaluation platform, not just a toy.",
    misplacements: [],
  },
  {
    id: "P-08",
    timestamp: "2026-09-13 16:20:15",
    priorExp: "No",
    preKnowledgeScore: 2,
    postKnowledgeScore: 4,
    endingReached: "The Network They Never Joined",
    preLikert: { q1_collect: 2, q2_share: 4, q3_responsibility: 3, q4_deadline: 4, q5_default_trust: 4 },
    postLikert: { q1_collect: 4, q2_share: 1, q3_responsibility: 5, q4_deadline: 2, q5_default_trust: 2 },
    concepts: ["Purpose Limitation", "Due Process", "Developer Responsibility"],
    whyUnfair: "Bypassing warrant procedures for convenience undermines civil liberties under the guise of community safety.",
    satisfaction: 9,
    improvement: "Fast and engaging. Takes only 5-7 minutes but teaches real concepts.",
    misplacements: [{ deviceName: "Security Camera", roomName: "Front Entryway", note: "Thought security camera was front entryway camera" }],
  },
  {
    id: "P-09",
    timestamp: "2026-09-14 10:10:30",
    priorExp: "Yes",
    preKnowledgeScore: 3,
    postKnowledgeScore: 5,
    endingReached: "The Update Nobody Read",
    preLikert: { q1_collect: 3, q2_share: 3, q3_responsibility: 4, q4_deadline: 3, q5_default_trust: 3 },
    postLikert: { q1_collect: 5, q2_share: 1, q3_responsibility: 5, q4_deadline: 1, q5_default_trust: 1 },
    concepts: ["Informed Consent", "Transparency & Non-Deception", "Developer Responsibility"],
    whyUnfair: "Re-consent flows must be affirmative. Silent telemetry opt-ins weaponize user passivity.",
    satisfaction: 10,
    improvement: "The comparison between pre-test and post-test scores shows genuine learning.",
    misplacements: [],
  },
  {
    id: "P-10",
    timestamp: "2026-09-14 13:45:12",
    priorExp: "Yes",
    preKnowledgeScore: 2,
    postKnowledgeScore: 5,
    endingReached: "The Product They Can Actually Trust",
    preLikert: { q1_collect: 3, q2_share: 3, q3_responsibility: 4, q4_deadline: 4, q5_default_trust: 4 },
    postLikert: { q1_collect: 5, q2_share: 1, q3_responsibility: 5, q4_deadline: 1, q5_default_trust: 1 },
    concepts: ["Informed Consent", "Data Minimisation", "Purpose Limitation", "Due Process", "Transparency & Non-Deception", "Developer Responsibility"],
    whyUnfair: "Engineers have the final ethical agency over what code ships. The simulation proved that ethical design is a conscious engineering choice, not an accident.",
    satisfaction: 10,
    improvement: "Excellent UI polish and data tracking.",
    misplacements: [],
  },
];

export function getParticipantRecords(): ParticipantRecord[] {
  if (typeof window === "undefined") return INITIAL_MOCK_PARTICIPANTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Seed with initial 10 participants if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PARTICIPANTS));
    return INITIAL_MOCK_PARTICIPANTS;
  } catch (err) {
    console.error("Failed to load participant records", err);
  }
  return INITIAL_MOCK_PARTICIPANTS;
}

export function seedSampleParticipants(): ParticipantRecord[] {
  if (typeof window === "undefined") return INITIAL_MOCK_PARTICIPANTS;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PARTICIPANTS));
  } catch (err) {
    console.error("Failed to seed participant records", err);
  }
  return INITIAL_MOCK_PARTICIPANTS;
}

export function saveParticipantRecord(record: Omit<ParticipantRecord, "id" | "timestamp">): ParticipantRecord {
  const existing = getParticipantRecords();
  const nextNum = existing.length + 1;
  const id = `P-${String(nextNum).padStart(2, "0")}`;
  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").substring(0, 19);

  const newRecord: ParticipantRecord = {
    ...record,
    id,
    timestamp,
  };

  const updated = [...existing, newRecord];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save participant record", err);
  }
  return newRecord;
}

export function clearParticipantRecords() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportRecordsToCSV(records: ParticipantRecord[]): string {
  const headers = [
    "Participant ID",
    "Timestamp",
    "Prior IoT Experience",
    "Pre Knowledge Score (/5)",
    "Post Knowledge Score (/5)",
    "Ending Reached",
    "Pre Q1 (Know data)",
    "Post Q1",
    "Pre Q2 (Share data)",
    "Post Q2",
    "Pre Q3 (Eng Responsibility)",
    "Post Q3",
    "Pre Q4 (Deadline skip)",
    "Post Q4",
    "Pre Q5 (Trust defaults)",
    "Post Q5",
    "Identified Concepts",
    "Why Consent != Agreement",
    "Satisfaction (/10)",
    "Improvement Suggestions",
    "Device Placement Notes",
  ];

  const rows = records.map((r) => [
    `"${r.id}"`,
    `"${r.timestamp}"`,
    `"${r.priorExp}"`,
    r.preKnowledgeScore,
    r.postKnowledgeScore,
    `"${r.endingReached.replace(/"/g, '""')}"`,
    r.preLikert["q1_collect"] ?? "",
    r.postLikert["q1_collect"] ?? "",
    r.preLikert["q2_share"] ?? "",
    r.postLikert["q2_share"] ?? "",
    r.preLikert["q3_responsibility"] ?? "",
    r.postLikert["q3_responsibility"] ?? "",
    r.preLikert["q4_deadline"] ?? "",
    r.postLikert["q4_deadline"] ?? "",
    r.preLikert["q5_default_trust"] ?? "",
    r.postLikert["q5_default_trust"] ?? "",
    `"${r.concepts.join(", ")}"`,
    `"${(r.whyUnfair || "").replace(/"/g, '""')}"`,
    r.satisfaction,
    `"${(r.improvement || "").replace(/"/g, '""')}"`,
    `"${(
      r.misplacements
        ?.map(
          (m) =>
            `[${m.deviceName} in ${m.roomName}: ${m.note || "skipped"}]`
        )
        .join("; ") || "None"
    ).replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
