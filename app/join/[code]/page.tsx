"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import type { AtlasGroup } from "@/lib/types";

export default function JoinPage() {
  const router = useRouter();
  const { code } = useParams<{ code: string }>();
  const { user, authSession, loaded } = useUser();

  const [group, setGroup] = useState<AtlasGroup | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Cargar preview del grupo (no requiere auth)
  useEffect(() => {
    fetch(`/api/groups?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setLoadError(d.error);
        else setGroup(d.group);
      })
      .catch(() => setLoadError("No se pudo cargar el grupo"))
      .finally(() => setLoading(false));
  }, [code]);

  async function handleJoin() {
    if (!user || !authSession) {
      router.push(`/?redirect=/join/${code}`);
      return;
    }
    setJoining(true);
    setJoinError("");

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify({ code, username: user.username, avatar: user.avatar }),
    });
    const { error } = await res.json();
    setJoining(false);
    if (error) { setJoinError(error); return; }
    router.push("/grupos");
  }

  if (loading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#090B19" }}>
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-8" style={{ background: "#090B19" }}>
        <span className="text-[56px]">😕</span>
        <p className="text-[16px] font-semibold text-white text-center">{loadError}</p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 rounded-xl text-white font-bold text-[15px]"
          style={{ background: "#F97316" }}
        >
          Ir a Atlas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#090B19" }}>
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[56px] mb-3">⚽</div>
          <p className="text-[16px] text-gray-400 mb-1">Te invitaron a</p>
          <h1
            className="text-[30px] font-black mb-2"
            style={{ fontFamily: "'Barlow Condensed',sans-serif", color: "#F97316" }}
          >
            {group?.name}
          </h1>
          <p className="text-[13px] text-gray-500">
            {group?.members?.length ?? 0}{" "}
            {group?.members?.length === 1 ? "miembro" : "miembros"} · {code}
          </p>

          {(group?.members?.length ?? 0) > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              {group!.members.slice(0, 5).map((m, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px]"
                  style={{ background: m.avatar?.bg ?? "#F97316" }}
                  title={m.username}
                >
                  {m.avatar?.emoji ?? "⭐"}
                </div>
              ))}
              {group!.members.length > 5 && (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "#1A1F38", color: "#8892B0" }}
                >
                  +{group!.members.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Perfil del usuario autenticado */}
        {user ? (
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl mb-5"
            style={{ background: "#1A1F38", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
              style={{ background: user.avatar.bg }}
            >
              {user.avatar.emoji}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">{user.username}</p>
              <p className="text-[12px] text-gray-500">Te vas a unir con este perfil</p>
            </div>
          </div>
        ) : (
          <div
            className="p-4 rounded-2xl mb-5 text-center"
            style={{ background: "#1A1F38", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <p className="text-[14px] text-atlas-primary font-semibold mb-1">Debes tener cuenta en Atlas</p>
            <p className="text-[12px] text-gray-400">Crear tu cuenta tarda 30 segundos.</p>
          </div>
        )}

        {joinError && (
          <p className="text-red-400 text-[13px] text-center mb-3">{joinError}</p>
        )}

        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full py-4 rounded-xl text-white text-[17px] font-black"
          style={{
            background: "#F97316",
            fontFamily: "'Barlow Condensed',sans-serif",
            opacity: joining ? 0.7 : 1,
            letterSpacing: "0.04em",
          }}
        >
          {joining
            ? "Uniéndome..."
            : user
            ? `Unirme a ${group?.name}`
            : "Crear cuenta para unirme"}
        </button>
      </div>
    </div>
  );
}
