"use client";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { useCountdown } from "@/hooks/use-countdown";
import { useLiveScores } from "@/hooks/use-live-scores";
import { MATCHES, MATCH_DAYS, KICKOFF } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";

// All WC 2026 matches are scheduled in EDT (UTC-4).
function toLocalKickoff(date: string, etTime: string): { time: string; dayShifted: boolean } {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = etTime.split(":").map(Number);
  const utc = new Date(Date.UTC(y, mo - 1, d, h + 4, mi));
  const time = utc.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const localDate = `${utc.getFullYear()}-${String(utc.getMonth() + 1).padStart(2, "0")}-${String(utc.getDate()).padStart(2, "0")}`;
  return { time, dayShifted: localDate !== date };
}

function groupLabel(group: string) {
  if (group === "R32")   return "Ronda de 32";
  if (group === "R16")   return "Octavos de final";
  if (group === "QF")    return "Cuartos de final";
  if (group === "SF")    return "Semifinal";
  if (group === "3P")    return "3er y 4to puesto";
  if (group === "FINAL") return "🏆 Final";
  return `Grupo ${group}`;
}

export default function PartidosPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [notified, setNotified] = useState<Record<number, boolean>>({});
  const countdown = useCountdown(KICKOFF);
  const { scores, hasLive } = useLiveScores();

  const dayMatches = MATCHES.filter((m) => m.date === MATCH_DAYS[activeDay].date);

  const toggleNotify = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotified((p) => ({ ...p, [id]: !p[id] }));
  };

  return (
    <div className="flex flex-col flex-1">
      <AppHeader />

      {/* Countdown Banner */}
      <div
        className="flex-shrink-0 px-5 py-4"
        style={{ background: "linear-gradient(135deg,#1A1F33 0%,#141826 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p
          className="text-center text-[11px] font-bold tracking-[0.18em] text-atlas-muted mb-2.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hasLive ? "⚽ PARTIDOS EN VIVO AHORA" : "FALTAN PARA EL MUNDIAL"}
        </p>
        {!hasLive ? (
          <div className="flex justify-center gap-5">
            {([
              [countdown.days, "DÍAS"],
              [countdown.hours, "HORAS"],
              [countdown.mins, "MIN"],
              [countdown.secs, "SEG"],
            ] as [number, string][]).map(([val, lbl], i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className="text-[40px] font-black leading-none tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: lbl === "SEG" ? "#F97316" : "#EDF0FF" }}
                >
                  {String(val).padStart(2, "0")}
                </span>
                <span
                  className="text-[10px] font-semibold tracking-widest text-atlas-dimmed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lbl}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[15px] font-bold text-atlas-text" style={{ fontFamily: "var(--font-display)" }}>
              Hay partidos en curso — bajá para verlos
            </span>
          </div>
        )}
      </div>

      {/* Day Picker */}
      <div className="flex gap-2 px-4 py-3.5 overflow-x-auto flex-shrink-0" style={{ background: "#090B19" }}>
        {MATCH_DAYS.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeDay === i ? "#F97316" : "#181B30",
              border: `1px solid ${activeDay === i ? "#F97316" : "rgba(255,255,255,0.08)"}`,
              color: activeDay === i ? "#fff" : "#8892B0",
              fontFamily: "var(--font-sans)",
            }}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div className="flex-1 overflow-y-auto pb-4">
        {dayMatches.map((m) => {
          const live = scores.get(`${m.home.code}-${m.away.code}`);
          const isLive     = live?.status === "live";
          const isFinished = live?.status === "finished";
          const hasScore   = isLive || isFinished;

          return (
            <div
              key={m.id}
              className="mx-4 mb-2 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: isLive ? "linear-gradient(135deg,#1A1228 0%,#0F1228 100%)" : "#0F1228",
                border: `1px solid ${isLive ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 pt-3">
                <span
                  className="text-[13px] font-bold text-atlas-text tracking-wide"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {groupLabel(m.group)} · Partido {m.num}
                </span>
                <div className="flex items-center gap-2">
                  {isLive && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-red-400">{live.minute}</span>
                    </div>
                  )}
                  {isFinished && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>
                      FIN
                    </span>
                  )}
                  <button
                    onClick={(e) => toggleNotify(m.id, e)}
                    className="text-[14px]"
                    style={{ color: notified[m.id] ? "#F97316" : "#4A5178" }}
                  >
                    {notified[m.id] ? "🔔" : "🔕"}
                  </button>
                </div>
              </div>

              {/* Teams + Score */}
              <div className="px-4 pb-3.5 pt-2">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <TeamFlag code={m.home.code} size="xs" shape="rounded" />
                  <span className="flex-1 text-[15px] font-medium text-atlas-text">{m.home.name}</span>
                  {hasScore && (
                    <span
                      className="text-[28px] font-black leading-none min-w-[24px] text-right"
                      style={{ fontFamily: "var(--font-display)", color: isLive ? "#F97316" : "#EDF0FF" }}
                    >
                      {live!.homeScore}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <TeamFlag code={m.away.code} size="xs" shape="rounded" />
                  <span className="flex-1 text-[15px] font-medium text-atlas-text">{m.away.name}</span>
                  {hasScore && (
                    <span
                      className="text-[28px] font-black leading-none min-w-[24px] text-right"
                      style={{ fontFamily: "var(--font-display)", color: isLive ? "#F97316" : "#EDF0FF" }}
                    >
                      {live!.awayScore}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-0.5 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {!hasScore && (() => {
                    const { time, dayShifted } = toLocalKickoff(m.date, m.time);
                    return (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[15px] font-bold text-atlas-text" style={{ fontFamily: "var(--font-display)" }}>
                          {time}
                        </span>
                        {dayShifted && (
                          <span className="text-[10px] font-bold" style={{ color: "#F97316" }}>+1</span>
                        )}
                        <span className="text-[11px] text-atlas-dimmed">hora local</span>
                      </div>
                    );
                  })()}
                  <span className="text-[12px] text-atlas-dimmed">{m.venue}</span>
                  <span className="text-[12px] text-atlas-dimmed">{m.city}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
