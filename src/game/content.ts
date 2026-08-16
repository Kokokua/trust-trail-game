import {
  Mic,
  Camera,
  Watch,
  Bell,
  Tv,
  type LucideIcon,
} from "lucide-react";

export type Pick = "care" | "max";

export interface RoomDef {
  id: string;
  order: number;
  roomName: string;
  deviceName: string;
  icon: LucideIcon;
  scenario: string;
  followUp: string;
  care: { title: string; argument: string; consequence: string };
  max: { role: string; title: string; argument: string; consequence: string };
  /** top-down layout in a 100x100 grid */
  rect: { x: number; y: number; w: number; h: number };
}

export const ROOMS: RoomDef[] = [
  {
    id: "living",
    order: 1,
    roomName: "Living Room",
    deviceName: "Smart Speaker",
    icon: Mic,
    scenario:
      "You're finalizing the out-of-box setup for your smart speaker. How should the microphone behave the moment it's plugged in?",
    followUp:
      "Support tells you first-week reviews weigh response speed heavily. Your hardware lead notes the wake-word chip handles both modes equally well — this is a defaults decision, not a hardware one.",
    care: {
      title: "Wake-word activation only",
      argument: "The mic stays inactive until it hears the wake word.",
      consequence: "Users may find it feels slightly slower to respond than always-on competitors.",
    },
    max: {
      role: "Product Manager",
      title: "Always-on ambient listening",
      argument:
        "Every competitor ships always-on by default, and if we don't, our response-time reviews suffer.",
      consequence: "The speaker hears the room continuously from the first minute.",
    },
    rect: { x: 4, y: 4, w: 50, h: 44 },
  },
  {
    id: "hallway",
    order: 2,
    roomName: "Upstairs Hallway",
    deviceName: "Security Camera",
    icon: Camera,
    scenario:
      "Your indoor security camera records continuously. How long should footage be kept?",
    followUp:
      "Storage costs are roughly the same either way at your scale. Early testers are split: some love scrubbing back weeks, others ask where the footage lives.",
    care: {
      title: "Auto-delete after 24 hours",
      argument: "Plus a dashboard to review or delete anything, anytime.",
      consequence: "Users lose the ability to search back through older footage.",
    },
    max: {
      role: "Engineer",
      title: "Keep footage indefinitely",
      argument:
        "Our 'search your history' feature needs a real archive to work — if we delete daily, that feature is basically useless.",
      consequence: "Every hour of household life stays searchable indefinitely.",
    },
    rect: { x: 4, y: 52, w: 30, h: 44 },
  },
  {
    id: "bedroom",
    order: 3,
    roomName: "Bedroom",
    deviceName: "Fitness Wearable",
    icon: Watch,
    scenario:
      "A data partnership firm wants to buy aggregated health and activity data from your fitness wearable.",
    followUp:
      "The firm's contract is standard for the category. Finance notes your margin gap is about eleven dollars a unit either way.",
    care: {
      title: "No data sharing with any third party",
      argument: "Revenue comes from hardware and subscriptions only.",
      consequence: "The device has to be priced higher to hit the same margin.",
    },
    max: {
      role: "Business Development lead",
      title: "Share aggregated health and behavioural data",
      argument:
        "This single partnership could double our revenue per unit without raising the retail price at all.",
      consequence: "Advertising and insurance partners receive ongoing health signals.",
    },
    rect: { x: 38, y: 52, w: 30, h: 44 },
  },
  {
    id: "entry",
    order: 4,
    roomName: "Front Entryway",
    deviceName: "Video Doorbell",
    icon: Bell,
    scenario:
      "Local police are interested in a data-sharing arrangement with your video doorbell users. How do requests work?",
    followUp:
      "Two departments have already asked. Your legal counsel says both models are lawful; the difference is how fast footage moves and who signs off.",
    care: {
      title: "Warrant required, requests logged publicly",
      argument: "Footage moves only with a valid warrant, and every request is published.",
      consequence:
        "Some police departments decline to promote the product without faster access, costing partnerships.",
    },
    max: {
      role: "Partnerships Manager",
      title: "Community Safety Partner program",
      argument:
        "Waiting for a warrant every time means police lose the exact window when footage actually matters — and it tests incredibly well with users too.",
      consequence: "Footage can be requested without a warrant through the app.",
    },
    rect: { x: 72, y: 52, w: 24, h: 44 },
  },
  {
    id: "den",
    order: 5,
    roomName: "Media Den",
    deviceName: "Smart TV",
    icon: Tv,
    scenario:
      "An upcoming firmware update adds viewing pattern analysis to TVs already sitting in people's homes.",
    followUp:
      "The same update carries three security patches. Your QA lead estimates the re-consent flow needs about three weeks of build and testing.",
    care: {
      title: "Off until the user opts in",
      argument: "The capability stays dark until a clear re-consent prompt is accepted.",
      consequence: "Building and testing the re-consent flow delays release by several weeks.",
    },
    max: {
      role: "Engineer",
      title: "Ship it silently, on by default",
      argument:
        "Re-consent screens tank update adoption — and that means the security patches bundled in the same update don't get applied either.",
      consequence: "TVs in homes change what they collect overnight, noted only in a changelog.",
    },
    rect: { x: 58, y: 4, w: 38, h: 44 },
  },
];

