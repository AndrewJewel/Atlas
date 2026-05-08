"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserId, getUser, saveUser } from "@/lib/user-store";
import type { AtlasGroup } from "@/lib/types";

const AVATARS = [
  { emoji: "⭐", bg: "#F97316" },
  { emoji: "🦁", bg: "#EF4444" },
  { emoji: "🌟", bg: "#3B82F6" },
  { emoji: "⚡", bg: "#8B5CF6" },
  { emoji: "🔥", bg: "#F59E0B" },
  { emoji: "🎯", bg: "#22C55E" },
];

export default function JoinPage() {
  const router = useRouter();
  const { code } = useParams<{ code: string }>();

  const [group, setGroup] = useState<AtlasGroup | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const existingUser = getUser();
  const [name, setName] = useState("");
  const [avatarIdx, setAvatarIdx] = useState(0);

  useEffect(() => {
    fetch(`/api/groups?code=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setLoadError(d.error);
        else setGroup(d.group);
      })
      .catch(() => setLoadError("No se pudo cargar el grupo"))
      .finally(() => setLoading(false));
  }, [code]);

  async function handleJoin() {
    setJoining(true);
    setJoinError("");

    let user = getUser();
    if (!user && name.trim()) {
      user = { username: name.trim(), avatar: AVATARS[avatarIdx] };
      saveUser(user);
    }

    const uid = getUserId();
    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": uid },
      body: JSON.stringify({ code, username: user?.username, avatar: user?.avatar }),
    });
    const { error } = await res.json();
    setJoining(false);
    if (error) { setJoinError(error); return; }
    router.push("/grupos");
  }

  const canJoin = existingUser || name.trim().length > 0;

  if (loading) {
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
            {group?.members?.length ?? 0} {group?.members?.length === 1 ? "miembro" : "miembros"} · {code}
          </p>

          {/* Member avatars */}
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

        {/* Existing user → just confirm */}
        {existingUser ? (
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl mb-5"
            style={{ background: "#1A1F38", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
              style={{ background: existingUser.avatar.bg }}
            >
              {existingUser.avatar.emoji}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">{existingUser.username}</p>
              <p className="text-[12px] text-gray-500">Te vas a unir con este perfil</p>
            </div>
          </div>
        ) : (
          /* New user → quick profile setup */
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-gray-400 mb-2 tracking-widest uppercase">
              ¿Cómo te llamás?
            </label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre o apodo"
              className="w-full px-4 py-3 rounded-xl text-white text-[16px] outline-none mb-4"
              style={{ background: "#1A1F38", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <label className="block text-[11px] font-bold text-gray-400 mb-2 tracking-widest uppercase">
              Elegí tu avatar
            </label>
            <div className="flex gap-2 flex-wrap">
              {AVATARS.map((av, i) => (
                <button
                  key={i}
                  onClick={() => setAvatarIdx(i)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] transition-all"
                  style={{
                    background: av.bg,
                    outline: avatarIdx === i ? "2.5px solid #F97316" : "none",
                    outlineOffset: 2,
                  }}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {joinError && (
          <p className="text-red-400 text-[13px] text-center mb-3">{joinError}</p>
        )}

        <button
          onClick={handleJoin}
          disabled={!canJoin || joining}
          className="w-full py-4 rounded-xl text-white text-[17px] font-black"
          style={{
            background: canJoin ? "#F97316" : "#374151",
            fontFamily: "'Barlow Condensed',sans-serif",
            opacity: joining ? 0.7 : 1,
            letterSpacing: "0.04em",
          }}
        >
          {joining ? "Uniéndome..." : `Unirme a ${group?.name}`}
        </button>
      </div>
    </div>
  );
}
