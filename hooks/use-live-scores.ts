"use client";
import { useState, useEffect, useCallback } from "react";

export interface LiveMatch {
  espnId: string;
  homeCode: string;
  awayCode: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  status: "scheduled" | "live" | "finished";
  minute: string;
  date: string;
}

// Some ESPN codes differ from FIFA/our codes — map to ours
const ESPN_TO_OUR: Record<string, string> = {
  SAF: "RSA",  // South Africa
  IVC: "CIV",  // Ivory Coast
  URY: "URU",  // Uruguay
  PRY: "PAR",  // Paraguay
  COD: "COD",
  ALG: "ALG",
  KOR: "KOR",
  GER: "GER",
  ENG: "ENG",
  NED: "NED",
};

function normalizeCode(code: string): string {
  return ESPN_TO_OUR[code] ?? code;
}

export function useLiveScores() {
  const [scores, setScores] = useState<Map<string, LiveMatch>>(new Map());
  const [hasLive, setHasLive] = useState(false);

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch("/api/live");
      if (!res.ok) return;
      const data: { matches: LiveMatch[] } = await res.json();

      const map = new Map<string, LiveMatch>();
      let live = false;

      for (const m of data.matches) {
        const hCode = normalizeCode(m.homeCode);
        const aCode = normalizeCode(m.awayCode);
        map.set(`${hCode}-${aCode}`, { ...m, homeCode: hCode, awayCode: aCode });
        if (m.status === "live") live = true;
      }

      setScores(map);
      setHasLive(live);
    } catch {
      // silent — live scores are a bonus feature
    }
  }, []);

  useEffect(() => {
    fetchScores();
    // Poll every 60s. If there's a live match, poll every 30s
    const interval = setInterval(fetchScores, hasLive ? 30_000 : 60_000);
    return () => clearInterval(interval);
  }, [fetchScores, hasLive]);

  return { scores, hasLive };
}
