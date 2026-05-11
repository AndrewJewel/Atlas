"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/language-context";

type StickerRow = {
  id: number; code: string; name: string; type: string;
  position: string | null; is_shiny: boolean; team_name: string | null; section: string;
};

const FLAG: Record<string, string> = {
  MEX:"mx",KOR:"kr",RSA:"za",CZE:"cz",CAN:"ca",SUI:"ch",QAT:"qa",BIH:"ba",
  BRA:"br",MAR:"ma",SCO:"gb-sct",HAI:"ht",USA:"us",PAR:"py",AUS:"au",TUR:"tr",
  GER:"de",ECU:"ec",CIV:"ci",CUW:"cw",NED:"nl",JPN:"jp",TUN:"tn",SWE:"se",
  BEL:"be",IRN:"ir",EGY:"eg",NZL:"nz",ESP:"es",URU:"uy",KSA:"sa",CPV:"cv",
  FRA:"fr",SEN:"sn",NOR:"no",IRQ:"iq",ARG:"ar",AUT:"at",ALG:"dz",JOR:"jo",
  POR:"pt",COL:"co",UZB:"uz",COD:"cd",ENG:"gb-eng",CRO:"hr",PAN:"pa",GHA:"gh",
  FWC:"",
};

const POS_COLOR: Record<string, string> = {
  GK:"#F59E0B", DEF:"#3B82F6", MID:"#22C55E", FWD:"#EF4444",
};

export default function TeamPage() {
  const { teamCode } = useParams<{ teamCode: string }>();
  const { user } = useUser();
  const { t } = useLanguage();
  const [stickers, setStickers] = useState<StickerRow[]>([]);
  const [quantities, setQuantities] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  const isFWC = teamCode === "FWC";
  const flag = FLAG[teamCode] ?? "";

  useEffect(() => {
    if (!user) return;
    const query = isFWC
      ? supabase.from("stickers").select("*").is("team_code", null).order("id")
      : supabase.from("stickers").select("*").eq("team_code", teamCode).order("id");

    Promise.all([
      query,
      supabase.from("user_stickers").select("sticker_id,quantity").eq("user_id", user.id),
    ]).then(([{ data: s }, { data: us }]) => {
      const stickerList = s ?? [];
      setStickers(stickerList);
      const ids = new Set(stickerList.map((x: StickerRow) => x.id));
      const m = new Map<number, number>();
      (us ?? []).forEach((r: { sticker_id: number; quantity: number }) => {
        if (ids.has(r.sticker_id)) m.set(r.sticker_id, r.quantity);
      });
      setQuantities(m);
      setLoading(false);
    });
  }, [user, teamCode, isFWC]);

  const toggle = useCallback(async (sticker: StickerRow) => {
    if (!user || saving !== null) return;
    const current = quantities.get(sticker.id) ?? 0;
    const next = current === 0 ? 1 : current === 1 ? 2 : 0;

    setSaving(sticker.id);
    setQuantities(prev => {
      const m = new Map(prev);
      m.set(sticker.id, next);
      return m;
    });

    await supabase.from("user_stickers").upsert(
      { user_id: user.id, sticker_id: sticker.id, quantity: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id,sticker_id" }
    );
    setSaving(null);
  }, [user, quantities, saving]);

  const owned = [...quantities.values()].filter(q => q >= 1).length;
  const total = stickers.length;
  const teamName = isFWC ? "Introducción + Museo FIFA" : (stickers[0]?.team_name ?? teamCode);

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", background:"var(--atlas-bg)", zIndex:55 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background:"var(--atlas-surface)", borderBottom:"1px solid var(--atlas-border)" }}>
        <Link href="/mas/panini" className="text-[22px] text-atlas-text leading-none">←</Link>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {flag ? (
            <img src={`https://flagcdn.com/w40/${flag}.png`} alt={teamName} width={32} height={22}
              className="rounded-sm flex-shrink-0 object-cover" style={{ height:22 }} />
          ) : (
            <span className="text-[22px] flex-shrink-0">⭐</span>
          )}
          <div className="min-w-0">
            <div style={{ fontFamily:"var(--font-display)" }} className="text-[18px] font-bold text-atlas-text tracking-tight truncate">
              {teamName}
            </div>
            {!isFWC && stickers[0] && (
              <div className="text-[11px] text-atlas-muted">{stickers[0].section}</div>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[16px] font-bold" style={{ color: owned===total && total>0?"#22C55E":"#F97316" }}>
            {owned}/{total}
          </div>
          <div className="text-[10px] text-atlas-dimmed">{t("pn_sticker_count")}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
        style={{ background:"var(--atlas-surface)", borderBottom:"1px solid var(--atlas-border)" }}>
        {[[t("pn_legend_empty"),"var(--atlas-surface2)","#4A5178"],[t("pn_legend_have"),"rgba(34,197,94,0.12)","#22C55E"],[t("pn_legend_dupe"),"rgba(249,115,22,0.12)","#F97316"]].map(([l,bg,c]) => (
          <div key={l} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm border" style={{ background:bg, borderColor:c }} />
            <span className="text-[10px]" style={{ color:c }}>{l}</span>
          </div>
        ))}
        <span className="text-[10px] text-atlas-dimmed ml-auto">{t("pn_legend_tap")}</span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3" style={{ minHeight:0 }}>
          <div className="grid gap-2" style={{ gridTemplateColumns:"repeat(4, 1fr)" }}>
            {stickers.map(s => {
              const qty = quantities.get(s.id) ?? 0;
              const isOwned = qty >= 1;
              const isDupe = qty >= 2;
              const isSaving = saving === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s)}
                  disabled={isSaving}
                  className="relative flex flex-col items-start p-2 rounded-xl text-left transition-all"
                  style={{
                    background: isDupe ? "rgba(249,115,22,0.12)" : isOwned ? "rgba(34,197,94,0.10)" : "var(--atlas-surface)",
                    border: `1.5px solid ${isDupe?"rgba(249,115,22,0.45)":isOwned?"rgba(34,197,94,0.45)":"var(--atlas-border)"}`,
                    opacity: isSaving ? 0.6 : 1,
                    minHeight: 72,
                  }}
                >
                  {/* Code */}
                  <div className="text-[9px] font-bold mb-0.5"
                    style={{ color: s.is_shiny ? "#FBBF24" : isDupe ? "#F97316" : isOwned ? "#22C55E" : "#4A5178" }}>
                    {s.code}{s.is_shiny ? " ✦" : ""}
                  </div>
                  {/* Name */}
                  <div className="text-[10px] font-semibold text-atlas-text leading-tight line-clamp-2 flex-1">
                    {s.name}
                  </div>
                  {/* Position badge */}
                  {s.position && (
                    <div className="mt-1 px-1 py-0.5 rounded text-[8px] font-bold"
                      style={{ background:`${POS_COLOR[s.position]}22`, color:POS_COLOR[s.position] }}>
                      {s.position}
                    </div>
                  )}
                  {/* Duplicate badge */}
                  {isDupe && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background:"#F97316" }}>
                      {qty}
                    </div>
                  )}
                  {/* Check for owned */}
                  {isOwned && !isDupe && (
                    <div className="absolute top-1 right-1 text-[10px]" style={{ color:"#22C55E" }}>✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
