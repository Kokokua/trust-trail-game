import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DEVICE_PROFILES } from "@/game/content";

export const Route = createFileRoute("/data-trail")({
  head: () => ({
    meta: [
      { title: "Data Trail — What Your Smart Home Sends Home" },
      {
        name: "description",
        content:
          "Explore what common smart home devices collect, who they share it with, and the real-world concerns behind each one.",
      },
      { property: "og:title", content: "Data Trail — What Your Smart Home Sends Home" },
      {
        property: "og:description",
        content:
          "Explore what common smart home devices collect, who they share it with, and the real-world concerns behind each one.",
      },
    ],
  }),
  component: DataTrail,
});

function DataTrail() {
  const [active, setActive] = useState(DEVICE_PROFILES[0]!.id);
  const device = DEVICE_PROFILES.find((d) => d.id === active)!;

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-xs text-muted-foreground hover:underline">
          ← Back to the house
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Data Trail</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Pick a device to see what it typically collects, where that data goes, and what people
          have run into in the real world.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {DEVICE_PROFILES.map((d) => {
            const Icon = d.icon;
            const on = d.id === active;
            return (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-sm font-medium transition-all ${
                  on
                    ? "border-primary bg-primary/10 shadow-[var(--shadow-soft)]"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {d.name}
              </button>
            );
          })}
        </div>

        <article
          key={device.id}
          className="animate-pop mt-6 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="text-xl font-semibold">{device.name}</h2>
          <Row label="Typically collects" body={device.collects} />
          <Row label="Typically shared with" body={device.sharedWith} />
          <div className="rounded-2xl bg-risk-soft/50 p-4">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Where it gets complicated
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{device.concern}</p>
          </div>
        </article>
      </div>
    </main>
  );
}

function Row({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
