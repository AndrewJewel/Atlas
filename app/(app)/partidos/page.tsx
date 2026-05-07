"use client";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { useCountdown } from "@/hooks/use-countdown";
import { MATCHES, MATCH_DAYS, KICKOFF } from "@/lib/data";

export default function PartidosPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [notified, setNotified] = useState<Record<number, boolean>>({});
  const countdown = useCountdown(KICKOFF);
  const matches = MATCHES.filter((m) => m.date === MATCH_DAYS[activeDay].date);

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
          FALTAN PARA EL MUNDIAL
        </p>
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
        {matches.map((m) => (
          <div
            key={m.id}
            className="mx-4 mb-2 rounded-2xl overflow-hidden cursor-pointer"
            style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex justify-between items-center px-4 pt-3">
              <span
                className="text-[13px] font-bold text-atlas-text tracking-wide"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {m.group === "R32" ? "Octavos de final"
                  : m.group === "QF" ? "Cuartos de final"
                  : m.group === "SF" ? "Semifinal"
                  : m.group === "3P" ? "3er y 4to puesto"
                  : m.group === "FINAL" ? "🏆 Final"
                  : `Grupo ${m.group}`} · Partido {m.num}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-atlas-primary">
                  {MATCH_DAYS[activeDay].label}
                </span>
                <button
                  onClick={(e) => toggleNotify(m.id, e)}
                  className="text-[14px]"
                  style={{ color: notified[m.id] ? "#F97316" : "#4A5178" }}
                >
                  {notified[m.id] ? "🔔" : "🔕"}
                </button>
              </div>
            </div>
            <div className="px-4 pb-3.5 pt-2">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-[22px]">{m.home.flag}</span>
                <span className="text-[15px] font-medium text-atlas-text">{m.home.name}</span>
              </div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="text-[22px]">{m.away.flag}</span>
                <span className="text-[15px] font-medium text-atlas-text">{m.away.name}</span>
              </div>
              <div className="flex flex-col gap-0.5 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[15px] font-bold text-atlas-text" style={{ fontFamily: "var(--font-display)" }}>
                  {m.time} p.m.
                </span>
                <span className="text-[12px] text-atlas-dimmed">{m.venue}</span>
                <span className="text-[12px] text-atlas-dimmed">{m.city}</span>
                <span className="text-[13px] font-semibold text-atlas-primary mt-0.5">Ver detalles</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
