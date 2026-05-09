"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { AtlasWidget } from "@/components/atlas-widget";
import { useUser } from "@/hooks/use-user";
import { useMatchNotifications } from "@/hooks/use-match-notifications";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, authSession, loaded } = useUser();
  const router = useRouter();

  useMatchNotifications(user?.team);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    // Solo redirigir cuando hay certeza de que no hay sesión activa
    if (!authSession) { router.replace("/"); return; }
    // Sesión existe pero perfil incompleto → onboarding
    if (loaded && authSession && !user) { router.replace("/"); return; }
  }, [loaded, user, authSession, router]);

  // Cargando auth (no sabemos si hay sesión todavía)
  if (!loaded) return (
    <div className="bg-atlas-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
    </div>
  );

  // Sesión confirmada pero perfil aún cargando
  if (!user) return (
    <div className="bg-atlas-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-atlas-bg relative">
      <main className="flex-1 flex flex-col pb-20">{children}</main>
      <BottomNav />
      <AtlasWidget user={user} />
    </div>
  );
}
