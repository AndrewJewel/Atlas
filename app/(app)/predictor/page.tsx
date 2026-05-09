"use client";
import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/app-header";
import { MATCHES } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";
import { useUser } from "@/hooks/use-user";
import {
  savePrediction,
  loadUserPredictions,
  getGlobalRanking,
  getGroupRanking,
  getUserGroups,
  isMatchLocked,
  type SavedPrediction,
  type RankingEntry,
  type UserGroup,
  type PredWinner,
} from "@/lib/predictions";

const DAY_LABEL: Record<string, string> = {
  "2026-06-11": "JUE 11 JUN", "2026-06-12": "VIE 12 JUN",
  "2026-06-13": "SÁB 13 JUN", "2026-06-14": "DOM 14 JUN",
};

const TABS = [
  { key: "pending",  label: "Pendientes" },
  { key: "done",     label: "Finalizados" },
  { key: "ranking",  label: "Ranking" },
] as const;
type Tab = typeof TABS[number]["key"];

type Draft = { home: string; away: string; winner: PredWinner | null };

function deriveWinner(h: string, a: string): PredWinner | null {
  const hv = parseInt(h), av = parseInt(a);
  if (isNaN(hv) || isNaN(av) || h === "" || a === "") return null;
  if (hv > av) return "home";
  if (av > hv) return "away";
  return "draw";
}

function levelFromPoints(pts: number): string {
  if (pts >= 60) return "Leyenda";
  if (pts >= 30) return "Experto";
  if (pts >= 10) return "Hincha";
  return "Aficionado";
}


