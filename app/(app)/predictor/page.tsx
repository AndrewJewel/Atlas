"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { useLanguage } from "@/contexts/language-context";
import { MATCHES } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import {
  savePrediction,
  loadUserPredictions,
  getGlobalRanking,
  getGroupRanking,
  getUserGroups,
  getGroupMatchBets,
  saveGroupBet,
  getMatchLiveScore,
  calculatePoints,
  isMatchLocked,
  type SavedPrediction,
  type RankingEntry,
  type UserGroup,
  type PredWinner,
  type GroupMatchBetEntry,
  type GroupBet,
  type LiveScore,
} from "@/lib/predictions";

const LOCALE_MAP: Record<string, string> = { es: "es-AR", en: "en-US", pt: "pt-BR" };
const PINNED_KEY = "atlas_pinned_matches";

function loadPinned(): Record<string, number[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(PINNED_KEY) ?? "{}"); }
  catch { return {}; }
}

function savePinned(data: Record<string, number[]>) {
  localStorage.setItem(PINNED_KEY, JSON.stringify(data));
}

function formatMatchDay(date: string, locale: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}

const TAB_KEYS = ["torneo", "por_partido", "ranking"] as const;
type Tab = typeof TAB_KEYS[number];

type Draft = { home: string; away: string; winner: PredWinner | null };

function deriveWinner(h: string, a: string): PredWinner | null {
  const hv = parseInt(h), av = parseInt(a);
  if (isNaN(hv) || isNaN(av) || h === "" || a === "") return null;
  if (hv > av) return "home";
  if (av > hv) return "away";
  return "draw";
}

function effectiveBetPoints(bet: GroupBet | null, live: LiveScore | null): number {
  if (!bet) return -1;
  if (bet.points_earned !== null) return bet.points_earned;
  if (live?.status === "finished") {
    return calculatePoints(
      bet.predicted_winner,
      bet.home_score,
      bet.away_score,
      live.home_score,
      live.away_score
    );
  }
  return 0;
}

function statusBadge(live: LiveScore | null, locked: boolean) {
  if (!live || live.status === "scheduled") {
    return locked
      ? { label: "Cerrado", color: "#4A5178", bg: "rgba(74,81,120,0.15)" }
      : { label: "Abierto", color: "#22C55E", bg: "rgba(34,197,94,0.12)" };
  }
  if (live.status === "live") {
    return { label: `EN VIVO ${live.minute}`, color: "#EF4444", bg: "rgba(239,68,68,0.12)" };
  }
  return { label: "Terminado", color: "#F97316", bg: "rgba(249,115,22,0.12)" };
}

