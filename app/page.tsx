"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Onboarding } from "@/components/onboarding";
import { useUser } from "@/hooks/use-user";
import type { Team } from "@/lib/types";

export default function RootPage() {
  const { user, authSession, profileLoaded, completeProfile } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (profileLoaded && user) router.replace("/partidos");
  }, [profileLoaded, user, router]);

  if (!profileLoaded) return (
    <div className="min-h-screen bg-atlas-bg flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
    </div>
  );
  if (user) return <div className="flex-1 bg-atlas-bg" />;

  // authSession existe pero sin perfil → viene de Google OAuth
  const startAt = authSession && !user ? 2 : 0;

  async function handleComplete(username: string, team?: Team) {
    await completeProfile(username, team);
    router.replace("/partidos");
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      <Onboarding
        startAtStep={startAt as 0 | 2}
        onComplete={handleComplete}
      />
    </div>
  );
}
