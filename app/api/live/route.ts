import { NextResponse } from "next/server";

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export const revalidate = 60;

interface EspnCompetitor {
  homeAway: "home" | "away";
  score: string;
  team: { abbreviation: string; displayName: string };
}

interface EspnEvent {
  id: string;
  date: string;
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: { name: string; shortDetail: string };
  };
  competitions: Array<{ competitors: EspnCompetitor[] }>;
}

export async function GET() {
  try {
    const res = await fetch(ESPN_URL, {
      next: { revalidate: 60 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return NextResponse.json({ matches: [] });

    const data = await res.json();
    const events: EspnEvent[] = data.events ?? [];

    const matches = events.map((event) => {
      const comp = event.competitions?.[0];
      const home = comp?.competitors?.find((c) => c.homeAway === "home");
      const away = comp?.competitors?.find((c) => c.homeAway === "away");
      const statusName = event.status?.type?.name ?? "";

      return {
        espnId: event.id,
        homeCode: home?.team?.abbreviation?.toUpperCase() ?? "",
        awayCode: away?.team?.abbreviation?.toUpperCase() ?? "",
        homeName: home?.team?.displayName ?? "",
        awayName: away?.team?.displayName ?? "",
        homeScore: parseInt(home?.score ?? "0") || 0,
        awayScore: parseInt(away?.score ?? "0") || 0,
        status: statusName.includes("IN_PROGRESS")
          ? "live"
          : statusName.includes("FINAL") || statusName.includes("FULL_TIME")
          ? "finished"
          : "scheduled",
        minute: event.status?.type?.shortDetail ?? "",
        date: event.date?.slice(0, 10) ?? "",
      };
    });

    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ matches: [] });
  }
}
