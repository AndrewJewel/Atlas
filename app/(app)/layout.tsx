"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { AtlasWidget } from "@/components/atlas-widget";
import { useUser } from "@/hooks/use-user";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !user) router.replace("/");
  }, [loaded, user, router]);

  if (!loaded || !user) return <div className="bg-atlas-bg min-h-screen" />;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-atlas-bg relative">
      <main className="flex-1 flex flex-col pb-20">{children}</main>
      <BottomNav />
      <AtlasWidget user={user} />
    </div>
  );
}
