import type { Pick } from "./content";

/**
 * Per-choice ethical feedback.
 *
 * Shown immediately after each decision. It never says "wrong" — it names the
 * principle at stake, explains the reasoning behind the trade-off, and anchors
 * it to what happens in the real world.
 */
export interface ChoiceFeedback {
  principle: string;
  /** what the player's specific choice means ethically */
  care: string;
  max: string;
  /** real-world anchor for the room's topic */
  realWorld: string;
}

export const ROOM_FEEDBACK: Record<string, ChoiceFeedback> = {
  living: {
    principle: "Informed Consent — a default is a decision you make on the user's behalf.",
    care:
      "Wake-word only means the user has to act before the microphone listens. Consent is expressed by doing something, not by failing to find a setting. The cost is real: slower first impressions. That cost is what makes this an ethical choice rather than an easy one.",
    max:
      "Always-on is lawful and disclosed — it will be in the terms. But almost nobody reads setup terms, so in practice the household never agreed to continuous listening; it simply never turned it off. That gap between agreed and understood is exactly where informed consent fails.",
    realWorld:
      "Voice assistants have repeatedly captured audio outside intended activations through false wake-word triggers, with contractors reviewing clips users never knew were recorded.",
  },
  hallway: {
    principle: "Data Minimisation — keep only what the stated purpose needs.",
    care:
      "A 24-hour window still serves the purpose people bought the camera for: seeing what just happened. Everything past that is data held because it might be useful someday, which is the definition of what minimisation asks you to drop.",
    max:
      "Indefinite retention isn't neutral storage. It turns a security device into a searchable archive of family life that can be breached, subpoenaed, or repurposed later by a company the user never chose. The feature is real; so is the archive it requires.",
    realWorld:
      "Indoor camera archives kept for 'smart search' have been accessed by employees and exposed in breaches, long after the moment the footage was recorded mattered.",
  },
  bedroom: {
    principle: "Purpose Limitation — data collected for one reason shouldn't quietly serve another.",
    care:
      "Funding the product from hardware and subscriptions keeps the user, not a data buyer, as the customer. The higher price is the honest version of the cost the other path hides inside the data.",
    max:
      "'Aggregated' sounds protective, but health and activity signals are notoriously re-identifiable, and the buyer's purpose — pricing risk, targeting ads — is not the purpose the user bought a fitness tracker for. They consented to tracking their sleep, not to being scored.",
    realWorld:
      "Behavioural data sold to brokers has reached insurers and changed people's premiums, with no clear explanation offered to the person affected.",
  },
  entry: {
    principle: "Due Process — a product shouldn't route around the protections people have by law.",
    care:
      "A warrant requirement plus a public request log keeps the legal check intact and makes the system auditable. Losing police promotion is a business cost, not an ethical one.",
    max:
      "Nothing here is illegal, and it tests well. But the person who mounted a doorbell to see deliveries has been enrolled into a surveillance network by a setting, and the safeguard that normally stands between a household and the state has been replaced by an in-app button.",
    realWorld:
      "Warrantless footage-request programs enrolled doorbell owners into police networks they never pictured when they bought the device.",
  },
  den: {
    principle: "Transparency and Non-Deception — consent has to be renewed when the deal changes.",
    care:
      "A device that gains a new capability is a new product. Asking again — even at the cost of weeks — is what keeps the original consent honest instead of retroactive.",
    max:
      "A changelog is disclosure, not consent. Hardware people already own starts collecting something new overnight, which means the agreement they made at purchase now covers something they never saw. Bundling security patches makes the pressure real, but it doesn't transfer their agreement.",
    realWorld:
      "Smart TVs have added viewing-pattern and on-screen content recognition through firmware updates, with the change noted only in release notes.",
  },
};

export function feedbackFor(roomId: string, pick: Pick) {
  const f = ROOM_FEEDBACK[roomId];
  if (!f) return null;
  return { principle: f.principle, body: f[pick], realWorld: f.realWorld };
}

