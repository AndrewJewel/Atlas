import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function genCode() {
  return "ATL-" + Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

// Cliente admin (service role) — solo para operaciones de servidor
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Verifica el JWT del header Authorization y devuelve el user.id
// Usa el cliente admin para validar el token con seguridad.
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const sb = adminClient();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

// GET /api/groups?code=ATL-XXXX  → preview público (sin auth)
// GET /api/groups                 → grupos del usuario autenticado
export async function GET(req: NextRequest) {
  const sb = adminClient();
  const code = req.nextUrl.searchParams.get("code");

  if (code) {
    const { data: group } = await sb
      .from("groups")
      .select("id, name, code, members:group_members(id, user_id, username, avatar, joined_at)")
      .eq("code", code.toUpperCase())
      .single();
    if (!group) return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
    return NextResponse.json({ group });
  }

  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ groups: [] });

  const { data: memberships } = await sb
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId);

  if (!memberships?.length) return NextResponse.json({ groups: [] });

  const ids = memberships.map((m: { group_id: string }) => m.group_id);
  const { data: groups } = await sb
    .from("groups")
    .select("*, members:group_members(id, user_id, username, avatar, joined_at)")
    .in("id", ids)
    .order("created_at", { ascending: false });

  return NextResponse.json({ groups: groups ?? [] });
}

// POST /api/groups → crear grupo (requiere JWT)
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const sb = adminClient();
  const body = await req.json().catch(() => ({}));
  const { name, username, avatar } = body;

  if (!name?.trim() || !username) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  let code = genCode();
  for (let i = 0; i < 5; i++) {
    const { data } = await sb.from("groups").select("id").eq("code", code).maybeSingle();
    if (!data) break;
    code = genCode();
  }

  const { data: group, error } = await sb
    .from("groups")
    .insert({ name: name.trim(), code, created_by: userId })
    .select()
    .single();

  if (error || !group) {
    return NextResponse.json({ error: "No se pudo crear el grupo" }, { status: 500 });
  }

  await sb.from("group_members").insert({ group_id: group.id, user_id: userId, username, avatar });

  const member = {
    id: crypto.randomUUID(),
    user_id: userId,
    username,
    avatar,
    joined_at: new Date().toISOString(),
  };
  return NextResponse.json({ group: { ...group, members: [member] } });
}
