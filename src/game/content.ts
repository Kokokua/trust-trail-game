import {
  Mic,
  Database,
  Handshake,
  DoorOpen,
  ArrowUpCircle,
  Tv,
  Thermometer,
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
  care: { title: string; argument: string };
  max: { title: string; argument: string };
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
    care: {
      title: "Wake-word activation only",
      argument: "The mic stays inactive until it hears the wake word.",
    },
    max: {
      title: "Always-on ambient listening",
      argument:
        "Product lead: every competitor ships always-on by default, and if we don't, our response-time reviews suffer.",
    },
    rect: { x: 4, y: 4, w: 50, h: 44 },
  },
  {
    id: "storage",
    order: 2,
    roomName: "Basement Storage",
    deviceName: "Data Store",
    icon: Database,
    scenario:
      "Your data team needs a retention policy before launch. What happens to the voice recordings you collect?",
    care: {
      title: "Auto-delete after 24 hours",
      argument: "Plus a dashboard where people can delete anything, anytime.",
    },
    max: {
      title: "Keep recordings indefinitely",
      argument:
        "Data team: voice model accuracy is our biggest differentiator — delete daily and our model plateaus while competitors' keep improving.",
    },
    rect: { x: 4, y: 52, w: 30, h: 44 },
  },
  {
    id: "office",
    order: 3,
    roomName: "Home Office",
    deviceName: "Partnerships",
    icon: Handshake,
    scenario:
      "A business development lead drops a term sheet from a data partnership firm on your desk. Do you sign?",
    care: {
      title: "No third-party data sharing",
      argument: "Revenue comes from hardware and subscriptions only.",
    },
    max: {
      title: "Share aggregated behavioural data",
      argument:
        "BD lead: hardware margins are razor thin — this one partnership with ad and insurance buyers could double revenue per unit.",
    },
    rect: { x: 38, y: 52, w: 30, h: 44 },
  },
  {
    id: "entry",
    order: 4,
    roomName: "Front Entryway",
    deviceName: "Video Doorbell",
    icon: DoorOpen,
    scenario:
      "Local police want a data-sharing arrangement with your video doorbell network. How do requests work?",
    care: {
      title: "Warrant required, log it publicly",
      argument: "Footage moves only with a valid warrant, and every request is published.",
    },
    max: {
      title: "Community Safety Partner program",
      argument:
        "Policy lead: waiting for a warrant every time means police lose the exact window when footage actually matters.",
    },
    rect: { x: 72, y: 52, w: 24, h: 44 },
  },
  {
    id: "bedroom",
    order: 5,
    roomName: "Bedroom Attic",
    deviceName: "Firmware Update",
    icon: ArrowUpCircle,
    scenario:
      "Engineering is ready to ship an update that adds a new data-collection capability to devices already sitting in people's homes.",
    care: {
      title: "Off until they opt in",
      argument: "The capability stays dark until a clear re-consent prompt is accepted.",
    },
    max: {
      title: "Ship it on by default",
      argument:
        "Engineering: re-consent screens tank update adoption — and the security patches ride in the same update.",
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
      "You made five decisions today, and every one of them cost you something — slower reviews, slower model improvement, lower revenue, slower police response, lower update adoption. Every argument you turned down was a real argument a real product team would make. The product you shipped is the exception, not the norm.",
  },
  gm: {
    id: "gm",
    tone: "sober",
    title: "The Quiet Premium Hike",
    summary:
      "Your microphone and retention defaults quietly built the richest behavioural dataset in your category.",
    realWorld:
      "This mirrors a documented case involving a major automaker whose connected-car program collected detailed driving data and shared it with data brokers who supplied it to insurers. Individual drivers saw premiums rise with no clear explanation — technically disclosed in lengthy consent terms, never meaningfully understood.",
    principle: "Informed Consent and Data Minimisation.",
    debrief:
      "Nobody in your product meeting decided to raise anyone's insurance premium. You decided to enable a microphone by default, or keep recordings a little longer. Each choice felt like a normal product decision. But \u201cthe user agreed to this in the setup flow\u201d and \u201cthe user understood what they agreed to\u201d are not the same thing.",
  },
  ring: {
    id: "ring",
    tone: "sober",
    title: "The Network They Never Joined",
    summary:
      "Your footage and partnership decisions pulled customers into a data network they never pictured when they bought a doorbell.",
    realWorld:
      "This mirrors the real controversy around a major smart doorbell company's police partnership program, which allowed footage requests without a warrant through an opt-in \u201ccommunity safety\u201d framework — raising civil liberties concerns about a scale and speed users never anticipated.",
    principle: "Purpose Limitation and Due Process.",
    debrief:
      "The user who mounted this doorbell wanted to see who was at their door. They didn't sign up to be part of a police data-sharing network, even one with a friendly name. The program you approved passed every legal review. It still crossed a line the user never knew existed.",
  },
  meta: {
    id: "meta",
    tone: "sober",
    title: "The Update Nobody Read",
    summary:
      "Devices already in homes changed what they do overnight, and the only record was a changelog.",
    realWorld:
      "This mirrors real cases involving smart wearable devices where new AI-driven data processing arrived via software update, disclosed only in a technical changelog — drawing criticism that stated privacy commitments didn't match what the update actually enabled by default.",
    principle: "Honesty and Non-Deception.",
    debrief:
      "The device in the user's home today does something different from what it did yesterday, and the only place that's written down is a changelog almost nobody opens. Consent isn't a box you check once — it's a relationship you're supposed to keep renewing every time what the device does actually changes.",
  },
};

/**
 * Ending resolution.
 *
 * Priority runs backwards through the story order: the most narratively recent
 * consent violation is the one that surfaces first, the way the last unresolved
 * issue is usually what an investigation finds. This is deliberately NOT a
 * point threshold — each ending's real-world case only makes sense tied to its
 * specific category of decision.
 *
 * Returns the ending plus the room id that determined it (null for the clean run).
 */
export function resolveEnding(choices: Record<string, Pick>): {
  ending: Ending;
  decidingRoom: string | null;
} {
  if (choices.bedroom === "max") return { ending: ENDINGS.meta, decidingRoom: "bedroom" };
  if (choices.entry === "max") return { ending: ENDINGS.ring, decidingRoom: "entry" };
  if (choices.office === "max") return { ending: ENDINGS.ring, decidingRoom: "office" };
  if (choices.storage === "max") return { ending: ENDINGS.gm, decidingRoom: "storage" };
  if (choices.living === "max") return { ending: ENDINGS.gm, decidingRoom: "living" };
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
    id: "doorbell",
    name: "Video Doorbell",
    icon: DoorOpen,
    collects: "Video, audio, motion-triggered clips, sometimes facial recognition data.",
    sharedWith: "Cloud storage, sometimes law enforcement partnerships.",
    concern:
      "Footage-sharing programs with police have raised questions about how much footage is requested and whether users understand their device is part of such a network.",
  },
  {
    id: "thermostat",
    name: "Smart Thermostat",
    icon: Thermometer,
    collects: "Temperature preferences and occupancy patterns.",
    sharedWith: "Energy utility partners, sometimes analytics and advertising partners.",
    concern:
      "Occupancy data reveals detailed household routines with commercial value well beyond the thermostat's core function.",
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
  {
    id: "store",
    name: "Cloud Data Store",
    icon: Database,
    collects: "Everything the devices send home, kept for as long as the retention policy allows.",
    sharedWith: "Internal model training, analytics vendors, sometimes data brokers.",
    concern:
      "Long retention windows turn a moment of ordinary household life into a record that can be requested, sold, or breached years later.",
  },
];