export default function PredictorPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("pending");
  const [preds, setPreds] = useState<SavedPrediction[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>("global");
  const [loadingRank, setLoadingRank] = useState(false);

  const load = useCallback(async () => {
    const data = await loadUserPredictions();
    setPreds(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tab !== "ranking") return;
    setLoadingRank(true);
    const fetch = async () => {
      const [g, grps] = await Promise.all([
        activeGroup === "global" ? getGlobalRanking() : getGroupRanking(activeGroup),
        getUserGroups(),
      ]);
      setRanking(g);
      setGroups(grps);
      setLoadingRank(false);
    };
    fetch();
  }, [tab, activeGroup]);

  const predMap = new Map(preds.map((p) => [p.match_id, p]));
  const totalPoints = preds.reduce((s, p) => s + (p.points_earned ?? 0), 0);
  const predicted = preds.length;
  const level = levelFromPoints(totalPoints);

  // Pending = not locked by time AND no saved prediction yet
  // Done = match locked AND prediction exists
  const pendingMatches = MATCHES.filter((m) => !isMatchLocked(m) && !predMap.has(m.id));
  const doneMatches = MATCHES.filter((m) => predMap.has(m.id));

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

  const toggleWinner = (matchId: number, w: PredWinner) => {
    if (predMap.has(matchId)) return;
    setDrafts((prev) => {
      const d = prev[matchId] ?? { home: "", away: "", winner: null };
      return { ...prev, [matchId]: { ...d, winner: d.winner === w ? null : w } };
    });
  };

  const handleSave = async (matchId: number) => {
    const d = drafts[matchId];
    if (!d?.winner || saving !== null) return;
    setSaving(matchId);
    const hs = d.home !== "" ? parseInt(d.home) : null;
    const as_ = d.away !== "" ? parseInt(d.away) : null;
    const { error } = await savePrediction(matchId, hs, as_, d.winner);
    if (!error) await load();
    setSaving(null);
  };

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title="Quiniela / Prode" />

      {/* Stats Bar */}
      <div
        className="flex items-center justify-around px-5 py-3.5 flex-shrink-0"
        style={{ background: "#0F1228", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {[
          { val: level,              key: "NIVEL",       color: "#EDF0FF" },
          null,
          { val: `${predicted} ⚡`,  key: "PREDICHAS",   color: "#22C55E" },
          null,
          { val: `${totalPoints}`,   key: "MIS PUNTOS",  color: "#F97316" },
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
              borderBottom: "2px solid",
              borderBottomColor: tab === key ? "#F97316" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── PENDIENTES ── */}
        {tab === "pending" && (
          <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
            {pendingMatches.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
                <span className="text-[48px]">✅</span>
                <span className="text-[14px] text-atlas-muted text-center">
                  ¡Completaste todas las predicciones disponibles!
                </span>
              </div>
            )}
            {pendingMatches.map((m) => {
              const d = drafts[m.id] ?? { home: "", away: "", winner: null };
              const canSave = !!d.winner && saving !== m.id;
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
                    {DAY_LABEL[m.date] ?? m.date}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Home */}
                    <button
                      onClick={() => toggleWinner(m.id, "home")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background: d.winner === "home" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                        border: `2px solid ${d.winner === "home" ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <TeamFlag code={m.home.code} size="sm" shape="rounded" />
                      <span className="text-[12px] font-semibold text-atlas-text text-center leading-tight">
                        {m.home.name}
                      </span>
                    </button>

                    {/* Score inputs */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number" min="0" max="20" placeholder="–"
                          value={d.home}
                          onChange={(e) => updateScore(m.id, "home", e.target.value)}
                          className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                          style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                        <span className="text-atlas-dimmed text-[18px] font-bold">:</span>
                        <input
                          type="number" min="0" max="20" placeholder="–"
                          value={d.away}
                          onChange={(e) => updateScore(m.id, "away", e.target.value)}
                          className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                          style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                      </div>
                    </div>

                    {/* Away */}
                    <button
                      onClick={() => toggleWinner(m.id, "away")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background: d.winner === "away" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                        border: `2px solid ${d.winner === "away" ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <TeamFlag code={m.away.code} size="sm" shape="rounded" />
                      <span className="text-[12px] font-semibold text-atlas-text text-center leading-tight">
                        {m.away.name}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSave(m.id)}
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
                    {saving === m.id ? "Guardando…" : "Guardar Marcador"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── FINALIZADOS ── */}
        {tab === "done" && (
          <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
            {doneMatches.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
                <span className="text-[48px]">⏳</span>
                <span className="text-[14px] text-atlas-muted text-center">
                  Aún no has guardado predicciones.
                </span>
              </div>
            )}
            {doneMatches.map((m) => {
              const p = predMap.get(m.id)!;
              const winnerName =
                p.predicted_winner === "home" ? m.home.name :
                p.predicted_winner === "away" ? m.away.name : "Empate";
              const pts = p.points_earned;
              const scoreStr =
                p.home_score !== null && p.away_score !== null
                  ? `${p.home_score}–${p.away_score}`
                  : null;
              return (
                <div
                  key={m.id}
                  className="rounded-[18px] p-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-bold tracking-widest text-atlas-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {DAY_LABEL[m.date] ?? m.date}
                    </span>
                    {pts !== null && (
                      <span
                        className="text-[12px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: pts === 3 ? "rgba(34,197,94,0.15)" : pts === 1 ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)",
                          color: pts === 3 ? "#22C55E" : pts === 1 ? "#F97316" : "#4A5178",
                        }}
                      >
                        {pts === 3 ? "🎯 +3 pts" : pts === 1 ? "✅ +1 pt" : "❌ 0 pts"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <TeamFlag code={m.home.code} size="xs" shape="rounded" />
                    <span className="flex-1 text-[14px] text-atlas-text">{m.home.name}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <TeamFlag code={m.away.code} size="xs" shape="rounded" />
                    <span className="flex-1 text-[14px] text-atlas-text">{m.away.name}</span>
                  </div>
                  <div
                    className="flex items-center justify-center gap-2 py-2 rounded-xl"
                    style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}
                  >
                    <span className="text-[13px]">🔒</span>
                    <span className="text-[12px] font-semibold" style={{ color: "#22C55E" }}>
                      {winnerName}{scoreStr ? ` · ${scoreStr}` : ""}
                      {pts === null ? " · Esperando resultado" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── RANKING ── */}
        {tab === "ranking" && (
          <div className="px-4 pt-3 pb-4">
            {/* Group selector */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {[{ id: "global", name: "Global" }, ...groups].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{
                    background: activeGroup === g.id ? "#F97316" : "#181B30",
                    border: `1px solid ${activeGroup === g.id ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                    color: activeGroup === g.id ? "#fff" : "#8892B0",
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {loadingRank ? (
              <div className="flex justify-center py-12">
                <span className="text-atlas-muted text-[14px]">Cargando…</span>
              </div>
            ) : ranking.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[200px]">
                <span className="text-[48px]">🏆</span>
                <span className="text-[14px] text-atlas-muted text-center">
                  Aún no hay predicciones en este ranking.
                </span>
              </div>
            ) : (
              <div className="rounded-[18px] overflow-hidden" style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)" }}>
                {ranking.map((r, i) => {
                  const pos = i + 1;
                  const isMe = r.user_id === user?.id;
                  return (
                    <div
                      key={r.user_id}
                      className="flex items-center gap-3 px-4 py-3.5"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        background: isMe ? "rgba(249,115,22,0.08)" : "transparent",
                      }}
                    >
                      <span className="w-7 text-center text-[16px] font-bold text-atlas-muted">
                        {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : pos}
                      </span>
                      <div
                        className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[20px]"
                        style={{ background: "#1A1F33" }}
                      >
                        {r.team_flag ?? "⭐"}
                      </div>
                      <span className="flex-1 text-[14px] font-semibold text-atlas-text">
                        {r.username}{isMe ? " (Tú)" : ""}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)" }} className="text-[18px] font-bold text-atlas-primary">
                        {r.total_points} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
