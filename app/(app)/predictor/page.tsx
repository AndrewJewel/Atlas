"use client";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { MATCHES } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";
import { useUser } from "@/hooks/use-user";
import type { PredictionResult } from "@/lib/types";

const DAY_LABEL: Record<string, string> = {
  "2026-06-11": "JUE 11 JUN",
  "2026-06-12": "VIE 12 JUN",
  "2026-06-13": "SÁB 13 JUN",
  "2026-06-14": "DOM 14 JUN",
};

const TABS = [
  { key: "pending",  label: "Pendientes" },
  { key: "done",     label: "Finalizados" },
  { key: "ranking",  label: "Ranking" },
  { key: "logros",   label: "Mis Logros" },
] as const;

type Tab = typeof TABS[number]["key"];

const DEMO_RANKING = [
  { pos: 1, name: "Rodri", avatar: { emoji: "🦁", bg: "#F97316" }, pts: 0 },
  { pos: 2, name: "Caro",  avatar: { emoji: "🌟", bg: "#3B82F6" }, pts: 0 },
  { pos: 4, name: "Javi",  avatar: { emoji: "⚡", bg: "#EF4444" }, pts: 0 },
];

export default function PredictorPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("pending");
  const [predictions, setPredictions] = useState<Record<number, PredictionResult>>({});
  const [scores, setScores] = useState<Record<number, { home?: string; away?: string }>>({});

  const predicted = Object.values(predictions).filter(Boolean).length;

  const predict = (matchId: number, winner: PredictionResult) => {
    setPredictions((p) => ({ ...p, [matchId]: p[matchId] === winner ? null : winner }));
  };

  const setScore = (matchId: number, side: "home" | "away", val: string) => {
    setScores((p) => ({ ...p, [matchId]: { ...(p[matchId] ?? {}), [side]: val } }));
  };

  const ranking = [
    ...DEMO_RANKING.slice(0, 2),
    { pos: 3, name: user?.username ?? "Tú", avatar: user?.avatar ?? { emoji: "⭐", bg: "#F97316" }, pts: 0, isMe: true },
    ...DEMO_RANKING.slice(2),
  ];

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title="Quiniela / Prode" />

      {/* Stats Bar */}
      <div
        className="flex items-center justify-around px-5 py-3.5 flex-shrink-0"
        style={{ background: "#0F1228", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {[
          { val: "Aficionado", key: "NIVEL", color: "#EDF0FF" },
          null,
          { val: `${predicted} ⚡`, key: "PREDICHAS", color: "#22C55E" },
          null,
          { val: "0", key: "MIS PUNTOS", color: "#F97316" },
        ].map((item, i) =>
          item === null ? (
            <div key={i} className="w-px h-8" style={{ background: "rgba(255,255,255,0.08)" }} />
          ) : (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span style={{ fontFamily: "var(--font-display)", color: item.color }} className="text-[18px] font-bold">
                {item.val}
              </span>
              <span className="text-[9px] font-bold tracking-widest text-atlas-dimmed">{item.key}</span>
            </div>
          )
        )}
      </div>

      {/* Tabs */}
      <div
        className="flex overflow-x-auto flex-shrink-0"
        style={{ background: "#0F1228", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-shrink-0 px-4 py-3 text-[12px] font-bold tracking-wide transition-all"
            style={{
              fontFamily: "var(--font-display)",
              color: tab === key ? "#F97316" : "#4A5178",
              borderBottom: tab === key ? "2px solid #F97316" : "2px solid transparent",
              background: "none",
              border: "none",
              borderBottomWidth: "2px",
              borderBottomStyle: "solid",
              borderBottomColor: tab === key ? "#F97316" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "pending" && (
          <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
            {MATCHES.map((m) => {
              const pred = predictions[m.id];
              const sc = scores[m.id] ?? {};
              return (
                <div
                  key={m.id}
                  className="rounded-[18px] p-4"
                  style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="text-[10px] font-bold tracking-widest text-atlas-primary mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {DAY_LABEL[m.date]}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {/* Home */}
                    <button
                      onClick={() => predict(m.id, "home")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background: pred === "home" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                        border: `2px solid ${pred === "home" ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <TeamFlag code={m.home.code} size="sm" shape="rounded" />
                      <span className="text-[12px] font-semibold text-atlas-text text-center leading-tight">{m.home.name}</span>
                    </button>

                    {/* Score */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number" min="0" max="20"
                        placeholder="-"
                        value={sc.home ?? ""}
                        onChange={(e) => setScore(m.id, "home", e.target.value)}
                        className="w-9 h-9 text-center text-atlas-text text-[16px] font-bold rounded-xl outline-none"
                        style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                      <span className="text-atlas-dimmed text-[18px] font-bold">:</span>
                      <input
                        type="number" min="0" max="20"
                        placeholder="-"
                        value={sc.away ?? ""}
                        onChange={(e) => setScore(m.id, "away", e.target.value)}
                        className="w-9 h-9 text-center text-atlas-text text-[16px] font-bold rounded-xl outline-none"
                        style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                    </div>

                    {/* Away */}
                    <button
                      onClick={() => predict(m.id, "away")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background: pred === "away" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                        border: `2px solid ${pred === "away" ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <TeamFlag code={m.away.code} size="sm" shape="rounded" />
                      <span className="text-[12px] font-semibold text-atlas-text text-center leading-tight">{m.away.name}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => predict(m.id, "draw")}
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                    style={{
                      background: pred === "draw" ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${pred === "draw" ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: pred === "draw" ? "#F97316" : "#8892B0",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Empate
                  </button>

                  {pred && (
                    <p className="text-[12px] text-atlas-success text-center font-semibold mt-2">
                      ✓ Predicción guardada · 3 pts si aciertas
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "ranking" && (
          <div className="px-4 pt-3 pb-4">
            <div className="rounded-[18px] overflow-hidden" style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)" }}>
              {ranking.map((r) => (
                <div
                  key={r.pos}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "isMe" in r && r.isMe ? "rgba(249,115,22,0.08)" : "transparent",
                  }}
                >
                  <span className="w-7 text-center text-[16px] font-bold text-atlas-muted">
                    {r.pos === 1 ? "🥇" : r.pos === 2 ? "🥈" : r.pos === 3 ? "🥉" : r.pos}
                  </span>
                  <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[18px]"
                    style={{ background: r.avatar.bg }}>
                    {r.avatar.emoji}
                  </div>
                  <span className="flex-1 text-[14px] font-semibold text-atlas-text">
                    {"isMe" in r && r.isMe ? `${r.name} (Tú)` : r.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-display)" }} className="text-[18px] font-bold text-atlas-primary">
                    {r.pts} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === "done" || tab === "logros") && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
            <span className="text-[48px]">⏳</span>
            <span className="text-[14px] text-atlas-muted text-center">
              {tab === "done"
                ? "El mundial no ha comenzado.\nTus predicciones aparecerán aquí."
                : "¡Completa predicciones para ganar logros!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
