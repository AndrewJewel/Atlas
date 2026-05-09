"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { AtlasWidget } from "@/components/atlas-widget";
import { useUser } from "@/hooks/use-user";
import { useMatchNotifications } from "@/hooks/use-match-notifications";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, authSession, profileLoaded } = useUser();
  const router = useRouter();

  useMatchNotifications(user?.team);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!profileLoaded) return;
    if (!authSession || !user) { router.replace("/"); return; }
  }, [profileLoaded, user, authSession, router]);

  // Spinner mientras carga sesión o perfil
  if (!profileLoaded) return (
    <div className="bg-atlas-bg min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
    </div>
  );

  // profileLoaded pero sin usuario → redirect en curso, no renderizar
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-atlas-bg relative">
      <main className="flex-1 flex flex-col pb-20">{children}</main>
      <BottomNav />
      <AtlasWidget user={user} />
    </div>
  );
}
