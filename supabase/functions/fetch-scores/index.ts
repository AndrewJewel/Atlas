import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

const CODE_MAP: Record<string, string> = {
  SAF: "RSA", IVC: "CIV", URY: "URU", PRY: "PAR",
};

// Fecha UTC de la final del Mundial 2026 (MetLife Stadium, 19 Jul 2026)
const FINAL_DATE = "2026-07-19";

const CONMEBOL = new Set([
  "ARG", "BRA", "URU", "COL", "CHI", "ECU", "PAR", "PER", "VEN", "BOL",
]);

Deno.serve(async (req) => {
  // Verificar secret de autorización — OBLIGATORIO.
  // Si FETCH_SCORES_SECRET no está configurado se rechaza con 500 para evitar
  // que la función quede abierta por error de configuración.
  const secret = Deno.env.get("FETCH_SCORES_SECRET");
  if (!secret) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

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
      const matchDate = ((ev.date as string) ?? "").slice(0, 10);

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
        match_date: matchDate,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from("live_scores")
      .upsert(rows, { onConflict: "id" });

    if (error) throw error;

    // ── Detectar final del Mundial ──────────────────────────────────────────
    const finalRow = rows.find(
      (r) => r.match_date === FINAL_DATE && r.status === "finished",
    );

    if (finalRow) {
      // Verificar que aún no esté guardado
      const { data: existing } = await supabase
        .from("champion_2026")
        .select("id")
        .limit(1);

      if (!existing || existing.length === 0) {
        // Encontrar el evento correspondiente para obtener nombres de equipos
        const finalEvent = (events as Record<string, unknown>[]).find((ev) => {
          const comp = (ev.competitions as Record<string, unknown>[])?.[0] ?? {};
          const competitors = (comp.competitors as Record<string, unknown>[]) ?? [];
          const home = competitors.find((c) => c.homeAway === "home") ?? {};
          const hCode = normalize((home.team as Record<string, unknown>)?.abbreviation as string ?? "");
          return hCode === finalRow.home_code;
        });

        if (finalEvent) {
          const comp = (finalEvent.competitions as Record<string, unknown>[])?.[0] ?? {};
          const competitors = (comp.competitors as Record<string, unknown>[]) ?? [];
          const homeComp = competitors.find((c) => c.homeAway === "home") ?? {};
          const awayComp = competitors.find((c) => c.homeAway === "away") ?? {};

          // ESPN marca al ganador con winner: true
          const homeWins =
            (homeComp.winner as boolean) === true ||
            finalRow.home_score > finalRow.away_score;

          const winnerComp = homeWins ? homeComp : awayComp;
          const loserComp  = homeWins ? awayComp  : homeComp;
          const winnerCode = normalize((winnerComp.team as Record<string, unknown>)?.abbreviation as string ?? "");
          const winnerName = (winnerComp.team as Record<string, unknown>)?.displayName as string ?? winnerCode;
          const loserCode  = normalize((loserComp.team as Record<string, unknown>)?.abbreviation as string ?? "");
          const loserName  = (loserComp.team as Record<string, unknown>)?.displayName as string ?? loserCode;
          const score = `${finalRow.home_score}-${finalRow.away_score}`;
          const conf  = CONMEBOL.has(winnerCode) ? "CONMEBOL" : "UEFA";

          await supabase.from("champion_2026").upsert(
            {
              id: 1,
              winner_code: winnerCode,
              winner_name: winnerName,
              runner_up_code: loserCode,
              runner_up_name: loserName,
              score,
              conf,
            },
            { onConflict: "id" },
          );
        }
      }
    }

    return new Response(JSON.stringify({ updated: rows.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
});
