"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Onboarding } from "@/components/onboarding";
import { useUser } from "@/hooks/use-user";

export default function RootPage() {
  const { user, loaded, completeOnboarding } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loaded && user) router.replace("/partidos");
  }, [loaded, user, router]);

  if (!loaded) return <div className="flex-1 bg-atlas-bg" />;
  if (user) return <div className="flex-1 bg-atlas-bg" />;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      <Onboarding
        onComplete={(u) => {
          completeOnboarding(u);
          router.replace("/partidos");
        }}
      />
    </div>
  );
}
