import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkOrigin } from "@/lib/cors";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const sb = adminClient();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const sb = adminClient();
  const body = await req.json().catch(() => ({}));
  const { code, username, avatar } = body;

  if (!code?.trim()) {
    return NextResponse.json({ error: "Código requerido" }, { status: 400 });
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

  const { data: group } = await sb
    .from("groups")
    .select("*, members:group_members(id, user_id, username, avatar, joined_at)")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (!group) {
    return NextResponse.json({ error: "Código inválido. Revisá y volvé a intentar." }, { status: 404 });
  }

  const alreadyIn = (group.members ?? []).some((m: { user_id: string }) => m.user_id === userId);
  if (!alreadyIn) {
    await sb.from("group_members").insert({
      group_id: group.id,
      user_id: userId,
      username: trimmedUsername,
      avatar: safeAvatar,
    });
  }

  const { data: updated } = await sb
    .from("groups")
    .select("*, members:group_members(id, user_id, username, avatar, joined_at)")
    .eq("id", group.id)
    .single();

  return NextResponse.json({ group: updated });
}
