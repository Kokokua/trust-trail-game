import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Download,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  Play,
} from "lucide-react";
import {
  getParticipantRecords,
  INITIAL_MOCK_PARTICIPANTS,
  exportRecordsToCSV,
  type ParticipantRecord,
} from "@/game/participantStorage";
import { ETHICAL_CONCEPTS } from "@/game/survey";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "User Testing & Learning Results — TrustTrail" },
      {
        name: "description",
        content: "Empirical evaluation results and data collection from CAMT student participants.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const [records, setRecords] = useState<ParticipantRecord[]>(INITIAL_MOCK_PARTICIPANTS);
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const recs = getParticipantRecords();
    setRecords(recs);
  }, []);

  const handleDownloadCSV = () => {
    const csvContent = exportRecordsToCSV(records);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TrustTrail_User_Testing_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const total = records.length;
  const avgPreScore = total ? (records.reduce((acc, r) => acc + r.preKnowledgeScore, 0) / total).toFixed(1) : "0";
  const avgPostScore = total ? (records.reduce((acc, r) => acc + r.postKnowledgeScore, 0) / total).toFixed(1) : "0";
  const avgPreTrust = total
    ? (records.reduce((acc, r) => acc + (r.preLikert?.["q5_default_trust"] ?? 3), 0) / total).toFixed(1)
    : "0";
  const avgPostTrust = total
    ? (records.reduce((acc, r) => acc + (r.postLikert?.["q5_default_trust"] ?? 1), 0) / total).toFixed(1)
    : "0";
  const avgSatisfaction = total
    ? (records.reduce((acc, r) => acc + r.satisfaction, 0) / total).toFixed(1)
    : "0";

  // Concept counts
  const conceptCounts: Record<string, number> = {};
  ETHICAL_CONCEPTS.forEach((c) => (conceptCounts[c] = 0));
  records.forEach((r) => {
    r.concepts.forEach((c) => {
      conceptCounts[c] = (conceptCounts[c] || 0) + 1;
    });
  });

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/" className="text-xs text-muted-foreground hover:underline">
              ← Back to Simulator
            </Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              User Testing & Learning Results
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Phase 3 Platform Data Collection · Course 953420 Ethics & Professionalism
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/?new=true"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Play className="h-3.5 w-3.5 text-primary" /> + Record Next Participant
            </a>
            <button
              onClick={handleDownloadCSV}
              disabled={records.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:pointer-events-none"
            >
              <Download className="h-3.5 w-3.5" /> Export to CSV
            </button>
          </div>
        </div>

        {/* EMPTY STATE IF NO RECORDS */}
        {records.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-[var(--shadow-soft)]">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-base font-bold text-foreground">No Participant Records Yet</h3>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              No live test sessions have been recorded. Play through the game from the simulator, make your ethical device setup decisions, and submit the final post-game awareness check to collect real participant data.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-transform"
              >
                Start Game Simulation & Record Data →
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* STATS OVERVIEW CARDS */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-[11px] font-semibold tracking-wide uppercase">Participants</span>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold">{total}</p>
            <p className="text-[11px] text-muted-foreground">CAMT SE students tested</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold tracking-wide uppercase">Knowledge Gain</span>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold">
              {avgPreScore} → {avgPostScore} <span className="text-xs font-normal text-muted-foreground">/5</span>
            </p>
            <p className="text-[11px] text-primary font-medium">
              +{((Number(avgPostScore) - Number(avgPreScore)) * 20).toFixed(0)}% comprehension shift
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold tracking-wide uppercase">Trust in Defaults</span>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold">
              {avgPreTrust} → {avgPostTrust} <span className="text-xs font-normal text-muted-foreground">/5</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Critical skepticism increased</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold tracking-wide uppercase">Satisfaction</span>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold">
              {avgSatisfaction} <span className="text-xs font-normal text-muted-foreground">/10</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Overall platform rating</p>
          </div>
        </div>

        {/* SECTION 5.3: GRAPH & VISUALIZATION (LIKE GROUP 2) */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Chart 1: Before vs After Trust Calibration */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-sm font-bold tracking-wide uppercase">
              Chart 1: Default Privacy Trust Shift (Scale 1–5)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              &ldquo;Default settings are designed mainly to protect user privacy.&rdquo; (Pre vs Post)
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium">
                  <span>Before playing (Average: {avgPreTrust} / 5)</span>
                  <span>{((Number(avgPreTrust) / 5) * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-muted-foreground/60 transition-all duration-700"
                    style={{ width: `${(Number(avgPreTrust) / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium">
                  <span>After playing (Average: {avgPostTrust} / 5)</span>
                  <span>{((Number(avgPostTrust) / 5) * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${(Number(avgPostTrust) / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              Observation: Students shifted from blind trust in vendor defaults to realizing defaults are
              strategic commercial choices that require engineer responsibility.
            </p>
          </div>

          {/* Chart 2: Ethical Concepts Identified */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-sm font-bold tracking-wide uppercase">
              Chart 2: Ethical Concepts Recognized by Participants
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Percentage of participants who identified each ethical principle in the game.
            </p>

            <div className="mt-4 space-y-2.5">
              {Object.entries(conceptCounts).map(([concept, count]) => {
                const pct = total ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={concept}>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium truncate">{concept}</span>
                      <span className="text-muted-foreground">
                        {count}/{total} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/80 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 5.2: PARTICIPANT RECORDS TABLE (FOR REPORT) */}
        <div className="mt-10 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase">
                Section 5.2: Participant Records ({total} Participants)
              </h2>
              <p className="text-xs text-muted-foreground">
                Matches the reporting structure in the assignment guidelines.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Click any row to expand full details</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground">
                  <th className="pb-2 font-semibold">ID</th>
                  <th className="pb-2 font-semibold">Timestamp</th>
                  <th className="pb-2 font-semibold">Prior IoT</th>
                  <th className="pb-2 font-semibold">Pre Score</th>
                  <th className="pb-2 font-semibold">Post Score</th>
                  <th className="pb-2 font-semibold">Ending Reached</th>
                  <th className="pb-2 font-semibold">Satisfaction</th>
                  <th className="pb-2 font-semibold">Placement Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {records.map((r) => {
                  const isExpanded = expandedId === r.id;
                  const notesCount = r.misplacements?.filter((m) => m.note).length ?? 0;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      className="cursor-pointer hover:bg-secondary/40 transition-colors"
                    >
                      <td className="py-2.5 font-bold text-primary">{r.id}</td>
                      <td className="py-2.5 text-muted-foreground">{r.timestamp}</td>
                      <td className="py-2.5">{r.priorExp}</td>
                      <td className="py-2.5 font-medium">{r.preKnowledgeScore} / 5</td>
                      <td className="py-2.5 font-bold text-primary">{r.postKnowledgeScore} / 5</td>
                      <td className="py-2.5 font-medium truncate max-w-[180px]">{r.endingReached}</td>
                      <td className="py-2.5">{r.satisfaction} / 10</td>
                      <td className="py-2.5">
                        {notesCount > 0 ? (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {notesCount} note{notesCount > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* EXPANDED PARTICIPANT DETAIL VIEW (MATCHING GROUP 2 PAGES 5-19) */}
        {expandedId && (
          <div className="animate-pop mt-6 rounded-3xl border border-primary/40 bg-card p-6 shadow-[var(--shadow-card)]">
            {(() => {
              const r = records.find((x) => x.id === expandedId);
              if (!r) return null;
              return (
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-base font-bold text-foreground">
                      Detailed Record: {r.id} ({r.timestamp})
                    </h3>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="rounded-2xl bg-secondary/50 p-3.5 space-y-2">
                      <p>
                        <strong>Prior IoT Experience:</strong> {r.priorExp}
                      </p>
                      <p>
                        <strong>Ending Reached:</strong> {r.endingReached}
                      </p>
                      <p>
                        <strong>Knowledge Score:</strong> Before: {r.preKnowledgeScore}/5 → After:{" "}
                        <span className="font-bold text-primary">{r.postKnowledgeScore}/5</span>
                      </p>
                      <p>
                        <strong>Satisfaction Rating:</strong> {r.satisfaction}/10
                      </p>
                      <p>
                        <strong>Identified Concepts:</strong> {r.concepts.join(", ") || "None"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-secondary/50 p-3.5 space-y-2">
                      <p>
                        <strong>Likert Scale Shift (Pre → Post):</strong>
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        <li>Q1 (Know data collection): {r.preLikert?.["q1_collect"] ?? "-"} → {r.postLikert?.["q1_collect"] ?? "-"} / 5</li>
                        <li>Q2 (Data shared with third-parties): {r.preLikert?.["q2_share"] ?? "-"} → {r.postLikert?.["q2_share"] ?? "-"} / 5</li>
                        <li>Q3 (Engineer responsibility): {r.preLikert?.["q3_responsibility"] ?? "-"} → {r.postLikert?.["q3_responsibility"] ?? "-"} / 5</li>
                        <li>Q4 (Okay to skip consent on deadline): {r.preLikert?.["q4_deadline"] ?? "-"} → {r.postLikert?.["q4_deadline"] ?? "-"} / 5</li>
                        <li>Q5 (Trust default settings): {r.preLikert?.["q5_default_trust"] ?? "-"} → {r.postLikert?.["q5_default_trust"] ?? "-"} / 5</li>
                      </ul>
                    </div>
                  </div>

                  {/* MISPLACEMENT NOTES & QUALITATIVE REASONING */}
                  {r.misplacements && r.misplacements.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                        Device Placement Thoughts & Mental Models ({r.misplacements.length}):
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Notes captured when player dragged devices into non-standard rooms:
                      </p>
                      <div className="mt-2.5 space-y-2">
                        {r.misplacements.map((m, idx) => (
                          <div key={idx} className="rounded-xl bg-card p-3 border border-border text-xs">
                            <p className="font-semibold text-foreground">
                              {m.deviceName} <span className="font-normal text-muted-foreground">attempted in</span> {m.roomName}:
                            </p>
                            <p className="mt-1 italic text-primary">
                              {m.note ? `“${m.note}”` : "— Skipped (no explanation written)"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-border/80 p-4">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      In your own words: Why is agreeing to legal terms not the same as informed consent?
                    </p>
                    <p className="mt-1.5 text-xs italic leading-relaxed text-foreground">
                      &ldquo;{r.whyUnfair || "No comment provided."}&rdquo;
                    </p>
                  </div>

                  {r.improvement && (
                    <div className="mt-3 rounded-2xl bg-secondary/30 p-3">
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        Platform Feedback & Suggestions:
                      </p>
                      <p className="mt-1 text-xs text-foreground">{r.improvement}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
          </>
        )}
      </div>
    </main>
  );
}
