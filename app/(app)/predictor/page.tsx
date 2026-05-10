"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/app-header";
import { useLanguage } from "@/contexts/language-context";
import { MATCHES } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";
import { TrophyIcon } from "@/components/TrophyIcon";
import Image from "next/image";
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

const LOCALE_MAP: Record<string, string> = { es: "es-AR", en: "en-US", pt: "pt-BR" };

function formatMatchDay(date: string, locale: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}

const TAB_KEYS = ["pending", "ranking"] as const;
type Tab = typeof TAB_KEYS[number];

type Draft = { home: string; away: string; winner: PredWinner | null };

function deriveWinner(h: string, a: string): PredWinner | null {
  const hv = parseInt(h), av = parseInt(a);
  if (isNaN(hv) || isNaN(av) || h === "" || a === "") return null;
  if (hv > av) return "home";
  if (av > hv) return "away";
  return "draw";
}



export default function PredictorPage() {
  const { user } = useUser();
  const { lang, t } = useLanguage();
  const locale = LOCALE_MAP[lang] ?? "es-AR";
  const [tab, setTab] = useState<Tab>("pending");

  function levelFromPoints(pts: number): string {
    if (pts >= 60) return t("level_3");
    if (pts >= 30) return t("level_2");
    if (pts >= 10) return t("level_1");
    return t("level_0");
  }
  const [preds, setPreds] = useState<SavedPrediction[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>("global");
  const [loadingRank, setLoadingRank] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const data = await loadUserPredictions();
    setPreds(data);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tab !== "ranking") return;
    setLoadingRank(true);
    const fetch = async () => {
      try {
        const [g, grps] = await Promise.all([
          activeGroup === "global" ? getGlobalRanking() : getGroupRanking(activeGroup),
          user?.id ? getUserGroups(user.id) : Promise.resolve([]),
        ]);
        setRanking(g);
        setGroups(grps);
      } catch {
        setRanking([]);
        setGroups([]);
      } finally {
        setLoadingRank(false);
      }
    };
    fetch();
  }, [tab, activeGroup]);

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
    if (!user?.id) return;
    const { error } = await savePrediction(user.id, matchId, hs, as_, d.winner);
    if (!error) await load();
    setSaving(null);
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
          { val: level,              key: t("level_label"),     color: "var(--atlas-text)" },
          null,
          { val: `${predicted}`,     key: t("predicted_label"), color: "#22C55E" },
          null,
          { val: `${totalPoints}`,   key: t("points_label"),    color: "#F97316" },
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
            {key === "pending" ? t("tab_pending") : t("tab_ranking")}
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
                  {t("all_done")}
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
                  style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border-card)" }}
                >
                  <div
                    className="text-[10px] font-bold tracking-widest text-atlas-primary mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {formatMatchDay(m.date, locale)}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Home */}
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

                    {/* Score inputs */}
                    <div className="flex flex-col items-center gap-1">
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
                    </div>

                    {/* Away */}
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

        {/* ── RANKING ── */}
        {tab === "ranking" && (
          <div className="px-4 pt-3 pb-4">
            {/* Group selector */}
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
                <span className="text-[14px] text-atlas-muted text-center">
                  {t("no_ranking")}
                </span>
              </div>
            ) : (
              <div className="rounded-[18px] overflow-hidden" style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border-card)" }}>
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
                      <span style={{ fontFamily: "var(--font-display)" }} className="text-[18px] font-bold text-atlas-primary">
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
