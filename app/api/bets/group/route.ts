import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isMatchLocked } from "@/lib/predictions";
import { MATCHES } from "@/lib/data";
import { checkOrigin } from "@/lib/cors";

// Cliente admin (service role) — bypasa RLS, pero con validaciones server-side
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

// POST /api/bets/group — guarda una apuesta de grupo con validación server-side del kickoff
export async function POST(req: NextRequest) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { matchId, groupId, homeScore, awayScore, predictedWinner } = body;

  if (!matchId || !groupId || !predictedWinner) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Buscar el partido en los datos estáticos
  const match = MATCHES.find((m) => m.id === matchId);
  if (!match) return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });

  // Validar lock server-side — esta es la validación crítica de seguridad
  if (isMatchLocked(match)) {
    return NextResponse.json({ error: "El partido ya comenzó" }, { status: 403 });
  }

  const sb = adminClient();

  // Verificar membresía del usuario en el grupo
  const { data: membership } = await sb
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "No eres miembro de este grupo" }, { status: 403 });
  }

  // Guardar apuesta via service role (con validaciones ya verificadas arriba)
  const { error } = await sb.from("group_match_bets").upsert(
    {
      user_id: userId,
      group_id: groupId,
      match_id: matchId,
      home_score: homeScore ?? null,
      away_score: awayScore ?? null,
      predicted_winner: predictedWinner,
    },
    { onConflict: "group_id,match_id,user_id", ignoreDuplicates: false }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