/**
 * Understanding check.
 *
 * The same five items are asked before the first room and again after the
 * debrief, so the shift between the two runs is measurable per player.
 * Never labelled a quiz in the UI — it's framed as a founder's judgement call.
 */
export interface CheckOption {
  id: string;
  label: string;
}

export interface CheckItem {
  id: string;
  prompt: string;
  options: CheckOption[];
  /** the answer that reflects informed-consent practice */
  key: string;
  /** shown only in the after-play pass */
  explain: string;
  principle: string;
}

export const CHECK_ITEMS: CheckItem[] = [
  {
    id: "consent",
    prompt:
      "A smart speaker's terms clearly state that it listens continuously. The buyer taps Accept during setup. Have they given informed consent to always-on listening?",
    options: [
      { id: "a", label: "Yes — it was disclosed and they accepted it" },
      { id: "b", label: "Only if they were likely to understand what they accepted" },
      { id: "c", label: "No — continuous listening can never be consented to" },
    ],
    key: "b",
    explain:
      "Disclosure is necessary but not sufficient. Consent counts when the person could realistically understand and refuse — which is why defaults, timing and wording matter more than the length of the terms.",
    principle: "Informed Consent",
  },
  {
    id: "retention",
    prompt:
      "Your camera keeps footage indefinitely because a search feature needs the archive. Storage is cheap. What's the strongest ethical objection?",
    options: [
      { id: "a", label: "It costs the company money to store" },
      { id: "b", label: "Data kept beyond its purpose creates risk the user never agreed to carry" },
      { id: "c", label: "There is no objection — the feature justifies it" },
    ],
    key: "b",
    explain:
      "Data minimisation isn't about cost. Every extra day of retention widens exposure to breach, subpoena and repurposing — risk that lands on the household, not the company.",
    principle: "Data Minimisation",
  },
  {
    id: "purpose",
    prompt:
      "A fitness wearable sells aggregated activity data to a partner that prices insurance. Users agreed to 'sharing with partners'. What's the problem?",
    options: [
      { id: "a", label: "Aggregated data is anonymous, so there isn't one" },
      { id: "b", label: "The data is being used for a purpose the user never had in mind" },
      { id: "c", label: "The company should have charged more for the data" },
    ],
    key: "b",
    explain:
      "Purpose limitation. People share sleep and step data to improve their own health, not to be scored as a risk — and aggregated health data is often re-identifiable anyway.",
    principle: "Purpose Limitation",
  },
  {
    id: "process",
    prompt:
      "A doorbell maker lets police request footage in-app without a warrant. Users can decline each request. Is the safeguard sufficient?",
    options: [
      { id: "a", label: "Yes — the user can always say no" },
      { id: "b", label: "No — it shifts a legal protection onto an unprepared individual" },
      { id: "c", label: "Yes, as long as it's in the privacy policy" },
    ],
    key: "b",
    explain:
      "A warrant is a check on the state reviewed by a court. Replacing it with a push notification puts that judgement on a person with no legal advice, under social pressure, in their own doorway.",
    principle: "Due Process",
  },
  {
    id: "update",
    prompt:
      "A firmware update adds viewing analysis to TVs already in homes, documented in the changelog. What would make this ethical?",
    options: [
      { id: "a", label: "Nothing — it's already documented" },
      { id: "b", label: "Turning it off by default and asking the owner to opt in" },
      { id: "c", label: "Emailing all users after the update ships" },
    ],
    key: "b",
    explain:
      "When a device's behaviour changes, the original agreement no longer covers it. New capability, new consent — off until the owner says yes.",
    principle: "Transparency and Non-Deception",
  },
];

export function scoreCheck(answers: Record<string, string>) {
  return CHECK_ITEMS.filter((i) => answers[i.id] === i.key).length;
}
