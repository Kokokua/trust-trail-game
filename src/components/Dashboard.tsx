import { Link } from "@tanstack/react-router";
import { Shield, AlertTriangle, Users, Cpu } from "lucide-react";

interface Props {
  trust: number;
  risk: number;
  users: number;
  configuredCount?: number;
  hasActiveSession?: boolean;
  onGoToTitle?: () => void;
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

export function Dashboard({
  trust,
  risk,
  users,
  configuredCount,
  hasActiveSession,
  onGoToTitle,
}: Props) {
  const handleTitleClick = () => {
    if (!onGoToTitle) return;
    if (hasActiveSession) {
      if (window.confirm("Return to Title Screen? Current in-progress house settings will be reset.")) {
        onGoToTitle();
      }
    } else {
      onGoToTitle();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <div className="mr-auto">
          {onGoToTitle ? (
            <button
              onClick={handleTitleClick}
              className="text-left group transition-opacity hover:opacity-85"
              title="Return to Title Screen"
            >
              <p className="text-sm font-semibold group-hover:text-primary transition-colors">TrustTrail</p>
              <p className="text-[11px] text-muted-foreground">Smart home startup · day one</p>
            </button>
          ) : (
            <div>
              <p className="text-sm font-semibold">TrustTrail</p>
              <p className="text-[11px] text-muted-foreground">Smart home startup · day one</p>
            </div>
          )}
        </div>

        {typeof configuredCount === "number" && (
          <div className="flex items-center gap-2 rounded-2xl bg-secondary/80 px-3 py-1.5 border border-border/60">
            <Cpu className="h-4 w-4 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Setup Progress
              </p>
              <p className="text-xs font-bold text-foreground tabular-nums">
                {configuredCount} / 5 <span className="font-normal text-muted-foreground">Devices</span>
              </p>
            </div>
            <div className="flex gap-1 ml-1.5">
              {[1, 2, 3, 4, 5].map((idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    idx <= configuredCount
                      ? "bg-primary scale-110 shadow-xs"
                      : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

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
        <div className="flex items-center gap-2">
          {onGoToTitle && (
            <button
              onClick={handleTitleClick}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Title Menu
            </button>
          )}
          <Link
            to="/data-trail"
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            Data Trail
          </Link>
          <Link
            to="/results"
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            Results
          </Link>
        </div>
      </div>
    </header>
  );
}
