"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";

type StickerState = "owned" | "dup" | "missing";

const SECTIONS = [
  { label: "México 🇲🇽",    stickers: Array.from({ length: 20 }, (_, i): StickerState => i < 14 ? "owned" : i < 16 ? "dup" : "missing") },
  { label: "Argentina 🇦🇷",  stickers: Array.from({ length: 20 }, (_, i): StickerState => i < 11 ? "owned" : i < 13 ? "dup" : "missing") },
  { label: "Brasil 🇧🇷",     stickers: Array.from({ length: 20 }, (_, i): StickerState => i < 16 ? "owned" : i < 18 ? "dup" : "missing") },
  { label: "Francia 🇫🇷",    stickers: Array.from({ length: 20 }, (_, i): StickerState => i < 8 ? "owned" : i < 10 ? "dup" : "missing") },
];

const TOTAL = 640;
const OWNED = 287;
const DUP   = 89;
const PCT   = Math.round((OWNED / TOTAL) * 100);

const FILTERS = [
  { key: "all",     label: "Todas"    },
  { key: "owned",   label: "Tengo"    },
  { key: "dup",     label: "Repetidas" },
  { key: "missing", label: "Faltan"   },
] as const;

export default function PaniniPage() {
  const [filter, setFilter] = useState<StickerState | "all">("all");

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: "var(--atlas-bg)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "var(--atlas-surface)", borderBottom: "1px solid var(--atlas-border)" }}
      >
        <Link href="/mas" className="text-[22px] text-atlas-text">←</Link>
        <span style={{ fontFamily: "var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight">
          Álbum Panini
        </span>
      </div>

      {/* Progress */}
      <div
        className="px-4 py-4 flex-shrink-0"
        style={{ background: "var(--atlas-surface)", borderBottom: "1px solid var(--atlas-border)" }}
      >
        <div className="flex justify-around mb-3.5">
          {[
            { val: OWNED, label: "TENGO",     color: "#22C55E" },
            { val: TOTAL - OWNED, label: "FALTAN",    color: "#EF4444" },
            { val: DUP,   label: "REPETIDAS", color: "#F97316" },
          ].map(({ val, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span style={{ fontFamily: "var(--font-display)", color }} className="text-[28px] font-extrabold">
                {val}
              </span>
              <span className="text-[11px] text-atlas-dimmed">{label}</span>
            </div>
          ))}
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "var(--atlas-surface2)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${PCT}%`, background: "linear-gradient(90deg,#F97316,#FB923C)" }}
          />
        </div>
        <p className="text-center text-[12px] text-atlas-muted">{PCT}% del álbum completado</p>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 px-4 py-3 flex-shrink-0 overflow-x-auto">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{
              background: filter === key ? "#F97316" : "var(--atlas-surface2)",
              border: `1px solid ${filter === key ? "#F97316" : "var(--atlas-glass-md)"}`,
              color: filter === key ? "#fff" : "#8892B0",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sticker Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {SECTIONS.map((sec, si) => {
          const visible = sec.stickers.filter((s) => filter === "all" || s === filter);
          if (!visible.length) return null;
          return (
            <div key={si} className="mb-4">
              <div style={{ fontFamily: "var(--font-display)" }} className="text-[16px] font-bold text-atlas-text mb-2">
                {sec.label}
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
                {visible.map((state, j) => (
                  <div
                    key={j}
                    className="rounded-[6px] flex items-center justify-center"
                    style={{
                      aspectRatio: "0.75",
                      background: state === "owned" ? "rgba(34,197,94,0.13)" : state === "dup" ? "rgba(249,115,22,0.13)" : "var(--atlas-surface2)",
                      border: `1.5px solid ${state === "owned" ? "rgba(34,197,94,0.44)" : state === "dup" ? "rgba(249,115,22,0.44)" : "var(--atlas-border)"}`,
                    }}
                  >
                    <span className="text-[8px] font-bold" style={{
                      color: state === "owned" ? "#22C55E" : state === "dup" ? "#F97316" : "#4A5178",
                    }}>
                      {state === "owned" ? "✓" : state === "dup" ? "×2" : "?"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
