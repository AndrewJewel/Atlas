import { supabase } from "./supabase";
import type { Match } from "./types";
import type { TKey } from "./i18n";

export type PredWinner = "home" | "away" | "draw";

/**
 * Devuelve la clave i18n del nivel según los puntos acumulados.
 * La misma lógica vive en predictor/page.tsx y mas/page.tsx.
 */
export function getLevel(points: number, t: (key: TKey) => string): string {
  if (points >= 60) return t("level_3");
  if (points >= 30) return t("level_2");
  if (points >= 10) return t("level_1");
  return t("level_0");
}

export interface SavedPrediction {
  id: string;
  match_id: number;
  home_score: number | null;
  away_score: number | null;
  predicted_winner: PredWinner;
  points_earned: number | null;
  created_at: string;
}

export interface RankingEntry {
  user_id: string;
  username: string;
  team_flag: string | null;
  total_points: number;
  total_predictions: number;
}

export interface UserGroup {
  id: string;
  name: string;
}

// UTC offset (hours) for each host city during summer 2026 (DST)
const CITY_UTC_OFFSET: Record<string, number> = {
  "Cd. de México":  -5,
  "Guadalajara":    -5,
  "Monterrey":      -5,
  "Toronto":        -4,
  "Vancouver":      -7,
  "Los Ángeles":    -7,
  "Santa Clara":    -7,
  "Seattle":        -7,
  "Houston":        -5,
  "Dallas":         -5,
  "Kansas City":    -5,
  "Filadelfia":     -4,
  "Nueva York":     -4,
  "Boston":         -4,
  "Miami":          -4,
  "Atlanta":        -4,
};

function kickoffUTC(date: string, time: string, city: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const offset = CITY_UTC_OFFSET[city] ?? -4;
  return new Date(Date.UTC(y, mo - 1, d, h - offset, mi));
}

export function isMatchLocked(match: Pick<Match, "date" | "time" | "city">): boolean {
  return Date.now() >= kickoffUTC(match.date, match.time, match.city).getTime() - 15 * 60 * 1000;
}

export function calculatePoints(
  predicted: PredWinner,
  homeScore: number | null,
  awayScore: number | null,
  actualHome: number,
  actualAway: number
): number {
  if (homeScore !== null && awayScore !== null &&
      homeScore === actualHome && awayScore === actualAway) return 3;
  const actualWinner: PredWinner =
    actualHome > actualAway ? "home" : actualAway > actualHome ? "away" : "draw";
  return predicted === actualWinner ? 1 : 0;
}

// Group bet scoring: 3 = exact score, 2 = correct winner, 1 = correct draw, 0 = wrong
export function calculateGroupPoints(
  predicted: PredWinner,
  homeScore: number | null,
  awayScore: number | null,
  actualHome: number,
  actualAway: number
): number {
  if (homeScore !== null && awayScore !== null &&
      homeScore === actualHome && awayScore === actualAway) return 3;
  const actualWinner: PredWinner =
    actualHome > actualAway ? "home" : actualAway > actualHome ? "away" : "draw";
  if (predicted !== actualWinner) return 0;
  return 2;
}

export async function savePrediction(
  userId: string,
  matchId: number,
  homeScore: number | null,
  awayScore: number | null,
  predictedWinner: PredWinner
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("predictions").upsert(
    { user_id: userId, match_id: matchId, home_score: homeScore, away_score: awayScore, predicted_winner: predictedWinner },
    { onConflict: "user_id,match_id", ignoreDuplicates: false }
  );
  return { error: error?.message ?? null };
}

// Versión segura: valida el kickoff server-side antes de guardar la predicción.
export async function savePredictionSecure(
  accessToken: string,
  matchId: number,
  homeScore: number | null,
  awayScore: number | null,
  predictedWinner: PredWinner
): Promise<{ error: string | null }> {
  try {
    const res = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ matchId, homeScore, awayScore, predictedWinner }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: (data as { error?: string }).error ?? "Error al guardar" };
    }
    return { error: null };
  } catch {
    return { error: "Error de red" };
  }
}

export async function loadUserPredictions(): Promise<SavedPrediction[]> {
  const { data, error } = await supabase
    .from("predictions")
    .select("id, match_id, home_score, away_score, predicted_winner, points_earned, created_at")
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as SavedPrediction[];
}

export async function getGlobalRanking(): Promise<RankingEntry[]> {
  const { data, error } = await supabase.rpc("get_global_ranking");
  if (error || !data) return [];
  return (data as RankingEntry[]).map((r) => ({
    ...r,
    total_points: Number(r.total_points),
    total_predictions: Number(r.total_predictions),
  }));
}

export async function getGroupRanking(groupId: string): Promise<RankingEntry[]> {
  const { data, error } = await supabase.rpc("get_group_ranking", { p_group_id: groupId });
  if (error || !data) return [];
  return (data as RankingEntry[]).map((r) => ({
    ...r,
    total_points: Number(r.total_points),
    total_predictions: Number(r.total_predictions),
  }));
}

export type LiveScore = {
  home_score: number;
  away_score: number;
  status: "scheduled" | "live" | "finished";
  minute: string;
};

export async function getMatchLiveScore(homeCode: string, awayCode: string): Promise<LiveScore | null> {
  try {
    const { data } = await supabase
      .from("live_scores")
      .select("home_score, away_score, status, minute")
      .eq("id", `${homeCode}-${awayCode}`)
      .maybeSingle();
    return (data as LiveScore) ?? null;
  } catch {
    return null;
  }
}

export type MatchMemberPred = {
  user_id: string;
  username: string;
  avatar: { emoji: string; bg: string };
  pred: (SavedPrediction & { user_id: string }) | null;
};

