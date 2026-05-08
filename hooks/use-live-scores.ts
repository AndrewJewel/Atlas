"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface LiveMatch {
  homeCode: string;
  awayCode: string;
  homeScore: number;
  awayScore: number;
  status: "scheduled" | "live" | "finished";
  minute: string;
  date: string;
}

type ScoreRow = {
  id: string;
  home_code: string;
  away_code: string;
  home_score: number;
  away_score: number;
  status: string;
  minute: string;
  match_date: string;
};

function buildState(rows: ScoreRow[]): { map: Map<string, LiveMatch>; hasLive: boolean } {
  const map = new Map<string, LiveMatch>();
  let hasLive = false;
  for (const row of rows) {
    const match: LiveMatch = {
      homeCode: row.home_code,
      awayCode: row.away_code,
      homeScore: row.home_score,
      awayScore: row.away_score,
      status: row.status as LiveMatch["status"],
      minute: row.minute,
      date: row.match_date,
    };
    map.set(`${row.home_code}-${row.away_code}`, match);
    if (match.status === "live") hasLive = true;
  }
  return { map, hasLive };
}

async function fetchAll(
  setScores: (m: Map<string, LiveMatch>) => void,
  setHasLive: (v: boolean) => void
) {
  const { data } = await supabase.from("live_scores").select("*");
  if (data?.length) {
    const { map, hasLive } = buildState(data as ScoreRow[]);
    setScores(map);
    setHasLive(hasLive);
  }
}

export function useLiveScores() {
  const [scores, setScores] = useState<Map<string, LiveMatch>>(new Map());
  const [hasLive, setHasLive] = useState(false);

  useEffect(() => {
    fetchAll(setScores, setHasLive);

    const channel = supabase
      .channel("live_scores_rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_scores" },
        () => fetchAll(setScores, setHasLive)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { scores, hasLive };
}
