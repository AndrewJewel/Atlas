import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isMatchLocked, savePrediction } from "@/lib/predictions";
import { MATCHES } from "@/lib/data";
import { checkOrigin } from "@/lib/cors";
import type { PredWinner } from "@/lib/predictions";

// Cliente admin (service role) — bypasa RLS, con validaciones server-side
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function getUserId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const sb = adminClient();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

// POST /api/predictions — guarda una predicción con validación server-side del kickoff
export async function POST(req: NextRequest) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { matchId, homeScore, awayScore, predictedWinner } = body as {
    matchId: number;
    homeScore: number | null;
    awayScore: number | null;
    predictedWinner: PredWinner;
  };

  if (!matchId || !predictedWinner) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Buscar el partido en los datos estáticos
  const match = MATCHES.find((m) => m.id === matchId);
  if (!match) return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });

  // Validar lock server-side — esta es la validación crítica de seguridad
  if (isMatchLocked(match)) {
    return NextResponse.json({ error: "Partido bloqueado" }, { status: 403 });
  }

  const result = await savePrediction(userId, matchId, homeScore ?? null, awayScore ?? null, predictedWinner);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ ok: true });
}
