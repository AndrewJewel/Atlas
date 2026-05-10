"use client";
export const dynamic = "force-dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/lib/supabase";
import type { Message, Avatar } from "@/lib/types";
import AgentAvatar from "@/components/AgentAvatar";

type DbRow = {
  id: string;
  user_id: string;
  username: string;
  avatar: string;
  content: string;
  created_at: string;
};

function rowToMessage(row: DbRow, myId: string): Message {
  let avatar: Avatar = { emoji: "⭐", bg: "#F97316" };
  try { avatar = JSON.parse(row.avatar) as Avatar; } catch { /* keep default */ }
  return {
    id: row.id,
    user: row.username,
    avatar,
    content: row.content,
    time: new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type: row.user_id === myId ? "me" : "user",
  };
}

export default function ChatPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { t } = useLanguage();
  const groupName = searchParams.get("name") ?? "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [atlasTyping, setAtlasTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const myId = user?.id ?? "";

  const scrollDown = () => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  };
  useEffect(() => { scrollDown(); }, [messages, atlasTyping]);

  useEffect(() => {
    if (!groupId) return;

    supabase
      .from("chat_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data) setMessages((data as DbRow[]).map((r) => rowToMessage(r, myId)));
      });

    const channel = supabase
      .channel(`chat_${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `group_id=eq.${groupId}` },
        (payload) => {
          const msg = rowToMessage(payload.new as DbRow, myId);
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || !user || !groupId) return;
    setInput("");

    const { data } = await supabase
      .from("chat_messages")
      .insert({
        group_id: groupId,
        user_id: myId,
        username: user.username,
        avatar: JSON.stringify(user.avatar),
        content: text,
      })
      .select()
      .single();

    if (data) {
      setMessages((prev) => {
        const msg = rowToMessage(data as DbRow, myId);
        return prev.some((m) => m.id === msg.id) ? prev : [...prev, msg];
      });
    }

    const mentionsAtlas =
      text.toLowerCase().includes("atlas") ||
      text.includes("?") ||
      /quién|quien|gana|mundial|jugador|equipo/i.test(text);

    if (mentionsAtlas) {
      setAtlasTyping(true);
      try {
        const res = await fetch("/api/atlas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, context: "group-chat" }),
        });
        const resData = await res.json();
        setAtlasTyping(false);
        setMessages((p) => [
          ...p,
          {
            id: `atlas-${Date.now()}`,
            user: "Atlas IA",
            avatar: { emoji: "🤖", bg: "#F97316" },
            content: resData.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "atlas",
          },
        ]);
      } catch {
        setAtlasTyping(false);
      }
    }
  }, [input, user, myId, groupId]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: "var(--atlas-bg)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "var(--atlas-surface)", borderBottom: "1px solid var(--atlas-border)" }}
      >
        <Link href="/grupos" className="text-[22px] text-atlas-text leading-none">←</Link>
        <div className="flex-1">
          <div style={{ fontFamily: "var(--font-display)" }} className="text-[18px] font-bold text-atlas-text tracking-tight">
            {groupName || "Chat"} 💬
          </div>
          <div className="text-[12px] text-atlas-primary">{t("atlas_active")}</div>
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className="text-[22px] text-atlas-muted">⋯</button>
      </div>

      {/* Atlas Info Banner */}
      {showInfo && (
        <div className="flex-shrink-0 px-4 py-2.5 bg-atlas-glass" style={{ borderBottom: "1px solid rgba(249,115,22,0.2)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px]" style={{ background: "#F97316" }}>🤖</div>
            <div>
              <div className="text-[13px] font-bold text-atlas-text">{t("atlas_in_group")}</div>
              <div className="text-[12px] text-atlas-muted">{t("mention_atlas")}</div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 opacity-40">
            <span className="text-[40px]">💬</span>
            <span className="text-[14px] text-atlas-muted">{t("first_to_write")}</span>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.type === "me";
          const isAtlas = msg.type === "atlas";
          return (
            <div key={msg.id} className={`flex gap-2 items-end ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                isAtlas ? (
                  <div style={{ width: 30, height: 30, overflow: "hidden", flexShrink: 0, borderRadius: 9 }}>
                    <div style={{ transform: "scale(0.375)", transformOrigin: "top left", width: 80, height: 80 }}>
                      <AgentAvatar size={80} status="idle" name={msg.id} />
                    </div>
                  </div>
                ) : (
                  <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[16px] flex-shrink-0"
                    style={{ background: msg.avatar?.bg ?? "#333" }}>
                    {msg.avatar?.emoji}
                  </div>
                )
              )}
              <div style={{ maxWidth: "72%" }}>
                {!isMe && (
                  <div className="text-[11px] font-bold mb-1 pl-1"
                    style={{ color: isAtlas ? "#F97316" : "#8892B0" }}>
                    {msg.user}{isAtlas && " ✦"}
                  </div>
                )}
                <div
                  className="px-3.5 py-2.5 text-[14px] text-atlas-text leading-snug"
                  style={{
                    background: isMe ? "#F97316" : isAtlas ? "var(--atlas-surface3)" : "var(--atlas-surface2)",
                    border: isAtlas ? "1px solid rgba(249,115,22,0.3)" : "1px solid var(--atlas-border)",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {msg.content}
                </div>
                <div className={`text-[10px] text-atlas-dimmed mt-0.5 ${isMe ? "text-right pr-1" : "pl-1"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        {atlasTyping && (
          <div className="flex gap-2 items-end justify-start">
            <div style={{ width: 30, height: 30, overflow: "hidden", flexShrink: 0, borderRadius: 9 }}>
              <div style={{ transform: "scale(0.375)", transformOrigin: "top left", width: 80, height: 80 }}>
                <AgentAvatar size={80} status="thinking" name="atlas-typing" />
              </div>
            </div>
            <div className="px-3.5 py-2.5 rounded-[18px_18px_18px_4px]" style={{ background: "var(--atlas-surface3)", border: "1px solid rgba(249,115,22,0.3)" }}>
              <div className="flex gap-1 items-center">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="flex gap-2 px-3.5 py-2.5 flex-shrink-0"
        style={{ background: "var(--atlas-surface)", borderTop: "1px solid var(--atlas-border)" }}
      >
        <input
          className="flex-1 px-4 py-2.5 rounded-3xl text-atlas-text text-[14px] outline-none"
          style={{ background: "var(--atlas-surface2)", border: "1px solid var(--atlas-glass-md)", fontFamily: "var(--font-sans)" }}
          placeholder={t("chat_placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white text-[20px] flex-shrink-0 transition-opacity"
          style={{ background: "#F97316", opacity: input.trim() ? 1 : 0.4 }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
