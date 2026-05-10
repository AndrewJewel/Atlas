"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type Status = "unsupported" | "denied" | "default" | "subscribed" | "loading";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function getAuthHeader(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }
    : { "Content-Type": "application/json" };
}

export function usePush() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    if (!reg) { setStatus("default"); return; }
    const sub = await reg.pushManager.getSubscription();
    setStatus(sub ? "subscribed" : (Notification.permission === "granted" ? "default" : "default"));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const subscribe = useCallback(async () => {
    if (typeof window === "undefined") return;
    setBusy(true);
    try {
      const perm = Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();
      if (perm !== "granted") {
        setStatus(perm === "denied" ? "denied" : "default");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) { console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY missing"); return; }

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
      const headers = await getAuthHeader();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers,
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });

      setStatus("subscribed");
    } finally {
      setBusy(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      if (!reg) return;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) { setStatus("default"); return; }
      const endpoint = sub.endpoint;
      await sub.unsubscribe();
      const headers = await getAuthHeader();
      await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(endpoint)}`, {
        method: "DELETE",
        headers,
      });
      setStatus("default");
    } finally {
      setBusy(false);
    }
  }, []);

  return { status, busy, subscribe, unsubscribe, refresh };
}
