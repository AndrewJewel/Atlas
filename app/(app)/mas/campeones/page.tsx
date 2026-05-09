"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from "react";
import Link from "next/link";
import { CHAMPIONS, PALMARES } from "@/lib/data";

const TABS = [
  { key: "ediciones", label: "Ediciones" },
  { key: "palmares",  label: "Palmarés" },
] as const;

const CONF_FILTERS = [
  { key: "all",      label: "Todos" },
  { key: "CONMEBOL", label: "CONMEBOL" },
  { key: "UEFA",     label: "UEFA" },
] as const;

const DECADES = ["Todos", "1930", "1950", "1960", "1970", "1980", "1990", "2000", "2010", "2020"] as const;

export default function CampeonesPage() {
  const [tab, setTab]   = useState<"ediciones" | "palmares">("ediciones");
  const [conf, setConf] = useState<"all" | "CONMEBOL" | "UEFA">("all");
  const [decade, setDecade] = useState<string>("Todos");

  const filtered = useMemo(() => {
    return CHAMPIONS.filter((c) => {
      if (conf !== "all" && c.winner.conf !== conf) return false;
      if (decade !== "Todos") {
        const d = parseInt(decade);
        if (c.year < d || c.year >= d + 10) return false;
      }
      return true;
    });
  }, [conf, decade]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: "#090B19" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-3 pb-3 flex-shrink-0"
        style={{ background: "#0F1228", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/mas" className="text-[22px] text-atlas-text leading-none">←</Link>
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

      {/* Filters — only on Ediciones tab */}
      {tab === "ediciones" && (
        <div className="flex-shrink-0 px-4 pt-3 pb-2 flex flex-col gap-2" style={{ background: "#090B19" }}>
          {/* Confederación */}
          <div className="flex gap-2">
            {CONF_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setConf(key)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all"
                style={{
                  background: conf === key ? "#F97316" : "#0F1228",
                  border: `1px solid ${conf === key ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                  color: conf === key ? "#fff" : "#8892B0",
                  fontFamily: "var(--font-display)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Década */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DECADES.map((d) => (
              <button
                key={d}
                onClick={() => setDecade(d)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all"
                style={{
                  background: decade === d ? "#181B30" : "transparent",
                  border: `1px solid ${decade === d ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                  color: decade === d ? "#F97316" : "#8892B0",
                  fontFamily: "var(--font-display)",
                }}
              >
                {d === "Todos" ? d : `${d}s`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        {tab === "ediciones" && (
          <>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <span className="text-[40px]">🔍</span>
                <span className="text-[13px] text-atlas-muted text-center">Sin resultados para ese filtro</span>
              </div>
            )}
            {filtered.map((c) => (
              <div
                key={c.year}
                className="rounded-2xl p-4 mb-2.5"
                style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div style={{ fontFamily: "var(--font-display)" }} className="text-[28px] font-black text-atlas-primary tracking-tight leading-none">
                    {c.year}
                  </div>
                  <span
                    className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      background: c.winner.conf === "CONMEBOL" ? "rgba(249,115,22,0.12)" : "rgba(99,102,241,0.12)",
                      color: c.winner.conf === "CONMEBOL" ? "#F97316" : "#818CF8",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {c.winner.conf}
                  </span>
                </div>
                <div className="text-[10px] text-atlas-dimmed tracking-widest mb-2.5">📍 {c.host.toUpperCase()}</div>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[28px]">{c.winner.flag}</span>
                    <span style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text tracking-tight">
                      {c.winner.name}
                    </span>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-xl text-atlas-text font-bold"
                    style={{ fontFamily: "var(--font-display)", fontSize: 17, background: "#181B30" }}
                  >
                    {c.score}
                  </div>
                </div>
                <div className="text-[12px] text-atlas-dimmed">vs {c.runnerUp} · FINAL</div>
              </div>
            ))}
            {filtered.some((c) => c.year === 1950) && (
              <p className="text-[10px] text-atlas-dimmed text-center pb-2">
                † 1950: fase final en grupo (partido decisivo Uruguay 2-1 Brasil)
              </p>
            )}
          </>
        )}

        {tab === "palmares" && (
          <div className="flex flex-col gap-1.5 pt-1">
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
                    <span key={j} className="text-[14px]">🏆</span>
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
