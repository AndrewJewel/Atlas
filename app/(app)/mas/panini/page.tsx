"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/language-context";

type StickerRow = {
  id: number; code: string; name: string;
  team_code: string | null; team_name: string | null;
  type: string; is_shiny: boolean; section: string;
};

type TeamCard = {
  team_code: string; team_name: string; section: string;
  flag: string; total: number; owned: number; dupes: number;
};

const FLAG: Record<string, string> = {
  MEX:"mx",KOR:"kr",RSA:"za",CZE:"cz",CAN:"ca",SUI:"ch",QAT:"qa",BIH:"ba",
  BRA:"br",MAR:"ma",SCO:"gb-sct",HAI:"ht",USA:"us",PAR:"py",AUS:"au",TUR:"tr",
  GER:"de",ECU:"ec",CIV:"ci",CUW:"cw",NED:"nl",JPN:"jp",TUN:"tn",SWE:"se",
  BEL:"be",IRN:"ir",EGY:"eg",NZL:"nz",ESP:"es",URU:"uy",KSA:"sa",CPV:"cv",
  FRA:"fr",SEN:"sn",NOR:"no",IRQ:"iq",ARG:"ar",AUT:"at",ALG:"dz",JOR:"jo",
  POR:"pt",COL:"co",UZB:"uz",COD:"cd",ENG:"gb-eng",CRO:"hr",PAN:"pa",GHA:"gh",
};

const GROUPS = ["GRUPO A","GRUPO B","GRUPO C","GRUPO D","GRUPO E","GRUPO F",
                 "GRUPO G","GRUPO H","GRUPO I","GRUPO J","GRUPO K","GRUPO L"];

