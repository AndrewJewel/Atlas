import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
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

let vapidConfigured = false;
function ensureVapid() {
  if (vapidConfigured) return;
  const subject = process.env.VAPID_SUBJECT || "mailto:atlas@example.com";
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
  const priv = process.env.VAPID_PRIVATE_KEY!;
  if (!pub || !priv) throw new Error("VAPID keys missing");
  webpush.setVapidDetails(subject, pub, priv);
  vapidConfigured = true;
}

// POST /api/push/notify-message
// body: { groupId, groupName, senderName, content }
export async function POST(req: NextRequest) {
  const originError = checkOrigin(req);
  if (originError) return originError;

  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { groupId, groupName, senderName, content } = body as {
    groupId?: string; groupName?: string; senderName?: string; content?: string;
  };

  if (!groupId || !content) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const sb = adminClient();

  // Verify sender is a member of this group
  const { data: membership } = await sb
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "No eres miembro de este grupo" }, { status: 403 });
  }

  try { ensureVapid(); } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  // Recipients = group members other than the sender
  const { data: members } = await sb
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId)
    .neq("user_id", userId);

  const recipientIds = [...new Set((members ?? []).map((m: { user_id: string }) => m.user_id))];
  if (recipientIds.length === 0) return NextResponse.json({ ok: true, sent: 0 });

  const { data: subs } = await sb
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .in("user_id", recipientIds);

  if (!subs?.length) return NextResponse.json({ ok: true, sent: 0 });

  const truncated = content.length > 120 ? content.slice(0, 117) + "..." : content;
  const titleRaw = groupName ? `${senderName ?? "Alguien"} · ${groupName}` : (senderName ?? "Nuevo mensaje");
  const title = titleRaw.length > 80 ? titleRaw.slice(0, 77) + "..." : titleRaw;
  const payload = JSON.stringify({
    title,
    body: truncated,
    icon: "/icon-192.png",
    badge: "/badge.png",
    tag: `chat-${groupId}`,
    url: `/grupos/chat/${groupId}${groupName ? `?name=${encodeURIComponent(groupName)}` : ""}`,
  });

  const expired: string[] = [];
  const results = await Promise.allSettled(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) expired.push(s.endpoint);
        throw err;
      }
    })
  );

  if (expired.length) {
    await sb.from("push_subscriptions").delete().in("endpoint", expired);
  }

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ ok: true, sent, expired: expired.length });
}
