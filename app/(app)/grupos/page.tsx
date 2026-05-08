"use client";
import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { WC_GROUPS } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";

const GROUP_IDS = Object.keys(WC_GROUPS);

const MY_GROUP = {
  name: "Los Cracks 🔥",
  code: "ATL-7X2K",
  members: [
    { name: "Rodri", avatar: { emoji: "🦁", bg: "#F97316" } },
    { name: "Caro",  avatar: { emoji: "🌟", bg: "#3B82F6" } },
    { name: "Javi",  avatar: { emoji: "⚡", bg: "#EF4444" } },
    { name: "Tú",    avatar: { emoji: "⭐", bg: "#F97316" }, isMe: true },
  ],
};

export default function GruposPage() {
  const [activeGroup, setActiveGroup] = useState("A");

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title="Grupos" />
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">

        {/* My Group Card */}
        <div
          className="rounded-[18px] p-4 mb-5"
          style={{ background: "linear-gradient(135deg,#1A1F33,#141826)", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div style={{ fontFamily: "var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight">
                {MY_GROUP.name}
              </div>
              <div className="text-[12px] text-atlas-dimmed mt-0.5">Código: {MY_GROUP.code}</div>
            </div>
            <Link
              href="/grupos/chat"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-[13px] font-bold"
              style={{ background: "#F97316", fontFamily: "var(--font-sans)" }}
            >
              💬 Chat
            </Link>
          </div>

          <div className="flex gap-2 flex-wrap mb-3">
            {MY_GROUP.members.map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px]"
                  style={{ background: m.avatar.bg }}
                >
                  {m.avatar.emoji}
                </div>
                <span className="text-[11px] text-atlas-muted">{m.isMe ? "Tú" : m.name}</span>
              </div>
            ))}
          </div>

          <button
            className="w-full py-2.5 rounded-xl text-atlas-muted text-[13px] font-semibold"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.15)" }}
          >
            + Invitar amigos
          </button>
        </div>

        {/* Standings */}
        <div style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-3 tracking-tight">
          Tabla de posiciones
        </div>

        {/* Group Tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {GROUP_IDS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                fontFamily: "var(--font-display)",
                background: activeGroup === g ? "#F97316" : "#181B30",
                border: `1px solid ${activeGroup === g ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                color: activeGroup === g ? "#fff" : "#8892B0",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Standings Table */}
        <div
          className="rounded-2xl overflow-hidden mb-2"
          style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Header */}
          <div
            className="grid px-3.5 py-2.5"
            style={{ gridTemplateColumns: "24px minmax(0,1fr) repeat(8, 22px)", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 2 }}
          >
            {["#", "Club", "PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"].map((h, i) => (
              <span
                key={i}
                className="text-[9px] font-bold text-atlas-dimmed"
                style={{ textAlign: i === 0 || i > 1 ? "center" : "left" }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {WC_GROUPS[activeGroup].map((team, i) => (
            <div
              key={i}
              className="grid px-3.5 py-2 items-center transition-colors"
              style={{
                gridTemplateColumns: "24px minmax(0,1fr) repeat(8, 22px)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                borderLeft: i < 2 ? "3px solid #22C55E" : "3px solid transparent",
                gap: 2,
              }}
            >
              <span className="text-[11px] font-bold text-atlas-dimmed text-center">{i + 1}</span>
              <div className="flex items-center gap-1 min-w-0">
                <TeamFlag code={team.code} size="xs" shape="rounded" />
                <span className="text-[12px] font-medium text-atlas-text truncate">{team.name}</span>
              </div>
              {[team.pj, team.g, team.e, team.p, team.gf, team.gc, team.dg].map((v, j) => (
                <span key={j} className="text-[11px] text-atlas-muted text-center">{v}</span>
              ))}
              <span className="text-[12px] font-extrabold text-atlas-text text-center">{team.pts}</span>
            </div>
          ))}

          <div className="flex items-center gap-1.5 px-3.5 py-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#22C55E" }} />
            <span className="text-[11px] text-atlas-dimmed">Clasifican a octavos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
