# Trust Trail Builder

TrustTrail — One-Shot Build Prompt

Build a complete, working web app called TrustTrail: Build Your Smart Home Startup — a single-player browser decision simulator that teaches informed consent in IoT products through gameplay, not quiz questions. Generate the full app now, working end to end, using React.

The Feel

This must feel like a game, not a survey. The player is running a smart-home device startup. They never see the words "Option A" or "Option B" anywhere in the UI, and they are never told which choice is "correct." They just see two real product tradeoffs and pick one, the same way a founder would in a real meeting. Feedback is immediate and visual (a growing user counter, a room changing mood, a short toast), not a lecture that interrupts play. The ethics lesson lands at the end, in a debrief, after the player has already lived with the consequences of their choices.

Core Loop

Player sees a 2D top-down house (flat-color, simple shapes — think a clean, warm version of a Stardew-Valley-style top-down home, not photorealistic) with 5 empty rooms and a sidebar of 5 draggable device icons.

Player drags a device into its matching room. The room highlights when a dragged device is near it.

Dropping the device opens a small floating card near that room (not a full-screen modal) showing a short scenario and two real tradeoff options, each with a one-line argument for why a product team might pick it. No labels like "A/B," "good/bad," or "safe/risky" appear anywhere in this card.

Player picks one. The card closes. The room's color shifts (warm gold/green tone for the privacy-respecting pick, a muted slate/coral tone for the data-maximising pick) and a small persistent icon appears on the device (a shield for the privacy-respecting pick, an eye for the data-maximising pick). A short toast confirms the setup was saved. A "Users" counter in a small dashboard ticks upward.

Repeat for all 5 rooms, in any order the player chooses (not forced sequential order — this is a key game-feel improvement, let the player wander the house).

Once all 5 are set, the house zooms out to show the full home with all 5 rooms in their final colors for a couple of seconds, then transitions to the Ending screen.

Ending screen shows one of 4 possible outcomes, tied to a real-world case, followed by a Debrief screen that replays the player's 5 choices, names the specific decision that determined the ending, and shows the ethical principle involved. A reflection textarea and a link to an external pre/post survey (Google Form — use a placeholder URL) closes the loop.

Tech Requirements

React, functional components and hooks only.

Drag and drop for placing devices into rooms (use any lightweight, modern drag-and-drop approach — native HTML5 drag events or a small library is fine).

Must work with mouse and touch. On narrow screens (under ~640px), do not just shrink the house to illegibility — either allow pinch/scroll-zoom on the house view, or switch to a swipeable one-room-at-a-time view that still uses the same room art and mood-color system (not a plain text fallback).

No backend, no login. All state lives in memory for the session; persist progress to localStorage so a refresh doesn't lose it.

Single-page app, one continuous experience from house → ending → debrief.

Visual Style

Warm and friendly, not corporate or clinical. Soft cream/off-white background, rounded card shapes, soft shadows. Accent colors: warm amber/gold for Trust and positive outcomes, a muted coral/slate (not alarm-red) for Risk and consequence outcomes — this is a reflection tool, not a horror game, so risky choices should feel "serious and a little sad," never punishing or game-over-ish. Rounded, friendly sans-serif font (system-ui / Inter style). Simple line icons for devices (speaker, storage/box, briefcase or handshake for partnerships, doorbell, an upward-arrow/refresh icon for firmware). The house itself should be flat 2D geometric shapes with clear room boundaries — a top-down layout, not an isometric one, to keep this achievable in one generation pass.

The Startup Dashboard (always visible, small, top of screen)

Trust meter: starts neutral, moves up when the player picks the privacy-respecting option, moves down when they pick the data-maximising one.

Risk meter: starts at zero, only ever goes up, and only moves when the player picks the data-maximising option.

Users counter: a separate cosmetic number that starts around 1,200 and ticks upward with every decision made — rises a little faster when the player picks the data-maximising option than the privacy-respecting one, so the player feels the temptation of the easy choice even though it doesn't affect the real ending. This number is flavor, not part of the scoring logic.

