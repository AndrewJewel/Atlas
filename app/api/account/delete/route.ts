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

  const { error } = await sb.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Error al eliminar cuenta" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
