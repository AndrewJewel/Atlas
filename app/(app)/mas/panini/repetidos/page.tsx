"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/language-context";

type DupeRow = {
  sticker_id: number; quantity: number;
  sticker: { code: string; name: string; team_code: string | null; team_name: string | null; position: string | null; };
};

const FLAG: Record<string, string> = {
  MEX:"mx",KOR:"kr",RSA:"za",CZE:"cz",CAN:"ca",SUI:"ch",QAT:"qa",BIH:"ba",
  BRA:"br",MAR:"ma",SCO:"gb-sct",HAI:"ht",USA:"us",PAR:"py",AUS:"au",TUR:"tr",
  GER:"de",ECU:"ec",CIV:"ci",CUW:"cw",NED:"nl",JPN:"jp",TUN:"tn",SWE:"se",
  BEL:"be",IRN:"ir",EGY:"eg",NZL:"nz",ESP:"es",URU:"uy",KSA:"sa",CPV:"cv",
  FRA:"fr",SEN:"sn",NOR:"no",IRQ:"iq",ARG:"ar",AUT:"at",ALG:"dz",JOR:"jo",
  POR:"pt",COL:"co",UZB:"uz",COD:"cd",ENG:"gb-eng",CRO:"hr",PAN:"pa",GHA:"gh",
};

export default function RepetidosPage() {
  const { user } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  const [dupes, setDupes] = useState<DupeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [creating, setCreating] = useState<number | null>(null);
  const [requestCode, setRequestCode] = useState("");
  const [offerError, setOfferError] = useState("");
  const [allStickers, setAllStickers] = useState<{ id: number; code: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("user_stickers")
        .select("sticker_id, quantity, sticker:stickers(code,name,team_code,team_name,position)")
        .eq("user_id", user.id)
        .gte("quantity", 2),
      supabase.from("stickers").select("id,code"),
    ]).then(([{ data: d }, { data: s }]) => {
      setDupes((d ?? []) as unknown as DupeRow[]);
      setAllStickers(s ?? []);
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(() => {
    if (!searchCode) return dupes;
    const q = searchCode.toLowerCase();
    return dupes.filter(d => d.sticker.code.toLowerCase().includes(q) || d.sticker.name.toLowerCase().includes(q));
  }, [dupes, searchCode]);

  async function createOffer(offeredStickerId: number) {
    if (!user || !requestCode.trim()) { setOfferError(t("pn_offer_enter_code")); return; }
    const target = allStickers.find(s => s.code.toLowerCase() === requestCode.trim().toLowerCase());
    if (!target) { setOfferError(t("pn_offer_not_found").replace("{code}", requestCode)); return; }
    if (target.id === offeredStickerId) { setOfferError(t("pn_offer_self")); return; }

    setOfferError("");
    await supabase.from("trade_offers").insert({
      from_user_id: user.id,
      from_username: user.username,
      offered_sticker_id: offeredStickerId,
      requested_sticker_id: target.id,
    });
    setCreating(null);
    setRequestCode("");
    router.push("/mas/panini/intercambios");
  }

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", background:"var(--atlas-bg)", zIndex:55 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background:"var(--atlas-surface)", borderBottom:"1px solid var(--atlas-border)" }}>
        <Link href="/mas/panini" className="text-[22px] text-atlas-text leading-none">←</Link>
        <span style={{ fontFamily:"var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight flex-1">
          {t("pn_dupes_title")} ({dupes.length})
        </span>
        <Link href="/mas/panini/intercambios" className="text-[13px] font-semibold px-3 py-1.5 rounded-xl"
          style={{ background:"rgba(249,115,22,0.12)", color:"#F97316", border:"1px solid rgba(249,115,22,0.25)" }}>
          {t("pn_trades_title")}
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 flex-shrink-0" style={{ borderBottom:"1px solid var(--atlas-border)" }}>
        <input
          className="w-full px-3.5 py-2 rounded-2xl text-atlas-text text-[13px] outline-none"
          style={{ background:"var(--atlas-surface)", border:"1px solid var(--atlas-glass-md)", fontFamily:"var(--font-sans)" }}
          placeholder={t("pn_search_placeholder")}
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
          <span className="text-[40px]">🔁</span>
          <span className="text-[14px] text-atlas-muted">{t("pn_no_dupes")}</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ minHeight:0 }}>
          {filtered.map(d => {
            const tc = d.sticker.team_code;
            const flag = tc ? FLAG[tc] : null;
            const excess = d.quantity - 1;
            const isCreating = creating === d.sticker_id;

            return (
              <div key={d.sticker_id}>
                <div className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background:"var(--atlas-surface)", border:"1px solid var(--atlas-border)" }}>
                  {/* Flag */}
                  <div className="flex-shrink-0">
                    {flag ? (
                      <Image src={`https://flagcdn.com/w40/${flag}.png`} alt={tc ?? ""} width={32} height={22}
                        className="rounded-sm object-cover" style={{ height:22 }} />
                    ) : (
                      <div className="w-8 h-5 rounded-sm" style={{ background:"rgba(249,115,22,0.15)" }}>
                        <span className="text-[10px] flex items-center justify-center h-full">⭐</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-atlas-primary">{d.sticker.code}</div>
                    <div className="text-[13px] font-semibold text-atlas-text truncate">{d.sticker.name}</div>
                    <div className="text-[11px] text-atlas-muted">{d.sticker.team_name ?? t("pn_special")}</div>
                  </div>
                  {/* Excess badge */}
                  <div className="text-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                      style={{ background:"#F97316" }}>+{excess}</div>
                    <div className="text-[9px] text-atlas-dimmed mt-0.5">{t("pn_extra")}</div>
                  </div>
                  {/* Offer button */}
                  <button
                    onClick={() => { setCreating(isCreating ? null : d.sticker_id); setRequestCode(""); setOfferError(""); }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
                    style={{
                      background: isCreating ? "#F97316" : "rgba(249,115,22,0.12)",
                      color: isCreating ? "#fff" : "#F97316",
                      border:`1px solid rgba(249,115,22,${isCreating?"0.8":"0.3"})`,
                    }}>
                    {isCreating ? t("pn_cancel_offer") : t("pn_offer_trade")}
                  </button>
                </div>

                {/* Offer form */}
                {isCreating && (
                  <div className="mt-1 p-3 rounded-2xl" style={{ background:"rgba(249,115,22,0.06)", border:"1px solid rgba(249,115,22,0.2)" }}>
                    <div className="text-[12px] text-atlas-muted mb-2">
                      {t("pn_offer_hint")} <span className="text-atlas-primary font-bold">ARG-20</span>)
                    </div>
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        className="flex-1 px-3 py-2 rounded-xl text-[13px] text-atlas-text outline-none uppercase"
                        style={{ background:"var(--atlas-surface)", border:"1px solid var(--atlas-glass-md)", fontFamily:"var(--font-sans)" }}
                        placeholder={t("pn_offer_placeholder")}
                        value={requestCode}
                        onChange={e => { setRequestCode(e.target.value.toUpperCase()); setOfferError(""); }}
                        onKeyDown={e => e.key === "Enter" && createOffer(d.sticker_id)}
                      />
                      <button
                        onClick={() => createOffer(d.sticker_id)}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white flex-shrink-0"
                        style={{ background:"#F97316" }}>
                        {t("pn_offer_publish")}
                      </button>
                    </div>
                    {offerError && <div className="text-[11px] mt-1.5" style={{ color:"#EF4444" }}>{offerError}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
