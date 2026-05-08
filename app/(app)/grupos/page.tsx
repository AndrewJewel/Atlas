"use client";
import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { WC_GROUPS } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";
import { useGroups } from "@/hooks/use-groups";
import { useUser } from "@/hooks/use-user";
import type { AtlasGroup } from "@/lib/types";

const WC_GROUP_IDS = Object.keys(WC_GROUPS);

function shareGroup(group: AtlasGroup) {
  const url = `${window.location.origin}/join/${group.code}`;
  const text = `¡Unite a mi grupo "${group.name}" en Atlas!\nCódigo: ${group.code}\n${url}`;
  if (navigator.share) navigator.share({ title: group.name, text, url }).catch(() => {});
  else navigator.clipboard.writeText(text);
}

export default function GruposPage() {
  const { groups, loading, createGroup, joinGroup } = useGroups();
  const { user } = useUser();
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeWC, setActiveWC] = useState("A");

  // Modal: 'create' | 'join' | null
  const [modal, setModal] = useState<'create' | 'join' | null>(null);

  // Create flow
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<AtlasGroup | null>(null);
  const [copied, setCopied] = useState(false);

  // Join flow
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const current = groups[activeGroup] ?? null;

  async function handleCreate() {
    if (!newName.trim() || !user) return;
    setCreating(true);
    const g = await createGroup(newName.trim(), user.username, user.avatar);
    setCreating(false);
    if (g) { setCreated(g); setNewName(""); }
  }

  async function handleJoin() {
    if (!joinCode.trim() || !user) return;
    setJoining(true);
    setJoinError("");
    const result = await joinGroup(joinCode.trim(), user.username, user.avatar);
    setJoining(false);
    if (typeof result === 'string') { setJoinError(result); return; }
    setJoinCode("");
    setModal(null);
  }

  function copyLink(group: AtlasGroup) {
    navigator.clipboard.writeText(`${window.location.origin}/join/${group.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function closeModal() { setModal(null); setCreated(null); setJoinError(""); }

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title="Grupos" />
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">

        {/* ── My Groups ─────────────────────────────────────────── */}

        {loading ? (
          <div className="rounded-[18px] mb-5 animate-pulse" style={{ background: "#0F1228", height: 164 }} />

        ) : groups.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-[18px] p-6 mb-5 flex flex-col items-center text-center gap-3"
            style={{ background: "linear-gradient(135deg,#1A1F33,#141826)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <span className="text-[44px]">🏆</span>
            <p className="text-[18px] font-bold text-atlas-text" style={{ fontFamily: "var(--font-display)" }}>
              Competi con tus amigos
            </p>
            <p className="text-[13px] text-atlas-muted leading-relaxed">
              Creá un grupo, compartí el código y predigan el Mundial 2026 juntos.
            </p>
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setModal('create')}
                className="flex-1 py-3 rounded-xl text-white text-[14px] font-bold"
                style={{ background: "#F97316" }}
              >
                Crear grupo
              </button>
              <button
                onClick={() => setModal('join')}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold"
                style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.12)", color: "#EDF0FF" }}
              >
                Unirme
              </button>
            </div>
          </div>

        ) : (
          <>
            {/* Group tabs */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {groups.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(i)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: activeGroup === i ? "#F97316" : "#181B30",
                    border: `1px solid ${activeGroup === i ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                    color: activeGroup === i ? "#fff" : "#8892B0",
                  }}
                >
                  {g.name}
                </button>
              ))}
              <button
                onClick={() => setModal('create')}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[18px] font-bold"
                style={{ background: "#181B30", border: "1px solid rgba(255,255,255,0.12)", color: "#8892B0" }}
              >
                +
              </button>
            </div>

            {/* Active group card */}
            {current && (
              <div
                className="rounded-[18px] p-4 mb-5"
                style={{ background: "linear-gradient(135deg,#1A1F33,#141826)", border: "1px solid rgba(249,115,22,0.25)" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div style={{ fontFamily: "var(--font-display)" }} className="text-[20px] font-bold text-atlas-text tracking-tight">
                      {current.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] font-mono text-atlas-dimmed">{current.code}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(current.code)}
                        className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}
                      >
                        COPIAR
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => shareGroup(current)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[12px] font-bold"
                    style={{ background: "#F97316" }}
                  >
                    📤 Compartir
                  </button>
                </div>

                {/* Members */}
                <div className="flex gap-2 flex-wrap mb-3">
                  {current.members.map((m, i) => (
                    <div key={m.id ?? i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px]"
                        style={{ background: m.avatar?.bg ?? '#F97316' }}
                      >
                        {m.avatar?.emoji ?? '⭐'}
                      </div>
                      <span className="text-[11px] text-atlas-muted">{m.username}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/grupos/chat"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-[13px] font-bold"
                    style={{ background: "#F97316", fontFamily: "var(--font-sans)" }}
                  >
                    💬 Chat
                  </Link>
                  <button
                    onClick={() => setModal('join')}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.15)", color: "#8892B0" }}
                  >
                    + Invitar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── WC Standings ──────────────────────────────────────── */}

        <div style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-3 tracking-tight">
          Tabla de posiciones
        </div>

        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {WC_GROUP_IDS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveWC(g)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                fontFamily: "var(--font-display)",
                background: activeWC === g ? "#F97316" : "#181B30",
                border: `1px solid ${activeWC === g ? "#F97316" : "rgba(255,255,255,0.08)"}`,
                color: activeWC === g ? "#fff" : "#8892B0",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <div
          className="rounded-2xl overflow-hidden mb-2"
          style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="grid px-3.5 py-2.5"
            style={{ gridTemplateColumns: "24px minmax(0,1fr) repeat(8, 22px)", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 2 }}
          >
            {["#", "Club", "PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"].map((h, i) => (
              <span key={i} className="text-[9px] font-bold text-atlas-dimmed" style={{ textAlign: i === 0 || i > 1 ? "center" : "left" }}>
                {h}
              </span>
            ))}
          </div>
          {WC_GROUPS[activeWC].map((team, i) => (
            <div
              key={i}
              className="grid px-3.5 py-2 items-center"
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

      {/* ── Bottom sheet modals ───────────────────────────────────── */}

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-t-[28px] p-6 pb-10"
            style={{ background: "#111527" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />

            {/* ── CREATE — Step 1: name input ── */}
            {modal === 'create' && !created && (
              <>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-5">
                  Crear grupo
                </h2>
                <label className="block text-[11px] font-bold text-atlas-muted mb-2 tracking-widest uppercase">
                  Nombre del grupo
                </label>
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="ej: Los Cracks 🔥"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl text-[16px] text-atlas-text outline-none mb-4"
                  style={{ background: "#1A1F38", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  className="w-full py-3.5 rounded-xl text-white text-[15px] font-bold mb-2"
                  style={{ background: newName.trim() ? "#F97316" : "#374151", opacity: creating ? 0.7 : 1 }}
                >
                  {creating ? "Creando..." : "Crear grupo"}
                </button>
                <button onClick={() => setModal('join')} className="w-full py-2 text-[13px] text-atlas-dimmed">
                  ¿Tenés un código? Unirme →
                </button>
              </>
            )}

            {/* ── CREATE — Step 2: share code ── */}
            {modal === 'create' && created && (
              <>
                <div className="text-center mb-6">
                  <span className="text-[48px]">🎉</span>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mt-2">
                    ¡{created.name} listo!
                  </h2>
                  <p className="text-[13px] text-atlas-muted mt-1">Compartí este código con tus amigos</p>
                </div>
                <div
                  className="flex items-center justify-center py-5 rounded-2xl mb-5"
                  style={{ background: "#1A1F38" }}
                >
                  <span
                    className="text-[36px] font-black"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em", color: "#F97316" }}
                  >
                    {created.code}
                  </span>
                </div>
                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => shareGroup(created)}
                    className="flex-1 py-3.5 rounded-xl text-white text-[14px] font-bold"
                    style={{ background: "#25D366" }}
                  >
                    📤 Compartir
                  </button>
                  <button
                    onClick={() => copyLink(created)}
                    className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold"
                    style={{
                      background: "#1A1F38",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: copied ? "#22C55E" : "#EDF0FF",
                    }}
                  >
                    {copied ? "✓ Copiado" : "🔗 Copiar link"}
                  </button>
                </div>
                <button onClick={closeModal} className="w-full py-2 text-[13px] text-atlas-dimmed">
                  Listo, ir al grupo →
                </button>
              </>
            )}

            {/* ── JOIN ── */}
            {modal === 'join' && (
              <>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-5">
                  Unirme a un grupo
                </h2>
                <label className="block text-[11px] font-bold text-atlas-muted mb-2 tracking-widest uppercase">
                  Código del grupo
                </label>
                <input
                  autoFocus
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                  placeholder="ATL-XXXX"
                  maxLength={8}
                  className="w-full px-4 py-3 rounded-xl text-[18px] text-atlas-text outline-none mb-1"
                  style={{
                    background: "#1A1F38",
                    border: `1px solid ${joinError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.12em",
                  }}
                />
                {joinError
                  ? <p className="text-[12px] text-red-400 mb-4">{joinError}</p>
                  : <div className="mb-4" />
                }
                <button
                  onClick={handleJoin}
                  disabled={!joinCode.trim() || joining}
                  className="w-full py-3.5 rounded-xl text-white text-[15px] font-bold mb-2"
                  style={{ background: joinCode.trim() ? "#F97316" : "#374151", opacity: joining ? 0.7 : 1 }}
                >
                  {joining ? "Buscando..." : "Unirme"}
                </button>
                <button onClick={() => setModal('create')} className="w-full py-2 text-[13px] text-atlas-dimmed">
                  ¿No tenés código? Crear mi grupo →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
