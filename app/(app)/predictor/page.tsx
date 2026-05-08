"use client";
import { useState, useEffect } from "react";
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

type SavedPred = {
  home: string | null;
  away: string | null;
  winner: PredictionResult;
};
type Draft = { home: string; away: string; winner: PredictionResult | null };

const PRED_KEY = "atlas-preds";
function loadPreds(): Record<number, SavedPred> {
  try { const s = localStorage.getItem(PRED_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
}
function persistPreds(p: Record<number, SavedPred>) {
  try { localStorage.setItem(PRED_KEY, JSON.stringify(p)); } catch { /* noop */ }
}

function deriveWinner(h: string, a: string): PredictionResult | null {
  const hv = parseInt(h), av = parseInt(a);
  if (isNaN(hv) || isNaN(av) || h === "" || a === "") return null;
  if (hv > av) return "home";
  if (av > hv) return "away";
  return "draw";
}

const DEMO_RANKING = [
  { pos: 1, name: "Rodri", avatar: { emoji: "🦁", bg: "#F97316" }, pts: 0 },
  { pos: 2, name: "Caro",  avatar: { emoji: "🌟", bg: "#3B82F6" }, pts: 0 },
  { pos: 4, name: "Javi",  avatar: { emoji: "⚡", bg: "#EF4444" }, pts: 0 },
];

export default function PredictorPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("pending");
  const [saved, setSaved] = useState<Record<number, SavedPred>>({});
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});

  useEffect(() => {
    setSaved(loadPreds());
  }, []);

  const predicted = Object.keys(saved).length;

  const updateScore = (matchId: number, side: "home" | "away", raw: string) => {
    const val = raw.replace(/\D/g, "").slice(0, 2);
    setDrafts((prev) => {
      const d = prev[matchId] ?? { home: "", away: "", winner: null };
      const next = { ...d, [side]: val };
      next.winner = deriveWinner(
        side === "home" ? val : d.home,
        side === "away" ? val : d.away,
      ) ?? next.winner;
      return { ...prev, [matchId]: next };
    });
  };

  const toggleWinner = (matchId: number, w: PredictionResult) => {
    if (saved[matchId]) return;
    setDrafts((prev) => {
      const d = prev[matchId] ?? { home: "", away: "", winner: null };
      return { ...prev, [matchId]: { ...d, winner: d.winner === w ? null : w } };
    });
  };

  const savePrediction = (matchId: number) => {
    const d = drafts[matchId];
    if (!d?.winner) return;
    const entry: SavedPred = { home: d.home || null, away: d.away || null, winner: d.winner };
    const next = { ...saved, [matchId]: entry };
    setSaved(next);
    persistPreds(next);
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
              borderBottom: "none",
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
              const lock = saved[m.id];
              const d = drafts[m.id] ?? { home: "", away: "", winner: null };
              const canSave = !lock && !!d.winner;
              const winnerLabel =
                lock?.winner === "home" ? m.home.name
                : lock?.winner === "away" ? m.away.name
                : "Empate";

              return (
                <div
                  key={m.id}
                  className="rounded-[18px] p-4"
                  style={{
                    background: lock ? "rgba(255,255,255,0.03)" : "#0F1228",
                    border: `1px solid ${lock ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <div
                    className="text-[10px] font-bold tracking-widest text-atlas-primary mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {DAY_LABEL[m.date]}
                  </div>

                  {/* Teams + Score */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Home */}
                    <button
                      disabled={!!lock}
                      onClick={() => toggleWinner(m.id, "home")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background:
                          (lock ? lock.winner : d.winner) === "home"
                            ? "rgba(249,115,22,0.15)"
                            : "rgba(255,255,255,0.04)",
                        border: `2px solid ${
                          (lock ? lock.winner : d.winner) === "home"
                            ? "#F97316"
                            : "rgba(255,255,255,0.08)"
                        }`,
                        opacity: lock ? 0.7 : 1,
                        cursor: lock ? "default" : "pointer",
                      }}
                    >
                      <TeamFlag code={m.home.code} size="sm" shape="rounded" />
                      <span className="text-[12px] font-semibold text-atlas-text text-center leading-tight">
                        {m.home.name}
                      </span>
                    </button>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number" min="0" max="20"
                          placeholder="–"
                          disabled={!!lock}
                          value={lock ? (lock.home ?? "") : d.home}
                          onChange={(e) => updateScore(m.id, "home", e.target.value)}
                          className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                          style={{
                            background: lock ? "rgba(255,255,255,0.05)" : "#181B30",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: lock ? "#EDF0FF" : undefined,
                            cursor: lock ? "default" : undefined,
                          }}
                        />
                        <span className="text-atlas-dimmed text-[18px] font-bold">:</span>
                        <input
                          type="number" min="0" max="20"
                          placeholder="–"
                          disabled={!!lock}
                          value={lock ? (lock.away ?? "") : d.away}
                          onChange={(e) => updateScore(m.id, "away", e.target.value)}
                          className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                          style={{
                            background: lock ? "rgba(255,255,255,0.05)" : "#181B30",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: lock ? "#EDF0FF" : undefined,
                            cursor: lock ? "default" : undefined,
                          }}
                        />
                      </div>
                      {/* Draw toggle (only when not locked) */}
                      {!lock && (
                        <button
                          onClick={() => toggleWinner(m.id, "draw")}
                          className="px-3 py-0.5 rounded-full text-[11px] font-semibold transition-all"
                          style={{
                            background: d.winner === "draw" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${d.winner === "draw" ? "rgba(249,115,22,0.5)" : "rgba(255,255,255,0.1)"}`,
                            color: d.winner === "draw" ? "#F97316" : "#4A5178",
                          }}
                        >
                          Empate
                        </button>
                      )}
                    </div>

                    {/* Away */}
                    <button
                      disabled={!!lock}
                      onClick={() => toggleWinner(m.id, "away")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background:
                          (lock ? lock.winner : d.winner) === "away"
                            ? "rgba(249,115,22,0.15)"
                            : "rgba(255,255,255,0.04)",
                        border: `2px solid ${
                          (lock ? lock.winner : d.winner) === "away"
                            ? "#F97316"
                            : "rgba(255,255,255,0.08)"
                        }`,
                        opacity: lock ? 0.7 : 1,
                        cursor: lock ? "default" : "pointer",
                      }}
                    >
                      <TeamFlag code={m.away.code} size="sm" shape="rounded" />
                      <span className="text-[12px] font-semibold text-atlas-text text-center leading-tight">
                        {m.away.name}
                      </span>
                    </button>
                  </div>

                  {/* Bottom action */}
                  {lock ? (
                    <div
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl"
                      style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                      <span className="text-[13px]">🔒</span>
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: "#22C55E", fontFamily: "var(--font-sans)" }}
                      >
                        {winnerLabel} · 3 pts si aciertas
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => savePrediction(m.id)}
                      disabled={!canSave}
                      className="w-full py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all"
                      style={{
                        background: canSave ? "#F97316" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${canSave ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                        color: canSave ? "#fff" : "#4A5178",
                        fontFamily: "var(--font-display)",
                        opacity: canSave ? 1 : 0.6,
                      }}
                    >
                      Guardar Marcador
                    </button>
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
                  <div
                    className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[18px]"
                    style={{ background: r.avatar.bg }}
                  >
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
