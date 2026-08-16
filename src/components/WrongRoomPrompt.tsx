import { useState } from "react";

interface Props {
  deviceName: string;
  roomName: string;
  onDone: (note: string) => void;
}

export function WrongRoomPrompt({ deviceName, roomName, onDone }: Props) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4">
      <div className="animate-pop w-full max-w-sm rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-sm leading-relaxed">
          Interesting — you tried to put the {deviceName} in the {roomName}. What made you think of
          that connection?
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Optional — a sentence is plenty."
          className="mt-3 w-full resize-y rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onDone(note.trim())}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Save note
          </button>
          <button
            onClick={() => onDone("")}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
