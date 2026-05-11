import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkOrigin } from "@/lib/cors";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function genCode() {
  return "ATL-" + Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

// NOTA: El rate limit in-memory anterior (Map por IP) se eliminó porque no funciona
// cross-instancia en serverless. Para rate limit por IP se necesitaría Upstash Redis.
// La protección anti-enumeración ahora recae en requerir autenticación (userId válido)
// + el límite de creación de grupos por usuario (ver POST).

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

// GET /api/groups?code=ATL-XXXX  → buscar grupo por código (requiere auth + rate limit)
// GET /api/groups                 → grupos del usuario autenticado
export async function GET(req: NextRequest) {
  const sb = adminClient();
  const code = req.nextUrl.searchParams.get("code");

  if (code) {
    // Requerir autenticación para evitar enumeración por fuerza bruta
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

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

// DELETE /api/groups?id=<groupId> → eliminar grupo (solo el creador)
export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const groupId = req.nextUrl.searchParams.get("id");
  if (!groupId) return NextResponse.json({ error: "Falta id" }, { status: 400 });

  const sb = adminClient();

  // Verify requester is the creator
  const { data: group } = await sb.from("groups").select("created_by").eq("id", groupId).single();
  if (!group) return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
  if (group.created_by !== userId) return NextResponse.json({ error: "Solo el creador puede eliminar el grupo" }, { status: 403 });

  // Delete in dependency order
  await sb.from("chat_messages").delete().eq("group_id", groupId);
  await sb.from("group_members").delete().eq("group_id", groupId);
  await sb.from("groups").delete().eq("id", groupId);

  return NextResponse.json({ ok: true });
}

// POST /api/groups → crear grupo (requiere JWT)
export async function POST(req: NextRequest) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const sb = adminClient();

  // ── Cap diario de creación de grupos (máx 5/día por usuario) ─────────────
  // Reemplaza el Map in-memory anterior (no funciona cross-instancia serverless).
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const { count: groupsToday, error: countError } = await sb
    .from("groups")
    .select("id", { count: "exact", head: true })
    .eq("created_by", userId)
    .gte("created_at", today);

  if (!countError && (groupsToday ?? 0) >= 5) {
    return NextResponse.json(
      { error: "Límite diario alcanzado (5 grupos/día). Vuelve mañana." },
      { status: 429 }
    );
  }
  // ─────────────────────────────────────────────────────────────────────────

  const body = await req.json().catch(() => ({}));
  const { name, username, avatar } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 1 || trimmedName.length > 50) {
    return NextResponse.json({ error: "El nombre debe tener entre 1 y 50 caracteres" }, { status: 400 });
  }

  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Username requerido" }, { status: 400 });
  }
  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
    return NextResponse.json({ error: "Username debe tener entre 3 y 24 caracteres" }, { status: 400 });
  }

  const HEX_COLOR = /^#[0-9A-Fa-f]{3,8}$/;
  const safeAvatar = {
    emoji: typeof avatar?.emoji === "string" ? avatar.emoji.slice(0, 8) : "⭐",
    bg: typeof avatar?.bg === "string" && HEX_COLOR.test(avatar.bg) ? avatar.bg : "#F97316",
  };

  let code = genCode();
  for (let i = 0; i < 5; i++) {
    const { data } = await sb.from("groups").select("id").eq("code", code).maybeSingle();
    if (!data) break;
    code = genCode();
  }

  const { data: group, error } = await sb
    .from("groups")
    .insert({ name: trimmedName, code, created_by: userId })
    .select()
    .single();

  if (error || !group) {
    return NextResponse.json({ error: "No se pudo crear el grupo" }, { status: 500 });
  }

  await sb.from("group_members").insert({ group_id: group.id, user_id: userId, username: trimmedUsername, avatar: safeAvatar });

  const member = {
    id: crypto.randomUUID(),
    user_id: userId,
    username: trimmedUsername,
    avatar: safeAvatar,
    joined_at: new Date().toISOString(),
  };
  return NextResponse.json({ group: { ...group, members: [member] } });
}