The Five Rooms and Decisions

Map each decision to a room in the house exactly like this, and use this content directly (lightly rephrase only if needed for length, but keep the substance and the specific real-world grounding):

Room 1 — Living Room → Microphone & Camera Setup Scenario: You're finalizing the out-of-box setup for your smart speaker.

Choice 1 (privacy-respecting): Wake-word activation only — the mic stays inactive until the wake word is heard.

Choice 2 (data-maximising): Always-on ambient listening, framed by the product lead as necessary because "every competitor ships always-on by default, and if we don't, our response-time reviews suffer."

Room 2 — Basement/Storage → Data Retention Policy Scenario: Your data team needs a retention policy before launch.

Choice 1 (privacy-respecting): Auto-delete recordings after 24 hours, with a user dashboard to delete anytime.

Choice 2 (data-maximising): Keep recordings indefinitely, framed as necessary because "voice model accuracy is our biggest differentiator — if we delete daily, our model plateaus while competitors' keep improving."

Room 3 — Home Office → Data Partnerships Scenario: A business development lead brings a term sheet from a data partnership firm.

Choice 1 (privacy-respecting): No data sharing with any third party — revenue from hardware and subscriptions only.

Choice 2 (data-maximising): Share aggregated behavioural data with advertising and insurance partners, framed as necessary because "hardware margins are razor thin — this single partnership could double our revenue per unit."

Room 4 — Front Entryway → Law Enforcement Requests Scenario: Your video doorbell has drawn interest from local police for a data-sharing arrangement.

Choice 1 (privacy-respecting): Footage shared only with a valid warrant, with a public transparency log of requests.

Choice 2 (data-maximising): Launch a "Community Safety Partner" program allowing footage requests without a warrant, framed as necessary because "waiting for a warrant every time means police lose the exact window when footage actually matters."

Room 5 — Bedroom/Attic → Firmware Update Scenario: Engineering wants to ship an update adding a new data-collection capability to devices already in homes.

Choice 1 (privacy-respecting): The new capability stays off until the user sees a clear re-consent prompt and opts in.

Choice 2 (data-maximising): The update ships silently, capability on by default, mentioned only in a buried changelog, framed as necessary because "re-consent screens tank update adoption, which means security patches in the same update don't get applied either."

Ending Logic (implement exactly this way)

Track which choice (1 or 2) was made in each room. Resolve the ending by checking rooms from last-configured-in-story-order to first — meaning priority order is Room 5 → Room 4/3 → Room 2/1, regardless of the actual order the player visited rooms in:

If Room 5 = data-maximising choice → "The Meta Ending"

Else if Room 4 or Room 3 = data-maximising choice → "The Ring Ending"

Else if Room 2 or Room 1 = data-maximising choice → "The GM Ending"

Else (all privacy-respecting choices) → "The Trusted Product Ending"

This means the most narratively "recent" consent violation determines the ending, since it mirrors how the last unresolved issue is usually what surfaces first in a real investigation. Implement this as a small, clearly commented function — do not use a simple point-threshold system, because each ending's real-world case only makes sense tied to its specific category of decision, not to a raw score.

The Four Endings

"The Trusted Product Ending" (positive tone — warm greens/golds, feels like a success screen, not cartoonish) Summary: The product ships with privacy-respecting defaults across the board. Real-world contrast: Most consumer smart devices on the market today default to sharing behavioural data with at least one third party — this product doesn't. Principle upheld: Informed Consent, Data Minimisation, and Transparency, together. Debrief: "You made five decisions today, and every one of them cost you something — slower reviews, slower model improvement, lower revenue, slower police response, lower update adoption. Every argument you turned down was a real argument a real product team would make. The product you shipped is the exception, not the norm."

