"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo, useEffect } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { CHAMPIONS, PALMARES, WC_TEAMS } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Champion } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";
import { TrophyIcon } from "@/components/TrophyIcon";

const TAB_KEYS = ["ediciones", "palmares"] as const;
const CONF_KEYS = ["all", "CONMEBOL", "UEFA"] as const;

const selectStyle: CSSProperties = {
  background: "var(--atlas-surface)",
  border: "1px solid var(--atlas-border-md)",
  color: "var(--atlas-text)",
  borderRadius: 10,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238892B0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 28,
  cursor: "pointer",
  width: "100%",
};

export default function CampeonesPage() {
  const { t } = useLanguage();
  const [tab, setTab]       = useState<"ediciones" | "palmares">("ediciones");
  const [conf, setConf]     = useState<"all" | "CONMEBOL" | "UEFA">("all");
  const [decade, setDecade] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [champion2026, setChampion2026] = useState<Champion | null>(null);

  useEffect(() => {
    supabase
      .from("champion_2026")
      .select("*")
      .limit(1)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const row = data[0];
        const team = WC_TEAMS.find((tm) => tm.code === row.winner_code);
        setChampion2026({
          year: 2026,
          host: "EE. UU. / Canadá / México",
          winner: {
            name: team?.name ?? row.winner_name,
            flag: team?.flag ?? "🏳️",
            conf: row.conf as "CONMEBOL" | "UEFA",
          },
          runnerUp: WC_TEAMS.find((tm) => tm.code === row.runner_up_code)?.name ?? row.runner_up_name,
          score: row.score,
        });
      });
  }, []);

  const allChampions = useMemo(() => {
    return champion2026 ? [champion2026, ...CHAMPIONS] : CHAMPIONS;
  }, [champion2026]);

  // Normaliza "Alemania Occ." → "Alemania" para filtros y dropdown
  const normalizeCountry = (name: string) =>
    name === "Alemania Occ." ? "Alemania" : name;

  // Lista única de países ganadores para el selector
  const countries = useMemo(() => {
    const seen = new Map<string, string>();
    allChampions.forEach((c) => {
      const name = normalizeCountry(c.winner.name);
      if (!seen.has(name)) seen.set(name, c.winner.flag);
    });
    return Array.from(seen.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allChampions]);

  // Décadas disponibles
  const decades = useMemo(() => {
    const ds = new Set<number>();
    allChampions.forEach((c) => ds.add(Math.floor(c.year / 10) * 10));
    return Array.from(ds).sort((a, b) => a - b);
  }, [allChampions]);

  const filtered = useMemo(() => {
    return allChampions.filter((c) => {
      if (conf !== "all" && c.winner.conf !== conf) return false;
      if (decade !== "all" && Math.floor(c.year / 10) * 10 !== parseInt(decade)) return false;
      if (country !== "all" && normalizeCountry(c.winner.name) !== country) return false;
      return true;
    });
  }, [allChampions, conf, decade, country]);

  return (
    <div className="flex flex-col flex-1" style={{ background: "var(--atlas-bg)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-3 pb-3 flex-shrink-0"
        style={{ background: "var(--atlas-surface)", borderBottom: "1px solid var(--atlas-border)" }}
      >
        <Link href="/mas" className="text-[22px] text-atlas-text leading-none">←</Link>
        <span style={{ fontFamily: "var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight">
          {t("champions_label")}
        </span>
      </div>

      {/* Tabs */}
      <div
        className="flex flex-shrink-0"
        style={{ background: "var(--atlas-surface)", borderBottom: "1px solid var(--atlas-border)" }}
      >
        {TAB_KEYS.map((key) => (
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
            {key === "ediciones" ? t("editions_tab") : t("palmares_tab")}
          </button>
        ))}
      </div>

      {/* Filters — solo en Ediciones */}
      {tab === "ediciones" && (
        <div className="flex-shrink-0 px-4 pt-3 pb-2.5 flex flex-col gap-2.5" style={{ background: "var(--atlas-bg)" }}>
          {/* Confederación — chips */}
          <div className="flex gap-2">
            {CONF_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setConf(key)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all"
                style={{
                  background: conf === key ? "#F97316" : "var(--atlas-surface)",
                  border: `1px solid ${conf === key ? "#F97316" : "var(--atlas-glass-md)"}`,
                  color: conf === key ? "#fff" : "#8892B0",
                  fontFamily: "var(--font-display)",
                }}
              >
                {key === "all" ? t("filter_all") : key}
              </button>
            ))}
          </div>

          {/* Década + País — dropdowns en fila */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <select
                value={decade}
                onChange={(e) => setDecade(e.target.value)}
                style={{ ...selectStyle, fontFamily: "var(--font-display)" }}
              >
                <option value="all">{t("all_decades")}</option>
                {decades.map((d) => (
                  <option key={d} value={String(d)}>{d}s</option>
                ))}
              </select>
            </div>
            <div className="flex-1 relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ ...selectStyle, fontFamily: "var(--font-display)" }}
              >
                <option value="all">{t("all_countries")}</option>
                {countries.map(([name, flag]) => (
                  <option key={name} value={name}>{flag} {name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        {tab === "ediciones" && (
          <>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <span className="text-[40px]">🔍</span>
                <span className="text-[13px] text-atlas-muted text-center">{t("no_results")}</span>
              </div>
            )}
            {filtered.map((c) => (
              <div
                key={c.year}
                className="rounded-2xl p-4 mb-2.5"
                style={{
                  background: c.year === 2026 ? "rgba(249,115,22,0.06)" : "var(--atlas-surface)",
                  border: c.year === 2026
                    ? "1px solid rgba(249,115,22,0.3)"
                    : "1px solid var(--atlas-border-card)",
                }}
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
                    style={{ fontFamily: "var(--font-display)", fontSize: 17, background: "var(--atlas-surface2)" }}
                  >
                    {c.score}
                  </div>
                </div>
                <div className="text-[12px] text-atlas-dimmed">vs {c.runnerUp} · {t("final_label")}</div>
              </div>
            ))}
            {filtered.some((c) => c.year === 1950) && (
              <p className="text-[10px] text-atlas-dimmed text-center pb-2">
                {t("note_1950")}
              </p>
            )}
          </>
        )}

        {tab === "palmares" && (
          <div className="flex flex-col gap-1.5 pt-1">
            {PALMARES.map((entry, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "var(--atlas-surface)" }}
              >
                <span style={{ fontFamily: "var(--font-display)" }} className="w-6 text-[16px] font-bold text-atlas-dimmed text-center">
                  {i + 1}
                </span>
                <span className="text-[24px]">{entry.flag}</span>
                <span className="flex-1 text-[14px] font-semibold text-atlas-text">{entry.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: entry.titles }).map((_, j) => (
                    <TrophyIcon key={j} size={16} color="#F97316" />
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-display)" }} className="w-5 text-[22px] font-extrabold text-atlas-primary text-right">
                  {entry.titles}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
