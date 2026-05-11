"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Onboarding } from "@/components/onboarding";
import { InstallPrompt } from "@/components/install-prompt";
import { useUser } from "@/hooks/use-user";
import type { Team } from "@/lib/types";

export default function RootPage() {
  const { user, authSession, profileLoaded, completeProfile } = useUser();
  const router = useRouter();
  const [showInstall, setShowInstall] = useState<string | null>(null);

  useEffect(() => {
    if (profileLoaded && user && !showInstall) router.replace("/partidos");
  }, [profileLoaded, user, router, showInstall]);

  if (!profileLoaded) return (
    <div className="min-h-screen bg-atlas-bg flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
    </div>
  );
  if (user && !showInstall) return <div className="flex-1 bg-atlas-bg" />;

  // authSession existe pero sin perfil → viene de Google OAuth
  const startAt = authSession && !user ? 2 : 0;

  function isAlreadyInstalled(): boolean {
    if (typeof window === "undefined") return false;
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    return standalone || iosStandalone;
  }

  async function handleComplete(username: string, team?: Team) {
    await completeProfile(username, team);
    if (isAlreadyInstalled()) {
      router.replace("/partidos");
      return;
    }
    setShowInstall(username);
  }

  function handleInstallDone() {
    setShowInstall(null);
    router.replace("/partidos");
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      {showInstall ? (
        <InstallPrompt username={showInstall} onDone={handleInstallDone} />
      ) : (
        <Onboarding
          startAtStep={startAt as 0 | 2}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
