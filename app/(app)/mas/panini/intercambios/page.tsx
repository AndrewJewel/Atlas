"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";

type TradeRow = {
  id: string;
  from_user_id: string;
  from_username: string;
  to_username: string | null;
  offered_sticker_id: number;
  requested_sticker_id: number;
  status: string;
  created_at: string;
  offered: { code: string; name: string; team_code: string | null; team_name: string | null; };
  requested: { code: string; name: string; team_code: string | null; team_name: string | null; };
};

const FLAG: Record<string, string> = {
  MEX:"mx",KOR:"kr",RSA:"za",CZE:"cz",CAN:"ca",SUI:"ch",QAT:"qa",BIH:"ba",
  BRA:"br",MAR:"ma",SCO:"gb-sct",HAI:"ht",USA:"us",PAR:"py",AUS:"au",TUR:"tr",
  GER:"de",ECU:"ec",CIV:"ci",CUW:"cw",NED:"nl",JPN:"jp",TUN:"tn",SWE:"se",
  BEL:"be",IRN:"ir",EGY:"eg",NZL:"nz",ESP:"es",URU:"uy",KSA:"sa",CPV:"cv",
  FRA:"fr",SEN:"sn",NOR:"no",IRQ:"iq",ARG:"ar",AUT:"at",ALG:"dz",JOR:"jo",
  POR:"pt",COL:"co",UZB:"uz",COD:"cd",ENG:"gb-eng",CRO:"hr",PAN:"pa",GHA:"gh",
};

function StickerChip({ code, name, teamCode }: { code: string; name: string; teamCode: string | null }) {
  const flag = teamCode ? FLAG[teamCode] : null;
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background:"var(--atlas-surface2)" }}>
      {flag ? (
        <Image src={`https://flagcdn.com/w20/${flag}.png`} alt={teamCode ?? ""} width={16} height={11}
          className="rounded-sm flex-shrink-0 object-cover" style={{ height:11 }} />
      ) : <span className="text-[10px]">⭐</span>}
      <div>
        <div className="text-[9px] font-bold text-atlas-primary">{code}</div>
        <div className="text-[10px] text-atlas-text leading-tight truncate" style={{ maxWidth:80 }}>{name}</div>
      </div>
    </div>
  );
}

export default function IntercambiosPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<"open"|"mine">("open");
  const [trades, setTrades] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("trade_offers")
      .select(`id, from_user_id, from_username, to_username, offered_sticker_id, requested_sticker_id, status, created_at,
               offered:stickers!offered_sticker_id(code,name,team_code,team_name),
               requested:stickers!requested_sticker_id(code,name,team_code,team_name)`)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setTrades((data ?? []) as unknown as TradeRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function act(tradeId: string, action: "accepted" | "rejected" | "cancelled") {
    if (!user) return;
    setActing(tradeId);
    const update: Record<string, string> = { status: action };
    if (action === "accepted") { update.to_user_id = user.id; update.to_username = user.username; }
    await supabase.from("trade_offers").update(update).eq("id", tradeId);
    await load();
    setActing(null);
  }

  const mine = trades.filter(t => t.from_user_id === user?.id);
  const open = trades.filter(t => t.from_user_id !== user?.id && !t.to_username);

  const displayed = tab === "mine" ? mine : open;

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", background:"var(--atlas-bg)", zIndex:55 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background:"var(--atlas-surface)", borderBottom:"1px solid var(--atlas-border)" }}>
        <Link href="/mas/panini" className="text-[22px] text-atlas-text leading-none">←</Link>
        <span style={{ fontFamily:"var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight flex-1">
          Intercambios
        </span>
        <Link href="/mas/panini/repetidos" className="text-[13px] font-semibold px-3 py-1.5 rounded-xl"
          style={{ background:"rgba(249,115,22,0.12)", color:"#F97316", border:"1px solid rgba(249,115,22,0.25)" }}>
          + Ofrecer
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 flex-shrink-0" style={{ borderBottom:"1px solid var(--atlas-border)" }}>
        {([["open","Disponibles",open.length],["mine","Mis ofertas",mine.length]] as const).map(([key,label,count]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-3 text-[13px] font-semibold transition-all"
            style={{
              color: tab===key ? "#F97316" : "#8892B0",
              borderBottom: tab===key ? "2px solid #F97316" : "2px solid transparent",
              background: "transparent",
            }}>
            {label}{count > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]"
              style={{ background:"rgba(249,115,22,0.15)", color:"#F97316" }}>{count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-atlas-primary border-t-transparent animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
          <span className="text-[40px]">🔁</span>
          <span className="text-[14px] text-atlas-muted">
            {tab === "open" ? "No hay intercambios disponibles" : "No tienes ofertas activas"}
          </span>
          {tab === "open" && (
            <Link href="/mas/panini/repetidos" className="text-[13px] font-semibold text-atlas-primary">
              Ofrece tus repetidos →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5" style={{ minHeight:0 }}>
          {displayed.map(t => {
            const isActing = acting === t.id;
            const isMine = t.from_user_id === user?.id;
            return (
              <div key={t.id} className="p-3 rounded-2xl"
                style={{ background:"var(--atlas-surface)", border:"1px solid var(--atlas-border)" }}>
                {/* User + time */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background:"rgba(249,115,22,0.15)", color:"#F97316" }}>
                      {t.from_username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[12px] font-semibold text-atlas-text">{t.from_username}</span>
                    {isMine && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background:"rgba(249,115,22,0.1)", color:"#F97316" }}>Tú</span>}
                  </div>
                  <span className="text-[10px] text-atlas-dimmed">
                    {new Date(t.created_at).toLocaleDateString("es", { day:"numeric", month:"short" })}
                  </span>
                </div>

                {/* Sticker exchange */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-[9px] text-atlas-dimmed mb-1">OFRECE</div>
                    <StickerChip code={t.offered.code} name={t.offered.name} teamCode={t.offered.team_code} />
                  </div>
                  <div className="text-[18px] text-atlas-dimmed flex-shrink-0">⇄</div>
                  <div className="flex-1">
                    <div className="text-[9px] text-atlas-dimmed mb-1">BUSCA</div>
                    <StickerChip code={t.requested.code} name={t.requested.name} teamCode={t.requested.team_code} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {isMine ? (
                    <button
                      onClick={() => act(t.id, "cancelled")}
                      disabled={isActing}
                      className="flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all"
                      style={{ background:"rgba(239,68,68,0.08)", color:"#EF4444", border:"1px solid rgba(239,68,68,0.2)" }}>
                      {isActing ? "..." : "Cancelar oferta"}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => act(t.id, "rejected")}
                        disabled={isActing}
                        className="py-2 px-4 rounded-xl text-[12px] font-semibold transition-all"
                        style={{ background:"rgba(239,68,68,0.08)", color:"#EF4444", border:"1px solid rgba(239,68,68,0.2)" }}>
                        {isActing ? "..." : "✕"}
                      </button>
                      <button
                        onClick={() => act(t.id, "accepted")}
                        disabled={isActing}
                        className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white transition-all"
                        style={{ background:"#F97316", opacity: isActing ? 0.6 : 1 }}>
                        {isActing ? "..." : "✓ Aceptar intercambio"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
