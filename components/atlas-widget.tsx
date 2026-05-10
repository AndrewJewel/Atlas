"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import type { User } from "@/lib/types";
import AgentAvatar from "@/components/AgentAvatar";

interface Message {
  role: "user" | "atlas";
  content: string;
  time: string;
}

const SUGGESTIONS = [
  "¿Quién gana el Mundial?",
  "Head-to-head México vs Argentina",
  "Grupos más difíciles",
  "¿Cómo funciona el formato?",
];

export function AtlasWidget({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const fabX = useMotionValue(0);
  const fabY = useMotionValue(0);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Restaurar posición guardada (solo en cliente)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("atlas-fab-pos");
      if (saved) {
        const { x, y } = JSON.parse(saved) as { x: number; y: number };
        fabX.set(x);
        fabY.set(y);
      }
    } catch { /* sin persistencia */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "atlas",
      content: `¡Hola ${user.username}! Soy Atlas IA 🤖⚽\nFaltan 35 días para el Mundial. ¿En qué te puedo ayudar?`,
      time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");

    const userMsg: Message = {
      role: "user",
      content: msg,
      time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((p) => [...p, userMsg]);
    setTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "atlas" ? "assistant" : "user",
        content: m.content,
      }));
      history.push({ role: "user", content: msg });

      const res = await fetch("/api/atlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history, context: "widget" }),
      });
      const data = await res.json();
      setTyping(false);
      setMessages((p) => [
        ...p,
        {
          role: "atlas",
          content: data.reply ?? "Tuve un pequeño problema técnico. ¡Pero el fútbol sigue! 💪",
          time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setTyping(false);
      setMessages((p) => [
        ...p,
        {
          role: "atlas",
          content: "Tuve un pequeño problema técnico. ¡Pero el fútbol sigue! Intenta de nuevo 💪",
          time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  return (
    <>
      {/* FAB — arrastrable */}
      {!open && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.08}
          style={{
            x: fabX,
            y: fabY,
            position: "fixed",
            bottom: "6rem",
            right: "1rem",
            zIndex: 50,
            touchAction: "none",
            cursor: "grab",
          }}
          whileDrag={{ cursor: "grabbing", scale: 1.08 }}
          onDragStart={() => {
            dragStartPos.current = { x: fabX.get(), y: fabY.get() };
          }}
          onDragEnd={() => {
            const moved =
              Math.abs(fabX.get() - dragStartPos.current.x) +
              Math.abs(fabY.get() - dragStartPos.current.y);
            if (moved < 6) {
              // Fue un tap, no un drag
              setOpen(true);
            }
            try {
              localStorage.setItem(
                "atlas-fab-pos",
                JSON.stringify({ x: fabX.get(), y: fabY.get() })
              );
            } catch { /* sin persistencia */ }
          }}
        >
          <AgentAvatar size={60} status="idle" name="atlas-fab" />
        </motion.div>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-20 left-3 right-3 z-50 flex flex-col rounded-[20px] overflow-hidden"
          style={{
            background: "#0F1228",
            border: "1px solid rgba(249,115,22,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            maxHeight: "70vh",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#1A1F33,#141826)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2.5">
              <div style={{ width: 38, height: 38, overflow: "hidden", flexShrink: 0, borderRadius: 11 }}>
                <div style={{ transform: "scale(0.475)", transformOrigin: "top left", width: 80, height: 80 }}>
                  <AgentAvatar size={80} status="idle" name="atlas-widget-header" />
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)" }} className="text-[17px] font-bold text-atlas-text">
                  Atlas IA
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-atlas-success">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#22C55E" }} />
                  En línea
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-[30px] h-[30px] rounded-lg text-atlas-muted text-[14px] flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex flex-col gap-2 p-3 overflow-y-auto" style={{ minHeight: 120, maxHeight: 300 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-1.5 items-end ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "atlas" && (
                  <div style={{ width: 26, height: 26, overflow: "hidden", flexShrink: 0, borderRadius: 8 }}>
                    <div style={{ transform: "scale(0.325)", transformOrigin: "top left", width: 80, height: 80 }}>
                      <AgentAvatar size={80} status="idle" name={`atlas-msg-${i}`} />
                    </div>
                  </div>
                )}
                <div>
                  <div
                    className="px-3 py-2 text-[13px] text-atlas-text leading-snug"
                    style={{
                      background: m.role === "user" ? "#F97316" : "#1A1F33",
                      border: m.role === "atlas" ? "1px solid rgba(249,115,22,0.25)" : "none",
                      borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      maxWidth: 200,
                      whiteSpace: "pre-line",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {m.content}
                  </div>
                  <div className={`text-[10px] text-atlas-dimmed mt-0.5 px-0.5 ${m.role === "user" ? "text-right" : "text-left"}`}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1.5 items-end justify-start">
                <div style={{ width: 26, height: 26, overflow: "hidden", flexShrink: 0, borderRadius: 8 }}>
                  <div style={{ transform: "scale(0.325)", transformOrigin: "top left", width: 80, height: 80 }}>
                    <AgentAvatar size={80} status="thinking" name="atlas-widget-typing" />
                  </div>
                </div>
                <div className="px-3 py-2 rounded-[16px_16px_16px_4px] flex gap-1 items-center" style={{ background: "#1A1F33", border: "1px solid rgba(249,115,22,0.25)" }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold text-atlas-primary transition-opacity"
                    style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", fontFamily: "var(--font-sans)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div
            className="flex gap-2 px-3 py-2.5 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <input
              className="flex-1 px-3.5 py-2 rounded-2xl text-atlas-text text-[13px] outline-none"
              style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-sans)" }}
              placeholder="Pregúntame sobre el Mundial…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={() => send()}
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[18px] flex-shrink-0 transition-opacity"
              style={{ background: "#F97316", opacity: input.trim() ? 1 : 0.4 }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
