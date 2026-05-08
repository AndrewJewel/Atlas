import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

const CODE_MAP: Record<string, string> = {
  SAF: "RSA", IVC: "CIV", URY: "URU", PRY: "PAR",
};

Deno.serve(async () => {
  try {
    const res = await fetch(ESPN_URL);
    const data = await res.json();

    const events: unknown[] = data.events ?? [];
    if (events.length === 0) {
      return new Response(JSON.stringify({ updated: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const normalize = (code: string) => CODE_MAP[code] ?? code;

    const rows = (events as Record<string, unknown>[]).map((ev) => {
      const comp = (ev.competitions as Record<string, unknown>[])?.[0] ?? {};
      const status = (comp.status as Record<string, unknown>);
      const statusName: string =
        (status?.type as Record<string, unknown>)?.name as string ?? "";
      const competitors = (comp.competitors as Record<string, unknown>[]) ?? [];
      const home = competitors.find((c) => c.homeAway === "home") ?? {};
      const away = competitors.find((c) => c.homeAway === "away") ?? {};
      const homeCode = normalize((home.team as Record<string, unknown>)?.abbreviation as string ?? "");
      const awayCode = normalize((away.team as Record<string, unknown>)?.abbreviation as string ?? "");

      return {
        id: `${homeCode}-${awayCode}`,
        home_code: homeCode,
        away_code: awayCode,
        home_score: parseInt((home.score as string) ?? "0", 10),
        away_score: parseInt((away.score as string) ?? "0", 10),
        minute: (status?.displayClock as string) ?? "",
        status: statusName.includes("InProgress")
          ? "live"
          : statusName.includes("Final")
          ? "finished"
          : "scheduled",
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from("live_scores")
      .upsert(rows, { onConflict: "id" });

    if (error) throw error;

    return new Response(JSON.stringify({ updated: rows.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
});
