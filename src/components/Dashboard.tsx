import { Link } from "@tanstack/react-router";
import { Shield, AlertTriangle, Users } from "lucide-react";

interface Props {
  trust: number;
  risk: number;
  users: number;
}

function Meter({
  label,
  value,
  max,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: typeof Shield;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="min-w-28 flex-1">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function Dashboard({ trust, risk, users }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <div className="mr-auto">
          <p className="text-sm font-semibold">TrustTrail</p>
          <p className="text-xs text-muted-foreground">Smart home startup, day one</p>
        </div>
        <Meter
          label="Trust"
          value={trust + 5}
          max={10}
          color="var(--trust)"
          icon={Shield}
        />
        <Meter label="Risk" value={risk} max={5} color="var(--risk)" icon={AlertTriangle} />
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <Users className="h-3.5 w-3.5" /> Users
          </div>
          <p className="text-lg font-semibold tabular-nums">{users.toLocaleString()}</p>
        </div>
        <Link
          to="/data-trail"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
        >
          Data Trail
        </Link>
      </div>
    </header>
  );
}