export async function getMatchGroupPredictions(
  matchId: number,
  groupId: string
): Promise<MatchMemberPred[]> {
  try {
    const { data: members } = await supabase
      .from("group_members")
      .select("user_id, username, avatar")
      .eq("group_id", groupId);

    if (!members?.length) return [];

    const memberIds = (members as { user_id: string }[]).map((m) => m.user_id);

    const { data: preds } = await supabase
      .from("predictions")
      .select("id, match_id, user_id, home_score, away_score, predicted_winner, points_earned, created_at")
      .eq("match_id", matchId)
      .in("user_id", memberIds);

    type RawPred = SavedPrediction & { user_id: string };
    const predByUser = new Map<string, RawPred>(
      ((preds ?? []) as RawPred[]).map((p) => [p.user_id, p])
    );

    return (members as { user_id: string; username: string; avatar: { emoji: string; bg: string } }[]).map((m) => ({
      user_id: m.user_id,
      username: m.username,
      avatar: m.avatar,
      pred: predByUser.get(m.user_id) ?? null,
    }));
  } catch {
    return [];
  }
}

export type GroupBet = {
  id: string;
  group_id: string;
  match_id: number;
  user_id: string;
  home_score: number | null;
  away_score: number | null;
  predicted_winner: PredWinner;
  points_earned: number | null;
  created_at: string;
};

export type GroupMatchBetEntry = {
  user_id: string;
  username: string;
  avatar: { emoji: string; bg: string };
  bet: GroupBet | null;
};

export async function saveGroupBet(
  userId: string,
  groupId: string,
  matchId: number,
  homeScore: number | null,
  awayScore: number | null,
  predictedWinner: PredWinner
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("group_match_bets").upsert(
    { user_id: userId, group_id: groupId, match_id: matchId, home_score: homeScore, away_score: awayScore, predicted_winner: predictedWinner },
    { onConflict: "group_id,match_id,user_id", ignoreDuplicates: false }
  );
  return { error: error?.message ?? null };
}

// Versión segura: valida el kickoff server-side antes de guardar la apuesta
export async function saveGroupBetSecure(
  accessToken: string,
  matchId: number,
  groupId: string,
  homeScore: number | null,
  awayScore: number | null,
  predictedWinner: PredWinner
): Promise<{ error: string | null }> {
  try {
    const res = await fetch("/api/bets/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ matchId, groupId, homeScore, awayScore, predictedWinner }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: (data as { error?: string }).error ?? "Error al guardar" };
    }
    return { error: null };
  } catch {
    return { error: "Error de red" };
  }
}

export async function getGroupMatchBets(
  groupId: string,
  matchId: number
): Promise<GroupMatchBetEntry[]> {
  try {
    const { data: members } = await supabase
      .from("group_members")
      .select("user_id, username, avatar")
      .eq("group_id", groupId);

    if (!members?.length) return [];

    const memberIds = (members as { user_id: string }[]).map((m) => m.user_id);

    const { data: bets } = await supabase
      .from("group_match_bets")
      .select("id, group_id, match_id, user_id, home_score, away_score, predicted_winner, points_earned, created_at")
      .eq("group_id", groupId)
      .eq("match_id", matchId)
      .in("user_id", memberIds);

    const betByUser = new Map<string, GroupBet>(
      ((bets ?? []) as GroupBet[]).map((b) => [b.user_id, b])
    );

    return (members as { user_id: string; username: string; avatar: { emoji: string; bg: string } }[]).map((m) => ({
      user_id: m.user_id,
      username: m.username,
      avatar: m.avatar,
      bet: betByUser.get(m.user_id) ?? null,
    }));
  } catch {
    return [];
  }
}

export type PinnedMatch = {
  match_id: number;
  pinned_by: string;
};

export async function getGroupPinnedMatches(groupId: string): Promise<PinnedMatch[]> {
  try {
    const { data } = await supabase
      .from("group_pinned_matches")
      .select("match_id, pinned_by")
      .eq("group_id", groupId);
    return (data ?? []) as PinnedMatch[];
  } catch {
    return [];
  }
}

export async function getMatchPinnedGroupIds(
  matchId: number,
  groupIds: string[]
): Promise<string[]> {
  if (groupIds.length === 0) return [];
  try {
    const { data } = await supabase
      .from("group_pinned_matches")
      .select("group_id")
      .eq("match_id", matchId)
      .in("group_id", groupIds);
    return (data ?? []).map((r: { group_id: string }) => r.group_id);
  } catch {
    return [];
  }
}

export async function pinMatchToGroup(
  userId: string,
  groupId: string,
  matchId: number
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("group_pinned_matches")
    .insert({ group_id: groupId, match_id: matchId, pinned_by: userId });
  return { error: error?.message ?? null };
}

export async function unpinMatchFromGroup(
  groupId: string,
  matchId: number
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("group_pinned_matches")
    .delete()
    .eq("group_id", groupId)
    .eq("match_id", matchId);
  return { error: error?.message ?? null };
}

export async function getUserGroups(userId: string): Promise<UserGroup[]> {
  try {
    const { data: members, error: me } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", userId);
    if (me || !members || members.length === 0) return [];

    const groupIds = members.map((m: { group_id: string }) => m.group_id);

    const { data: grps, error: ge } = await supabase
      .from("groups")
      .select("id, name")
      .in("id", groupIds);
    if (ge || !grps) return [];

    return (grps as { id: string; name: string }[]).map((g) => ({ id: g.id, name: g.name }));
  } catch {
    return [];
  }
}
