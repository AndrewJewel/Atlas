"use client";
import { useEffect } from "react";
import { MATCHES } from "@/lib/data";
import type { Team } from "@/lib/types";

const NOTIFY_BEFORE_MS = 30 * 60 * 1000;

export function useMatchNotifications(team: Team | undefined) {
  useEffect(() => {
    if (!team || typeof window === "undefined") return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (!("serviceWorker" in navigator)) return;

    const now = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];

    const upcoming = MATCHES.filter(
      (m) => m.home.code === team.code || m.away.code === team.code
    );

    upcoming.forEach((match) => {
      const matchTime = new Date(`${match.date}T${match.time}:00-06:00`).getTime();
      const notifyAt = matchTime - NOTIFY_BEFORE_MS;
      const delay = notifyAt - now;

      if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return;

      const t = setTimeout(async () => {
        const reg = await navigator.serviceWorker.ready.catch(() => null);
        if (!reg) return;
        reg.showNotification("⚽ Atlas — Tu selección juega hoy", {
          body: `${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} · En 30 min`,
          icon: "/icon.svg",
          tag: `match-${match.id}`,
          data: { url: "/partidos" },
        } as NotificationOptions);
      }, delay);

      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [team]);
}