export type EndingId = "trusted" | "gm" | "ring" | "meta";

export interface Ending {
  id: EndingId;
  tone: "warm" | "sober";
  title: string;
  summary: string;
  realWorld: string;
  principle: string;
  debrief: string;
  citation?: { text: string; url: string };
}

export const ENDINGS: Record<EndingId, Ending> = {
  trusted: {
    id: "trusted",
    tone: "warm",
    title: "The Trusted Product",
    summary:
      "The product ships with privacy-respecting defaults across the board — microphone, retention, partnerships, footage, and updates.",
    realWorld:
      "Most consumer smart devices on the market today default to sharing behavioural data with at least one third party. This one doesn't.",
    principle: "Informed Consent, Data Minimisation, and Transparency — together.",
    debrief:
      "You made five decisions today, and every one of them cost you something — slower reviews, a weaker search feature, a higher price tag, lost police partnerships, a delayed release. Every argument you turned down was a real argument a real product team would make. The product you shipped is the exception, not the norm.",
  },
  gm: {
    id: "gm",
    tone: "sober",
    title: "The Quiet Premium Hike",
    summary:
      "Your microphone and retention defaults quietly built the richest behavioural dataset in your category.",
    realWorld:
      "General Motors' OnStar Smart Driver program shared driving behaviour data with data brokers LexisNexis and Verisk, who supplied it to insurers — leading some drivers to see premium increases without a clear explanation. It was disclosed in lengthy consent terms, but never meaningfully understood.",
    principle: "Informed Consent and Data Minimisation.",
    debrief:
      "Nobody in your product meeting decided to raise anyone's insurance premium. You decided to enable a microphone by default, or keep camera footage a little longer. Each choice felt like a normal product decision. But \u201cthe user agreed to this in the setup flow\u201d and \u201cthe user understood what they agreed to\u201d are not the same thing.",
    citation: {
      text: "Real case: General Motors' OnStar Smart Driver program, reported by The New York Times, March 2024. GM discontinued the program in April 2024; the FTC finalized an order restricting this practice in January 2026.",
      url: "https://techcrunch.com/2026/01/14/the-ftcs-data-sharing-order-against-gm-is-finally-settled",
    },
  },
  ring: {
    id: "ring",
    tone: "sober",
    title: "The Network They Never Joined",
    summary:
      "Your footage and partnership decisions pulled customers into a data network they never pictured when they bought the device.",
    realWorld:
      "Amazon Ring's \u201cRequest for Assistance\u201d program let police request doorbell footage from users without a warrant through the Neighbors app, raising civil liberties concerns about a scale and speed users never anticipated.",
    principle: "Purpose Limitation and Due Process.",
    debrief:
      "The user who mounted this doorbell wanted to see who was at their door. They didn't sign up to be part of a police data-sharing network, even one with a friendly name. The program you approved passed every legal review. It still crossed a line the user never knew existed.",
    citation: {
      text: "Real case: Amazon Ring's 'Request for Assistance' program (2021\u20132024) let police request doorbell footage from users without a warrant. Ring discontinued it in January 2024 after criticism from civil liberties groups.",
      url: "https://www.cnn.com/2024/01/24/tech/amazons-ring-video-sharing-with-police",
    },
  },
  meta: {
    id: "meta",
    tone: "sober",
    title: "The Update Nobody Read",
    summary:
      "Devices already in homes changed what they do overnight, and the only record was a changelog.",
    realWorld:
      "Meta marketed its Ray-Ban smart glasses as \u201cdesigned for privacy, controlled by you.\u201d A 2026 lawsuit alleges footage shared with Meta AI — including sensitive private moments users never expected another person to see — was reviewed by human contractors as part of an undisclosed review pipeline, contradicting the product's own privacy marketing.",
    principle: "Honesty and Non-Deception.",
    debrief:
      "The device on the user's face today is sending more of their life to more people than they realize. Consent isn't just about what a device collects — it's about whether the user understands who else ends up looking at it. Meta promised privacy \u201ccontrolled by you.\u201d The lawsuit alleges that promise didn't match what actually happened to the footage.",
    citation: {
      text: "Real case: A 2026 lawsuit alleges footage shared with Meta's Ray-Ban AI glasses was reviewed by human contractors without users clearly understanding this could happen, despite marketing claims like 'designed for privacy, controlled by you.'",
      url: "https://www.yahoo.com/news/articles/meta-sued-over-ai-smart-165020080.html",
    },
  },
};