"The GM Ending" (consequence tone — muted slate/charcoal with coral accent) Triggered by: data-maximising choice in Room 1 or Room 2. Real-world case: Mirrors a documented case involving a major automaker whose connected-car program collected detailed driving data and shared it with data brokers who supplied it to insurers, leading to individual drivers seeing insurance premiums rise without a clear explanation — technically disclosed in lengthy consent terms, but never meaningfully understood. Principle violated: Informed Consent and Data Minimisation. Debrief: "Nobody in your product meeting decided to raise anyone's insurance premium. You decided to enable a microphone by default, or keep recordings a little longer. Each choice felt like a normal product decision. But 'the user agreed to this in the setup flow' and 'the user understood what they agreed to' are not the same thing."

"The Ring Ending" (consequence tone) Triggered by: data-maximising choice in Room 3 or Room 4. Real-world case: Mirrors the real controversy around a major smart doorbell company's police partnership program, which allowed footage requests without a warrant through an opt-in "community safety" framework, raising concerns from civil liberties groups about scale and speed users never anticipated. Principle violated: Purpose Limitation and Due Process. Debrief: "The user who mounted this doorbell wanted to see who was at their door. They didn't sign up to be part of a police data-sharing network, even one with a friendly name. The program you approved passed every legal review. It still crossed a line the user never knew existed."

"The Meta Ending" (consequence tone) Triggered by: data-maximising choice in Room 5. Real-world case: Mirrors real cases involving smart wearable devices where new AI-driven data processing was added via software update, disclosed only in a technical changelog, drawing criticism that stated privacy commitments didn't match what the update actually enabled by default. Principle violated: Honesty and Non-Deception. Debrief: "The device in the user's home today does something different from what it did yesterday, and the only place that's written down is a changelog almost nobody opens. Consent isn't a box you check once — it's a relationship you're supposed to keep renewing every time what the device does actually changes."

Debrief Screen Requirements

After the ending reveal, show a replay of all 5 rooms with a small icon indicating which choice was made in each, visually highlight the specific room that determined the ending, display the debrief text above, include a short reflection textarea ("What surprised you about this ending?"), and a button labeled to open a pre/post awareness survey in a new tab (use https://forms.google.com/placeholder as the link — the team will replace it).

Data Trail Visualizer (secondary, accessible anytime via a nav link, does not affect scoring)

A separate view — can reuse the same house art — where clicking any of the 5 devices (independent of the game state) shows what that device type typically collects, who it's typically shared with, and one real-world-grounded concern:

Smart Speaker: Collects voice recordings, wake-word activations, query history, sometimes ambient audio. Shared with cloud processing servers, sometimes third-party app developers. Concern: always-on smart speakers have repeatedly been found to record and transmit audio outside intended activations due to false triggers.

Video Doorbell: Collects video, audio, motion-triggered clips, sometimes facial recognition data. Shared with cloud storage, sometimes law enforcement partnerships. Concern: doorbell footage-sharing programs with police have raised questions about how much footage is requested and whether users understand their device is part of such a network.

Smart Thermostat: Collects temperature preferences and occupancy patterns. Shared with energy utility partners, sometimes analytics/advertising partners. Concern: occupancy data reveals detailed household routines with commercial value well beyond the thermostat's core function.

Smart TV: Collects viewing history, voice commands, sometimes on-screen content via automatic content recognition. Shared with advertising networks and analytics firms. Concern: automatic content recognition tracks what's on screen — including from external devices plugged into the TV — often without users realizing the feature exists.

What Success Looks Like

A player can open the app, wander a warm little house, drag five devices into place, feel a small real-time reward (users ticking up, rooms glowing) for every choice, reach one of four distinct endings with a real-world story attached, and read a debrief that connects their specific choices to a specific ethical principle — all without ever seeing the words "quiz," "survey," "Option A," or "correct answer" anywhere in the experience.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://trust-trail-game.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/85089ca0-dd62-404b-b9d6-07c4aa3a6d7d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
