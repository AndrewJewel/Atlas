"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { DEMO_MESSAGES } from "@/lib/data";
import type { Message } from "@/lib/types";

const MEMBERS = [
  { name: "Rodri",    avatar: { emoji: "🦁", bg: "#F97316" } },
  { name: "Caro",     avatar: { emoji: "🌟", bg: "#3B82F6" } },
  { name: "Javi",     avatar: { emoji: "⚡", bg: "#EF4444" } },
  { name: "Atlas IA", avatar: { emoji: "🤖", bg: "#F97316" }, isAtlas: true },
];

export default function ChatPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [atlasTyping, setAtlasTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollDown = () => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  };
  useEffect(() => { scrollDown(); }, [messages, atlasTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !user) return;
    setInput("");

    const myMsg: Message = {
      id: Date.now(),
      user: user.username,
      avatar: user.avatar,
      content: text,
      time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
      type: "me",
    };
    setMessages((p) => [...p, myMsg]);

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
        const data = await res.json();
        setAtlasTyping(false);
        setMessages((p) => [
          ...p,
          {
            id: Date.now() + 1,
            user: "Atlas IA",
            avatar: { emoji: "🤖", bg: "#F97316" },
            content: data.reply,
            time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
            type: "atlas",
          },
        ]);
      } catch {
        setAtlasTyping(false);
      }
    }
  };

  const allMembers = [
    ...MEMBERS,
    { name: user?.username ?? "Tú", avatar: user?.avatar ?? { emoji: "⭐", bg: "#F97316" }, isMe: true },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: "#090B19" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "#0F1228", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/grupos" className="text-[22px] text-atlas-text leading-none">←</Link>
        <div className="flex-1">
          <div style={{ fontFamily: "var(--font-display)" }} className="text-[18px] font-bold text-atlas-text tracking-tight">
            Los Cracks 🔥
          </div>
          <div className="text-[12px] text-atlas-primary">{allMembers.length} miembros · Atlas IA activo</div>
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className="text-[22px] text-atlas-muted">⋯</button>
      </div>

      {/* Atlas Info Banner */}
      {showInfo && (
        <div className="flex-shrink-0 px-4 py-2.5 bg-atlas-glass" style={{ borderBottom: "1px solid rgba(249,115,22,0.2)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px]" style={{ background: "#F97316" }}>🤖</div>
            <div>
              <div className="text-[13px] font-bold text-atlas-text">Atlas IA está en el grupo</div>
              <div className="text-[12px] text-atlas-muted">Mencionalo con @Atlas o hazle preguntas</div>
            </div>
          </div>
        </div>
      )}

      {/* Members Strip */}
      <div
        className="flex gap-3 px-4 py-2.5 overflow-x-auto flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {allMembers.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[16px]" style={{ background: m.avatar.bg }}>
              {m.avatar.emoji}
            </div>
            <span className="text-[10px] text-atlas-dimmed">{"isMe" in m && m.isMe ? "Tú" : m.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2.5">
        {messages.map((msg) => {
          const isMe = msg.type === "me";
          const isAtlas = msg.type === "atlas";
          return (
            <div key={msg.id} className={`flex gap-2 items-end ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[16px] flex-shrink-0"
                  style={{ background: msg.avatar?.bg ?? "#333" }}>
                  {msg.avatar?.emoji}
                </div>
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
                    background: isMe ? "#F97316" : isAtlas ? "#1A1F33" : "#181B30",
                    border: isAtlas ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.06)",
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
            <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[16px] flex-shrink-0" style={{ background: "#F97316" }}>🤖</div>
            <div className="px-3.5 py-2.5 rounded-[18px_18px_18px_4px]" style={{ background: "#1A1F33", border: "1px solid rgba(249,115,22,0.3)" }}>
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
        style={{ background: "#0F1228", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <input
          className="flex-1 px-4 py-2.5 rounded-3xl text-atlas-text text-[14px] outline-none"
          style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-sans)" }}
          placeholder="Mensaje… o @Atlas para preguntar"
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