/**
 * Ending resolution.
 *
 * Fixed priority order, independent of the order the player visited rooms:
 *   Room 5 (Smart TV)                    -> Meta ending
 *   Room 4 (Doorbell) or Room 3 (Wearable) -> Ring ending
 *   Room 2 (Camera) or Room 1 (Speaker)  -> GM ending
 *   otherwise                            -> Trusted Product
 *
 * Deliberately NOT a point threshold — each ending's real-world case only
 * makes sense tied to its specific category of decision.
 *
 * Returns the ending plus the room id that determined it (null for the clean run).
 */
export function resolveEnding(choices: Record<string, Pick>): {
  ending: Ending;
  decidingRoom: string | null;
} {
  if (choices["den"] === "max") return { ending: ENDINGS.meta, decidingRoom: "den" };
  if (choices["entry"] === "max") return { ending: ENDINGS.ring, decidingRoom: "entry" };
  if (choices["bedroom"] === "max") return { ending: ENDINGS.ring, decidingRoom: "bedroom" };
  if (choices["hallway"] === "max") return { ending: ENDINGS.gm, decidingRoom: "hallway" };
  if (choices["living"] === "max") return { ending: ENDINGS.gm, decidingRoom: "living" };
  return { ending: ENDINGS.trusted, decidingRoom: null };
}

export interface DeviceProfile {
  id: string;
  name: string;
  icon: LucideIcon;
  collects: string;
  sharedWith: string;
  concern: string;
}

export const DEVICE_PROFILES: DeviceProfile[] = [
  {
    id: "speaker",
    name: "Smart Speaker",
    icon: Mic,
    collects: "Voice recordings, wake-word activations, query history, sometimes ambient audio.",
    sharedWith: "Cloud processing servers, sometimes third-party app developers.",
    concern:
      "Always-on smart speakers have repeatedly been found to record and transmit audio outside intended activations, due to false triggers.",
  },
  {
    id: "camera",
    name: "Security Camera",
    icon: Camera,
    collects: "Continuous video and audio, motion-triggered clips.",
    sharedWith: "Cloud storage providers, sometimes analytics and facial-recognition partners.",
    concern:
      "Indoor camera footage retained indefinitely for \u201csmart search\u201d features creates a searchable archive of household life most users don't realize exists.",
  },
  {
    id: "wearable",
    name: "Fitness Wearable",
    icon: Watch,
    collects: "Heart rate, sleep, activity, and location data.",
    sharedWith: "Health and insurance partners, sometimes advertisers.",
    concern:
      "Aggregated wearable health data has been used by insurers to inform risk assessments in ways most users never anticipated.",
  },
  {
    id: "doorbell",
    name: "Video Doorbell",
    icon: Bell,
    collects: "Video, audio, motion-triggered clips, sometimes facial recognition data.",
    sharedWith: "Cloud storage, sometimes law enforcement partnerships.",
    concern:
      "Doorbell footage-sharing programs with police have raised questions about how much footage is requested and whether users understand their device is part of such a network.",
  },
  {
    id: "tv",
    name: "Smart TV",
    icon: Tv,
    collects:
      "Viewing history, voice commands, sometimes on-screen content via automatic content recognition.",
    sharedWith: "Advertising networks and analytics firms.",
    concern:
      "Automatic content recognition tracks what's on screen — including from external devices plugged into the TV — often without users realizing the feature exists.",
  },
];
