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

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  const auth = req.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const sb = adminClient();
  const { data: { user }, error: authErr } = await sb.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const userId = user.id;

  // Transferir propiedad de grupos a otro miembro (el más antiguo).
  // Si el creador es el único miembro, el grupo se elimina por CASCADE al borrar el usuario.
  const { data: ownedGroups } = await sb
    .from("groups")
    .select("id")
    .eq("created_by", userId);

  for (const g of (ownedGroups ?? []) as { id: string }[]) {
    const { data: heir } = await sb
      .from("group_members")
      .select("user_id")
      .eq("group_id", g.id)
      .neq("user_id", userId)
      .order("joined_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (heir) {
      await sb.from("groups").update({ created_by: (heir as { user_id: string }).user_id }).eq("id", g.id);
    }
  }

  const { error } = await sb.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: "Error al eliminar cuenta" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
