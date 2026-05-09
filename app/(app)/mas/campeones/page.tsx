"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { CHAMPIONS, PALMARES } from "@/lib/data";

const TABS = [
  { key: "ediciones", label: "Ediciones" },
  { key: "palmares",  label: "Palmarés" },
] as const;

export default function CampeonesPage() {
  const [tab, setTab] = useState<"ediciones" | "palmares">("ediciones");

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: "#090B19" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "#0F1228", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/mas" className="text-[22px] text-atlas-text">←</Link>
        <span style={{ fontFamily: "var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight">
          Campeones históricos
        </span>
      </div>

      {/* Tabs */}
      <div
        className="flex flex-shrink-0"
        style={{ background: "#0F1228", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 py-3 text-[13px] font-bold tracking-wide transition-all"
            style={{
              fontFamily: "var(--font-display)",
              color: tab === key ? "#F97316" : "#4A5178",
              borderBottom: tab === key ? "2px solid #F97316" : "2px solid transparent",
              background: "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        {tab === "ediciones" &&
          CHAMPIONS.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 mb-2.5"
              style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div style={{ fontFamily: "var(--font-display)" }} className="text-[28px] font-black text-atlas-primary tracking-tight">
                {c.year}
              </div>
              <div className="text-[10px] text-atlas-dimmed tracking-widest mb-2">📍 {c.host.toUpperCase()}</div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-[28px]">{c.winner.flag}</span>
                  <span style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text tracking-tight">
                    {c.winner.name}
                  </span>
                </div>
                <div
                  className="px-3 py-1.5 rounded-xl text-atlas-text font-bold"
                  style={{ fontFamily: "var(--font-display)", fontSize: 18, background: "#181B30" }}
                >
                  {c.score}
                </div>
              </div>
              <div className="text-[12px] text-atlas-dimmed">vs {c.runnerUp} · FINAL</div>
            </div>
          ))
        }

        {tab === "palmares" && (
          <div className="flex flex-col gap-1.5">
            {PALMARES.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "#0F1228" }}
              >
                <span style={{ fontFamily: "var(--font-display)" }} className="w-6 text-[16px] font-bold text-atlas-dimmed text-center">
                  {i + 1}
                </span>
                <span className="text-[24px]">{t.flag}</span>
                <span className="flex-1 text-[14px] font-semibold text-atlas-text">{t.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.titles }).map((_, j) => (
                    <span key={j} className="text-[16px]">🏆</span>
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-display)" }} className="w-5 text-[22px] font-extrabold text-atlas-primary text-right">
                  {t.titles}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
