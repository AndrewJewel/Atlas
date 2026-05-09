import { supabase } from "./supabase";
import type { Match } from "./types";

export type PredWinner = "home" | "away" | "draw";

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

// ET (EDT UTC-4) kickoff → UTC timestamp for lock comparison
function kickoffUTC(date: string, etTime: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = etTime.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h + 4, mi));
}

export function isMatchLocked(match: Pick<Match, "date" | "time">): boolean {
  return Date.now() >= kickoffUTC(match.date, match.time).getTime();
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

export async function savePrediction(
  matchId: number,
  homeScore: number | null,
  awayScore: number | null,
  predictedWinner: PredWinner
): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { error } = await supabase.from("predictions").upsert(
    { user_id: user.id, match_id: matchId, home_score: homeScore, away_score: awayScore, predicted_winner: predictedWinner },
    { onConflict: "user_id,match_id", ignoreDuplicates: false }
  );
  return { error: error?.message ?? null };
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

export async function getUserGroups(): Promise<UserGroup[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, groups(id, name)")
    .eq("user_id", user.id);
  if (error || !data) return [];
  return (data as { groups: { id: string; name: string } }[])
    .map((row) => ({ id: row.groups.id, name: row.groups.name }))
    .filter(Boolean);
}
