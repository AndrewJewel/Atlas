"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Onboarding } from "@/components/onboarding";
import { useUser } from "@/hooks/use-user";
import type { Team } from "@/lib/types";

export default function RootPage() {
  const { user, authSession, loaded, completeProfile } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loaded && user) router.replace("/partidos");
  }, [loaded, user, router]);

  if (!loaded) return <div className="flex-1 bg-atlas-bg" />;
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