export default function PredictorPage() {
  const { user } = useUser();
  const { lang, t } = useLanguage();
  const locale = LOCALE_MAP[lang] ?? "es-AR";
  const [tab, setTab] = useState<Tab>("torneo");

  function levelFromPoints(pts: number): string {
    if (pts >= 60) return t("level_3");
    if (pts >= 30) return t("level_2");
    if (pts >= 10) return t("level_1");
    return t("level_0");
  }

  // ── Torneo ────────────────────────────────────────────
  const [preds, setPreds] = useState<SavedPrediction[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [saving, setSaving] = useState<number | null>(null);

  // ── Shared ────────────────────────────────────────────
  const [groups, setGroups] = useState<UserGroup[]>([]);

  // ── Ranking ───────────────────────────────────────────
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>("global");
  const [loadingRank, setLoadingRank] = useState(false);

  // ── Por partido ───────────────────────────────────────
  const [ppGroupId, setPpGroupId] = useState<string>("");
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [groupBets, setGroupBets] = useState<GroupMatchBetEntry[]>([]);
  const [loadingBets, setLoadingBets] = useState(false);
  const [liveScore, setLiveScore] = useState<LiveScore | null>(null);
  const [betDraft, setBetDraft] = useState<Draft>({ home: "", away: "", winner: null });
  const [savingBet, setSavingBet] = useState(false);

  // ── Pin (localStorage) ────────────────────────────────
  const [pinnedMatches, setPinnedMatches] = useState<Record<string, number[]>>({});
  const [groupPickerMatchId, setGroupPickerMatchId] = useState<number | null>(null);

  useEffect(() => { setPinnedMatches(loadPinned()); }, []);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const data = await loadUserPredictions();
    setPreds(data);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user?.id) return;
    getUserGroups(user.id).then((grps) => {
      setGroups(grps);
      setPpGroupId((prev) => prev || grps[0]?.id || "");
    });
  }, [user?.id]);

  useEffect(() => {
    if (tab !== "ranking") return;
    setLoadingRank(true);
    (activeGroup === "global" ? getGlobalRanking() : getGroupRanking(activeGroup))
      .then(setRanking).catch(() => setRanking([]))
      .finally(() => setLoadingRank(false));
  }, [tab, activeGroup]);

  // Load group bets when a match is expanded
  useEffect(() => {
    if (!selectedMatchId || !ppGroupId) { setGroupBets([]); return; }
    setLoadingBets(true);
    getGroupMatchBets(ppGroupId, selectedMatchId).then((bets) => {
      setGroupBets(bets);
      const myBet = bets.find((b) => b.user_id === user?.id)?.bet;
      setBetDraft(
        myBet
          ? {
              home: myBet.home_score !== null ? String(myBet.home_score) : "",
              away: myBet.away_score !== null ? String(myBet.away_score) : "",
              winner: myBet.predicted_winner,
            }
          : { home: "", away: "", winner: null }
      );
    }).finally(() => setLoadingBets(false));
  }, [selectedMatchId, ppGroupId, user?.id]);

  // Load live score when a match is expanded
  useEffect(() => {
    if (!selectedMatchId) { setLiveScore(null); return; }
    const m = MATCHES.find((x) => x.id === selectedMatchId);
    if (!m) { setLiveScore(null); return; }
    getMatchLiveScore(m.home.code, m.away.code).then(setLiveScore);
  }, [selectedMatchId]);

  const togglePin = (matchId: number, groupId: string) => {
    setPinnedMatches((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(matchId)
        ? current.filter((id) => id !== matchId)
        : [...current, matchId];
      const updated = { ...prev, [groupId]: next };
      savePinned(updated);
      return updated;
    });
  };

  // Torneo helpers
  const predMap = new Map(preds.map((p) => [p.match_id, p]));
  const totalPoints = preds.reduce((s, p) => s + (p.points_earned ?? 0), 0);
  const predicted = preds.length;
  const level = levelFromPoints(totalPoints);
  const pendingMatches = MATCHES.filter((m) => !isMatchLocked(m) && !predMap.has(m.id));

  const updateScore = (matchId: number, side: "home" | "away", raw: string) => {
    const val = raw.replace(/\D/g, "").slice(0, 2);
    setDrafts((prev) => {
      const d = prev[matchId] ?? { home: "", away: "", winner: null };
      const next = { ...d, [side]: val };
      next.winner = deriveWinner(side === "home" ? val : d.home, side === "away" ? val : d.away) ?? next.winner;
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
    if (!d?.winner || saving !== null || !user?.id) return;
    setSaving(matchId);
    const hs = d.home !== "" ? parseInt(d.home) : null;
    const as_ = d.away !== "" ? parseInt(d.away) : null;
    const { error } = await savePrediction(user.id, matchId, hs, as_, d.winner);
    if (!error) await load();
    setSaving(null);
  };

  // Group bet helpers
  const updateBetScore = (side: "home" | "away", raw: string) => {
    const val = raw.replace(/\D/g, "").slice(0, 2);
    setBetDraft((prev) => {
      const next = { ...prev, [side]: val };
      const derived = deriveWinner(side === "home" ? val : prev.home, side === "away" ? val : prev.away);
      if (derived) next.winner = derived;
      return next;
    });
  };

  const toggleBetWinner = (w: PredWinner) => {
    setBetDraft((prev) => ({ ...prev, winner: prev.winner === w ? null : w }));
  };

  const handleSaveBet = async (matchId: number) => {
    if (!betDraft.winner || savingBet || !user?.id || !ppGroupId) return;
    setSavingBet(true);
    const hs = betDraft.home !== "" ? parseInt(betDraft.home) : null;
    const as_ = betDraft.away !== "" ? parseInt(betDraft.away) : null;
    const { error } = await saveGroupBet(user.id, ppGroupId, matchId, hs, as_, betDraft.winner);
    if (!error) {
      const bets = await getGroupMatchBets(ppGroupId, matchId);
      setGroupBets(bets);
    }
    setSavingBet(false);
  };

  // Pinned matches for Por partido
  const pinnedMatchList = useMemo(() => {
    if (!ppGroupId) return [];
    const ids = new Set(pinnedMatches[ppGroupId] ?? []);
    return MATCHES.filter((m) => ids.has(m.id))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [pinnedMatches, ppGroupId]);

  const pinnedByDate = useMemo(() => {
    const map = new Map<string, (typeof MATCHES)[number][]>();
    for (const m of pinnedMatchList) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [pinnedMatchList]);

  const TAB_LABELS: Record<Tab, string> = {
    torneo: t("tab_torneo"),
    por_partido: t("tab_por_partido"),
    ranking: t("tab_ranking"),
  };

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title={t("predictor_title")} />

      {/* Stats Bar */}
      <div
        className="flex items-center justify-around px-5 py-3.5 flex-shrink-0"
        style={{ background: "var(--atlas-surface)", borderBottom: "1px solid var(--atlas-border)" }}
      >
        {[
          { val: level,            key: t("level_label"),     color: "var(--atlas-text)" },
          null,
          { val: `${predicted}`,   key: t("predicted_label"), color: "#22C55E" },
          null,
          { val: `${totalPoints}`, key: t("points_label"),    color: "#F97316" },
        ].map((item, i) =>
          item === null ? (
            <div key={i} className="w-px h-8" style={{ background: "var(--atlas-glass-md)" }} />
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
        style={{ background: "var(--atlas-surface)", borderBottom: "1px solid var(--atlas-border)" }}
      >
        {TAB_KEYS.map((key) => (
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
            {TAB_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── TORNEO ── */}
        {tab === "torneo" && (
          <div className="px-4 pt-3 pb-28 flex flex-col gap-3">
            {pendingMatches.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
                <span className="text-[48px]">✅</span>
                <span className="text-[14px] text-atlas-muted text-center">{t("all_done")}</span>
              </div>
            )}
            {pendingMatches.map((m) => {
              const d = drafts[m.id] ?? { home: "", away: "", winner: null };
              const canSave = !!d.winner && saving !== m.id;
              const isPinnedAny = groups.some((g) => (pinnedMatches[g.id] ?? []).includes(m.id));
              const isPickerOpen = groupPickerMatchId === m.id;

              return (
                <div
                  key={m.id}
                  className="rounded-[18px] p-4"
                  style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border-card)" }}
                >
                  {/* Header: date + pin button */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="text-[10px] font-bold tracking-widest text-atlas-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {formatMatchDay(m.date, locale)}
                    </div>
                    {groups.length > 0 && (
                      <button
                        onClick={() => setGroupPickerMatchId(isPickerOpen ? null : m.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all"
                        style={{
                          background: isPinnedAny || isPickerOpen ? "rgba(249,115,22,0.12)" : "transparent",
                          border: `1px solid ${isPinnedAny || isPickerOpen ? "rgba(249,115,22,0.4)" : "var(--atlas-glass-md)"}`,
                          color: isPinnedAny || isPickerOpen ? "#F97316" : "#4A5178",
                        }}
                      >
                        <span style={{ fontSize: "13px", lineHeight: 1 }}>📌</span>
                        <span>{t("nav_grupos")}</span>
                      </button>
                    )}
                  </div>

                  {/* Group picker */}
                  {isPickerOpen && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {groups.map((g) => {
                        const isPinned = (pinnedMatches[g.id] ?? []).includes(m.id);
                        return (
                          <button
                            key={g.id}
                            onClick={() => togglePin(m.id, g.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                            style={{
                              background: isPinned ? "rgba(249,115,22,0.15)" : "var(--atlas-glass-sm)",
                              border: `1px solid ${isPinned ? "#F97316" : "var(--atlas-glass-md)"}`,
                              color: isPinned ? "#F97316" : "#8892B0",
                            }}
                          >
                            {isPinned ? "✓" : "+"} {g.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Teams */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                      onClick={() => toggleWinner(m.id, "home")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background: d.winner === "home" ? "rgba(249,115,22,0.15)" : "var(--atlas-glass-sm)",
                        border: `2px solid ${d.winner === "home" ? "#F97316" : "var(--atlas-glass-md)"}`,
                      }}
                    >
                      <TeamFlag code={m.home.code} size="sm" shape="rounded" />
                      <span className="text-[12px] font-semibold text-atlas-text text-center leading-tight">
                        {m.home.name}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="number" min="0" max="20" placeholder="–"
                        value={d.home}
                        onChange={(e) => updateScore(m.id, "home", e.target.value)}
                        className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                        style={{ background: "var(--atlas-surface2)", border: "1px solid var(--atlas-border-md)" }}
                      />
                      <span className="text-atlas-dimmed text-[18px] font-bold">:</span>
                      <input
                        type="number" min="0" max="20" placeholder="–"
                        value={d.away}
                        onChange={(e) => updateScore(m.id, "away", e.target.value)}
                        className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                        style={{ background: "var(--atlas-surface2)", border: "1px solid var(--atlas-border-md)" }}
                      />
                    </div>

                    <button
                      onClick={() => toggleWinner(m.id, "away")}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all"
                      style={{
                        background: d.winner === "away" ? "rgba(249,115,22,0.15)" : "var(--atlas-glass-sm)",
                        border: `2px solid ${d.winner === "away" ? "#F97316" : "var(--atlas-glass-md)"}`,
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
                      background: canSave ? "#F97316" : "var(--atlas-glass-sm)",
                      border: `1px solid ${canSave ? "#F97316" : "var(--atlas-glass-md)"}`,
                      color: canSave ? "#fff" : "#4A5178",
                      fontFamily: "var(--font-display)",
                      opacity: canSave ? 1 : 0.6,
                    }}
                  >
                    {saving === m.id ? t("saving") : t("save_score")}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── POR PARTIDO ── */}
        {tab === "por_partido" && (
          <>
            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
                <span className="text-[40px]">👥</span>
                <span className="text-[14px] text-atlas-muted text-center">{t("pp_no_groups")}</span>
              </div>
            ) : (
              <>
                {/* Group filter */}
                <div
                  className="flex gap-2 px-4 pt-3 pb-2 overflow-x-auto flex-shrink-0"
                  style={{ borderBottom: "1px solid var(--atlas-border)" }}
                >
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => { setPpGroupId(g.id); setSelectedMatchId(null); }}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                      style={{
                        background: ppGroupId === g.id ? "#F97316" : "var(--atlas-surface2)",
                        border: `1px solid ${ppGroupId === g.id ? "#F97316" : "var(--atlas-glass-md)"}`,
                        color: ppGroupId === g.id ? "#fff" : "#8892B0",
                      }}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>

                {/* Pinned matches */}
                {pinnedByDate.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[260px]">
                    <span className="text-[40px]">📌</span>
                    <span className="text-[14px] text-atlas-muted text-center">{t("pp_add_hint")}</span>
                  </div>
                ) : (
                  <div className="px-4 pb-28">
                    {pinnedByDate.map(([date, dayMatches]) => (
                      <div key={date}>
                        <div
                          className="text-[10px] font-bold tracking-[0.15em] uppercase text-atlas-dimmed py-2.5 sticky top-0 z-10"
                          style={{ background: "var(--atlas-bg)" }}
                        >
                          {formatMatchDay(date, locale)}
                        </div>

                        {dayMatches.map((m) => {
                          const isSelected = selectedMatchId === m.id;
                          const locked = isMatchLocked(m);
                          const myBet = isSelected
                            ? groupBets.find((b) => b.user_id === user?.id)?.bet ?? null
                            : null;
                          const canSaveBet = !!betDraft.winner && !savingBet && !locked;

                          const sortedBets = isSelected
                            ? [...groupBets].sort(
                                (a, b) => effectiveBetPoints(b.bet, liveScore) - effectiveBetPoints(a.bet, liveScore)
                              )
                            : [];

                          let medalPos = 0;
                          let prevPts = -999;
                          const medals = ["🥇", "🥈", "🥉"];

                          return (
                            <div key={m.id} className="mb-1.5">
                              {/* Match row */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedMatchId(isSelected ? null : m.id)}
                                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl transition-all"
                                  style={{
                                    background: isSelected ? "rgba(249,115,22,0.1)" : "var(--atlas-surface)",
                                    border: `1px solid ${isSelected ? "rgba(249,115,22,0.35)" : "var(--atlas-border-card)"}`,
                                  }}
                                >
                                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                    <TeamFlag code={m.home.code} size="sm" />
                                    <span className="text-[12px] font-semibold text-atlas-text truncate">{m.home.name}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-atlas-dimmed flex-shrink-0">vs</span>
                                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                                    <span className="text-[12px] font-semibold text-atlas-text truncate text-right">{m.away.name}</span>
                                    <TeamFlag code={m.away.code} size="sm" />
                                  </div>
                                  {/* Bet indicator dot */}
                                  <div
                                    className="w-2 h-2 rounded-full flex-shrink-0 ml-1"
                                    style={{
                                      background: groupBets.find((b) => b.user_id === user?.id)?.bet
                                        ? "#22C55E"
                                        : locked
                                        ? "var(--atlas-glass-md)"
                                        : "rgba(249,115,22,0.4)",
                                    }}
                                  />
                                </button>

                                {/* Unpin */}
                                <button
                                  onClick={() => { togglePin(m.id, ppGroupId); if (isSelected) setSelectedMatchId(null); }}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl text-[18px] flex-shrink-0"
                                  style={{ background: "var(--atlas-glass-sm)", border: "1px solid var(--atlas-glass-md)", color: "#4A5178" }}
                                >
                                  ×
                                </button>
                              </div>

                              {/* Expanded panel */}
                              {isSelected && (
                                <div
                                  className="rounded-2xl mt-1 overflow-hidden"
                                  style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border-card)" }}
                                >
                                  {/* Live score (only when match is live or finished) */}
                                  {liveScore && liveScore.status !== "scheduled" && (
                                    <div className="flex items-center justify-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid var(--atlas-glass)" }}>
                                      <span
                                        className="text-[20px] font-black leading-none"
                                        style={{ fontFamily: "var(--font-display)", color: "#F97316" }}
                                      >
                                        {liveScore.home_score}–{liveScore.away_score}
                                      </span>
                                      {liveScore.status === "live" && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>
                                          EN VIVO {liveScore.minute}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Inline bet form (only when not locked) */}
                                  {!locked && (
                                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--atlas-glass)" }}>
                                      {myBet && (
                                        <div className="text-[10px] font-bold text-atlas-dimmed tracking-wide mb-2 text-center uppercase">
                                          Tu apuesta · Editar
                                        </div>
                                      )}

                                      {/* Score inputs */}
                                      <div className="flex items-center justify-center gap-3 mb-2.5">
                                        <button
                                          onClick={() => toggleBetWinner("home")}
                                          className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
                                          style={{
                                            background: betDraft.winner === "home" ? "rgba(249,115,22,0.15)" : "var(--atlas-glass-sm)",
                                            border: `1.5px solid ${betDraft.winner === "home" ? "#F97316" : "var(--atlas-glass-md)"}`,
                                          }}
                                        >
                                          <TeamFlag code={m.home.code} size="sm" />
                                          <span className="text-[10px] font-semibold text-atlas-text leading-none text-center">{m.home.name}</span>
                                        </button>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                          <input
                                            type="number" min="0" max="20" placeholder="–"
                                            value={betDraft.home}
                                            onChange={(e) => updateBetScore("home", e.target.value)}
                                            className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                                            style={{ background: "var(--atlas-surface2)", border: "1px solid var(--atlas-border-md)" }}
                                          />
                                          <span className="text-atlas-dimmed text-[18px] font-bold">:</span>
                                          <input
                                            type="number" min="0" max="20" placeholder="–"
                                            value={betDraft.away}
                                            onChange={(e) => updateBetScore("away", e.target.value)}
                                            className="w-9 h-9 text-center text-[16px] font-bold rounded-xl outline-none"
                                            style={{ background: "var(--atlas-surface2)", border: "1px solid var(--atlas-border-md)" }}
                                          />
                                        </div>

                                        <button
                                          onClick={() => toggleBetWinner("away")}
                                          className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
                                          style={{
                                            background: betDraft.winner === "away" ? "rgba(249,115,22,0.15)" : "var(--atlas-glass-sm)",
                                            border: `1.5px solid ${betDraft.winner === "away" ? "#F97316" : "var(--atlas-glass-md)"}`,
                                          }}
                                        >
                                          <TeamFlag code={m.away.code} size="sm" />
                                          <span className="text-[10px] font-semibold text-atlas-text leading-none text-center">{m.away.name}</span>
                                        </button>
                                      </div>

                                      {/* Draw button */}
                                      <div className="flex justify-center mb-2.5">
                                        <button
                                          onClick={() => toggleBetWinner("draw")}
                                          className="px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                                          style={{
                                            background: betDraft.winner === "draw" ? "rgba(249,115,22,0.15)" : "var(--atlas-glass-sm)",
                                            border: `1.5px solid ${betDraft.winner === "draw" ? "#F97316" : "var(--atlas-glass-md)"}`,
                                            color: betDraft.winner === "draw" ? "#F97316" : "#8892B0",
                                          }}
                                        >
                                          Empate
                                        </button>
                                      </div>

                                      <button
                                        onClick={() => handleSaveBet(m.id)}
                                        disabled={!canSaveBet}
                                        className="w-full py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all"
                                        style={{
                                          background: canSaveBet ? "#F97316" : "var(--atlas-glass-sm)",
                                          border: `1px solid ${canSaveBet ? "#F97316" : "var(--atlas-glass-md)"}`,
                                          color: canSaveBet ? "#fff" : "#4A5178",
                                          fontFamily: "var(--font-display)",
                                          opacity: canSaveBet ? 1 : 0.6,
                                        }}
                                      >
                                        {savingBet ? t("saving") : myBet ? "Actualizar apuesta" : t("save_score")}
                                      </button>
                                    </div>
                                  )}

                                  {/* Members bets list */}
                                  {loadingBets ? (
                                    <div className="flex justify-center py-6">
                                      <div className="w-6 h-6 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
                                    </div>
                                  ) : sortedBets.length === 0 ? (
                                    <div className="px-4 py-4 text-[13px] text-atlas-dimmed text-center">
                                      Sin miembros en este grupo
                                    </div>
                                  ) : (
                                    sortedBets.map((entry, idx) => {
                                      const isMe = entry.user_id === user?.id;
                                      const pts = effectiveBetPoints(entry.bet, liveScore);
                                      const hasResult = liveScore?.status === "finished" || entry.bet?.points_earned !== null;

                                      if (pts !== prevPts) { medalPos = idx + 1; prevPts = pts; }
                                      const medal = hasResult && entry.bet && pts >= 0 ? medals[medalPos - 1] ?? null : null;

                                      const winnerName = !entry.bet ? null
                                        : entry.bet.predicted_winner === "home" ? m.home.name
                                        : entry.bet.predicted_winner === "away" ? m.away.name
                                        : "Empate";

                                      return (
                                        <div
                                          key={entry.user_id}
                                          className="flex items-center gap-3 px-4 py-3"
                                          style={{
                                            borderBottom: idx < sortedBets.length - 1 ? "1px solid var(--atlas-glass)" : "none",
                                            background: isMe ? "rgba(249,115,22,0.05)" : "transparent",
                                          }}
                                        >
                                          <span className="text-[18px] w-7 text-center flex-shrink-0">
                                            {medal ?? (hasResult && entry.bet ? `${medalPos}` : "·")}
                                          </span>
                                          <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0"
                                            style={{ background: entry.avatar?.bg ?? "#F97316" }}
                                          >
                                            {entry.avatar?.emoji ?? "⭐"}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-[13px] font-semibold text-atlas-text">{entry.username}</span>
                                            {isMe && (
                                              <span className="text-[11px] text-atlas-primary ml-1">{t("you_suffix")}</span>
                                            )}
                                            {entry.bet && winnerName && (
                                              <div className="text-[10px] text-atlas-muted">{winnerName}</div>
                                            )}
                                          </div>
                                          <div className="flex flex-col items-end flex-shrink-0">
                                            {entry.bet ? (
                                              <>
                                                {entry.bet.home_score !== null && entry.bet.away_score !== null && (
                                                  <span
                                                    className="text-[16px] font-bold leading-none"
                                                    style={{ fontFamily: "var(--font-display)", color: "#F97316" }}
                                                  >
                                                    {entry.bet.home_score}–{entry.bet.away_score}
                                                  </span>
                                                )}
                                                {hasResult && (
                                                  <span
                                                    className="text-[13px] font-bold"
                                                    style={{ color: pts > 0 ? "#22C55E" : "#4A5178" }}
                                                  >
                                                    {pts > 0 ? `+${pts}` : "0"} pts
                                                  </span>
                                                )}
                                              </>
                                            ) : (
                                              <span className="text-[11px] text-atlas-dimmed italic">{t("pp_no_pred")}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── RANKING ── */}
        {tab === "ranking" && (
          <div className="px-4 pt-3 pb-4">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {[{ id: "global", name: t("global_label") }, ...groups].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{
                    background: activeGroup === g.id ? "#F97316" : "var(--atlas-surface2)",
                    border: `1px solid ${activeGroup === g.id ? "#F97316" : "var(--atlas-glass-md)"}`,
                    color: activeGroup === g.id ? "#fff" : "#8892B0",
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {loadingRank ? (
              <div className="flex justify-center py-12">
                <span className="text-atlas-muted text-[14px]">{t("loading")}</span>
              </div>
            ) : ranking.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[200px]">
                <Image src="/trophy.png" alt="Trophy" width={90} height={90} className="drop-shadow-lg" />
                <span className="text-[14px] text-atlas-muted text-center">{t("no_ranking")}</span>
              </div>
            ) : (
              <div
                className="rounded-[18px] overflow-hidden"
                style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border-card)" }}
              >
                {ranking.map((r, i) => {
                  const pos = i + 1;
                  const isMe = r.user_id === user?.id;
                  return (
                    <div
                      key={r.user_id}
                      className="flex items-center gap-3 px-4 py-3.5"
                      style={{
                        borderBottom: "1px solid var(--atlas-glass)",
                        background: isMe ? "rgba(249,115,22,0.08)" : "transparent",
                      }}
                    >
                      <span className="w-7 text-center text-[16px] font-bold text-atlas-muted">
                        {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : pos}
                      </span>
                      <div
                        className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[20px]"
                        style={{ background: "var(--atlas-surface3)" }}
                      >
                        {r.team_flag ?? "⭐"}
                      </div>
                      <span className="flex-1 text-[14px] font-semibold text-atlas-text">
                        {r.username}{isMe ? t("you_suffix") : ""}
                      </span>
                      <span
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-[18px] font-bold text-atlas-primary"
                      >
                        {r.total_points}{t("pts_suffix")}
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
