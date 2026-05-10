"use client";
import { MATCHES } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";
import type { Match } from "@/lib/types";

type StageKey = "R32" | "R16" | "QF" | "SF" | "3P" | "FINAL";

const STAGE_LABEL: Record<StageKey, string> = {
  R32:   "Ronda de 32",
  R16:   "Octavos de final",
  QF:    "Cuartos de final",
  SF:    "Semifinales",
  "3P":  "Tercer puesto",
  FINAL: "Final",
};

const STAGE_ORDER: StageKey[] = ["R32", "R16", "QF", "SF", "3P", "FINAL"];

function fmtDate(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("es", { day: "numeric", month: "short" });
}

function MatchCard({ m }: { m: Match }) {
  const homeTBD = m.home.code === "TBD";
  const awayTBD = m.away.code === "TBD";

  return (
    <div
      className="rounded-xl p-2.5"
      style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "#F97316" }}>
          #{m.num} · {fmtDate(m.date)} · {m.time}
        </div>
        <div className="text-[10px] text-atlas-dimmed truncate ml-2" style={{ maxWidth: 130 }}>
          {m.city}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Home */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          {homeTBD ? (
            <div
              className="rounded-sm flex-shrink-0"
              style={{ width: 32, height: 22, background: "var(--atlas-surface2)", border: "1px dashed var(--atlas-glass-md)" }}
            />
          ) : (
            <TeamFlag code={m.home.code} size="xs" shape="rounded" />
          )}
          <span
            className="text-[12px] font-medium truncate"
            style={{ color: homeTBD ? "#4A5178" : "var(--atlas-text)" }}
          >
            {homeTBD ? "Por definir" : m.home.name}
          </span>
        </div>

        <span className="text-[11px] font-bold text-atlas-dimmed flex-shrink-0">vs</span>

        {/* Away */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0 justify-end">
          <span
            className="text-[12px] font-medium truncate text-right"
            style={{ color: awayTBD ? "#4A5178" : "var(--atlas-text)" }}
          >
            {awayTBD ? "Por definir" : m.away.name}
          </span>
          {awayTBD ? (
            <div
              className="rounded-sm flex-shrink-0"
              style={{ width: 32, height: 22, background: "var(--atlas-surface2)", border: "1px dashed var(--atlas-glass-md)" }}
            />
          ) : (
            <TeamFlag code={m.away.code} size="xs" shape="rounded" />
          )}
        </div>
      </div>
    </div>
  );
}

export function Bracket() {
  const byStage = STAGE_ORDER.map(stage => ({
    stage,
    matches: MATCHES.filter(m => m.group === stage),
  }));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      {byStage.map(({ stage, matches }) => {
        if (matches.length === 0) return null;
        const allDefined = matches.every(m => m.home.code !== "TBD" && m.away.code !== "TBD");
        const firstDate = matches[0].date;
        const isPast = matches[matches.length - 1].date < today;
        const isLive = matches[0].date <= today && matches[matches.length - 1].date >= today;

        return (
          <div key={stage}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-[15px] font-bold text-atlas-text tracking-tight"
                >
                  {STAGE_LABEL[stage]}
                </span>
                {isLive && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "#22C55E", color: "#fff" }}
                  >
                    EN CURSO
                  </span>
                )}
                {isPast && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--atlas-surface2)", color: "#8892B0" }}
                  >
                    FINAL
                  </span>
                )}
              </div>
              <span className="text-[10px] text-atlas-dimmed">
                {allDefined ? `${matches.length} partidos` : `Desde ${fmtDate(firstDate)}`}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {matches.map(m => (
                <MatchCard key={m.id} m={m} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Bracket;