export default function PaniniPage() {
  const { user } = useUser();
  const { t } = useLanguage();
  const [stickers, setStickers] = useState<StickerRow[]>([]);
  const [owned, setOwned] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"owned"|"missing">("all");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("stickers").select("id,code,name,team_code,team_name,type,is_shiny,section").order("id"),
      supabase.from("user_stickers").select("sticker_id,quantity").eq("user_id", user.id),
    ]).then(([{ data: s }, { data: us }]) => {
      setStickers(s ?? []);
      const m = new Map<number, number>();
      (us ?? []).forEach((r: { sticker_id: number; quantity: number }) => m.set(r.sticker_id, r.quantity));
      setOwned(m);
      setLoading(false);
    });
  }, [user]);

  const fwcStickers = useMemo(() => stickers.filter(s => !s.team_code), [stickers]);
  const fwcOwned = useMemo(() => fwcStickers.filter(s => (owned.get(s.id) ?? 0) >= 1).length, [fwcStickers, owned]);

  const teams = useMemo<TeamCard[]>(() => {
    const map = new Map<string, TeamCard>();
    stickers.forEach(s => {
      if (!s.team_code) return;
      const key = s.team_code;
      if (!map.has(key)) {
        map.set(key, { team_code: s.team_code, team_name: s.team_name ?? s.team_code, section: s.section, flag: FLAG[s.team_code] ?? "", total: 0, owned: 0, dupes: 0 });
      }
      const t = map.get(key)!;
      t.total++;
      const qty = owned.get(s.id) ?? 0;
      if (qty >= 1) t.owned++;
      if (qty >= 2) t.dupes++;
    });
    return Array.from(map.values());
  }, [stickers, owned]);

  const filteredTeams = useMemo(() => {
    if (filter === "all") return teams;
    if (filter === "owned") return teams.filter(t => t.owned === t.total);
    return teams.filter(t => t.owned < t.total);
  }, [teams, filter, owned]);

  const totalOwned = useMemo(() => [...owned.values()].filter(q => q >= 1).length, [owned]);
  const totalDupes = useMemo(() => [...owned.values()].filter(q => q >= 2).length, [owned]);
  const total = stickers.length;
  const pct = total > 0 ? Math.round((totalOwned / total) * 100) : 0;

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", background:"var(--atlas-bg)", zIndex:55 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background:"var(--atlas-surface)", borderBottom:"1px solid var(--atlas-border)" }}>
        <Link href="/mas" className="text-[22px] text-atlas-text leading-none">←</Link>
        <span style={{ fontFamily:"var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight flex-1">
          {t("pn_title")}
        </span>
        <Link href="/mas/panini/intercambios" className="text-[13px] font-semibold px-3 py-1.5 rounded-xl"
          style={{ background:"rgba(249,115,22,0.12)", color:"#F97316", border:"1px solid rgba(249,115,22,0.25)" }}>
          {t("pn_trades_btn")}
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="px-4 py-3 flex-shrink-0" style={{ background:"var(--atlas-surface)", borderBottom:"1px solid var(--atlas-border)" }}>
            <div className="flex justify-around mb-3">
              {[
                { val: totalOwned, label: t("pn_stat_have"),    color: "#22C55E" },
                { val: total - totalOwned, label: t("pn_stat_missing"), color: "#EF4444" },
                { val: totalDupes, label: t("pn_stat_dupes"),   color: "#F97316" },
              ].map(({ val, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span style={{ fontFamily:"var(--font-display)", color }} className="text-[26px] font-extrabold">{val}</span>
                  <span className="text-[10px] text-atlas-dimmed tracking-wide">{label}</span>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background:"var(--atlas-surface2)" }}>
              <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:"linear-gradient(90deg,#F97316,#FB923C)" }} />
            </div>
            <p className="text-center text-[11px] text-atlas-muted">{pct}% {t("pn_progress")} · {totalOwned}/{total} {t("pn_stickers")}</p>
          </div>

          {/* Filters + Repetidos link */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 flex-shrink-0 overflow-x-auto">
            {(["all","owned","missing"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                style={{
                  background: filter===f ? "#F97316" : "var(--atlas-surface2)",
                  color: filter===f ? "#fff" : "#8892B0",
                  border:`1px solid ${filter===f?"#F97316":"var(--atlas-glass-md)"}`,
                }}>
                {f==="all"?t("pn_filter_all"):f==="owned"?t("pn_filter_owned"):t("pn_filter_missing")}
              </button>
            ))}
            <Link href="/mas/panini/repetidos"
              className="flex-shrink-0 ml-auto px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background:"rgba(249,115,22,0.12)", color:"#F97316", border:"1px solid rgba(249,115,22,0.25)" }}>
              {t("pn_dupes_link")} ({totalDupes})
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ minHeight:0 }}>

            {/* FWC Section */}
            <Link href="/mas/panini/FWC">
              <div className="flex items-center gap-3 p-3 rounded-2xl mb-4"
                style={{ background:"var(--atlas-surface)", border:"1px solid rgba(249,115,22,0.25)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
                  style={{ background:"linear-gradient(135deg,#F97316,#FBBF24)" }}>⭐</div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-atlas-text">{t("pn_fwc_title")}</div>
                  <div className="text-[11px] text-atlas-muted mt-0.5">{t("pn_fwc_sub")}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[16px] font-bold" style={{ color: fwcOwned === fwcStickers.length ? "#22C55E" : "#F97316" }}>
                    {fwcOwned}/{fwcStickers.length}
                  </div>
                  <div className="w-14 h-1.5 rounded-full mt-1" style={{ background:"var(--atlas-surface2)" }}>
                    <div className="h-full rounded-full" style={{ width:`${fwcStickers.length>0?Math.round(fwcOwned/fwcStickers.length*100):0}%`, background:"#F97316" }} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Teams by group */}
            {GROUPS.map(group => {
              const groupTeams = filteredTeams.filter(t => t.section === group);
              if (!groupTeams.length) return null;
              return (
                <div key={group} className="mb-4">
                  <div className="text-[11px] font-bold text-atlas-muted tracking-widest mb-2 uppercase">{group}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {groupTeams.map(t => (
                      <Link key={t.team_code} href={`/mas/panini/${t.team_code}`}>
                        <div className="flex items-center gap-2.5 p-3 rounded-xl"
                          style={{ background:"var(--atlas-surface)", border:`1px solid ${t.owned===t.total?"rgba(34,197,94,0.3)":"var(--atlas-border)"}` }}>
                          {t.flag ? (
                            <img src={`https://flagcdn.com/w40/${t.flag}.png`} alt={t.team_name} width={32} height={22}
                              className="rounded-sm flex-shrink-0 object-cover" style={{ height:22 }} />
                          ) : (
                            <div className="w-8 h-5 rounded-sm flex-shrink-0" style={{ background:"var(--atlas-surface2)" }} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-bold text-atlas-text truncate">{t.team_name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="flex-1 h-1 rounded-full" style={{ background:"var(--atlas-surface2)" }}>
                                <div className="h-full rounded-full transition-all"
                                  style={{ width:`${Math.round(t.owned/t.total*100)}%`, background: t.owned===t.total?"#22C55E":"#F97316" }} />
                              </div>
                              <span className="text-[10px] font-semibold flex-shrink-0"
                                style={{ color: t.owned===t.total?"#22C55E":"#8892B0" }}>{t.owned}/{t.total}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
