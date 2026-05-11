import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

const ESPN_TO_OUR: Record<string, string> = {
  SAF: "RSA", IVC: "CIV", URY: "URU", PRY: "PAR",
};

function norm(code: string) {
  return ESPN_TO_OUR[code] ?? code;
}

export async function GET(req: Request) {
  // Fail hard if secret is not configured — prevents "Bearer undefined" bypass
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("CRON_SECRET not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const res = await fetch(ESPN_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return NextResponse.json({ error: "ESPN unreachable" }, { status: 502 });

    const data = await res.json();
    const events: unknown[] = data.events ?? [];

    const rows = events.map((event: unknown) => {
      const e = event as {
        id: string;
        date: string;
        status: { type: { name: string; shortDetail: string } };
        competitions: { competitors: { homeAway: string; score: string; team: { abbreviation: string } }[] }[];
      };
      const comp = e.competitions?.[0];
      const home = comp?.competitors?.find((c) => c.homeAway === "home");
      const away = comp?.competitors?.find((c) => c.homeAway === "away");
      const statusName = e.status?.type?.name ?? "";
      const hCode = norm(home?.team?.abbreviation?.toUpperCase() ?? "");
      const aCode = norm(away?.team?.abbreviation?.toUpperCase() ?? "");

      return {
        id: `${hCode}-${aCode}`,
        home_code: hCode,
        away_code: aCode,
        home_score: parseInt(home?.score ?? "0") || 0,
        away_score: parseInt(away?.score ?? "0") || 0,
        status: statusName.includes("IN_PROGRESS")
          ? "live"
          : statusName.includes("FINAL") || statusName.includes("FULL_TIME")
          ? "finished"
          : "scheduled",
        minute: e.status?.type?.shortDetail ?? "",
        match_date: e.date?.slice(0, 10) ?? "",
        updated_at: new Date().toISOString(),
      };
    });

    if (rows.length > 0) {
      const { error } = await supabase
        .from("live_scores")
        .upsert(rows, { onConflict: "id" });
      if (error) throw error;
    }

    return NextResponse.json({ updated: rows.length });
  } catch (err) {
    console.error("Cron live error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
