"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { WC_GROUPS } from "@/lib/data";
import { TeamFlag } from "@/components/flags/TeamFlag";
import { useGroups } from "@/hooks/use-groups";
import { useUser } from "@/hooks/use-user";
import { useLanguage } from "@/contexts/language-context";
import { TrophyIcon } from "@/components/TrophyIcon";
import type { AtlasGroup } from "@/lib/types";

const WC_GROUP_IDS = Object.keys(WC_GROUPS);

export default function GruposPage() {
  const { groups, loading, createGroup, joinGroup, deleteGroup } = useGroups();
  const { user } = useUser();
  const { t } = useLanguage();

  function shareGroup(group: AtlasGroup) {
    const url = `${window.location.origin}/join/${group.code}`;
    const text = t("share_text")
      .replace("{name}", group.name)
      .replace("{code}", group.code)
      .replace("{url}", url);
    if (navigator.share) navigator.share({ title: group.name, text, url }).catch(() => {});
    else navigator.clipboard.writeText(text);
  }
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeWC, setActiveWC] = useState("A");

  // Modal: 'create' | 'join' | 'delete' | null
  const [modal, setModal] = useState<'create' | 'join' | 'delete' | null>(null);

  // Delete flow
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!current) return;
    setDeleting(true);
    await deleteGroup(current.id);
    setDeleting(false);
    setModal(null);
    setActiveGroup(0);
  }

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title={t("tab_grupos")} />
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">

        {/* ── My Groups ─────────────────────────────────────────── */}

        {loading ? (
          <div className="rounded-[18px] mb-5 animate-pulse" style={{ background: "var(--atlas-surface)", height: 164 }} />

        ) : groups.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-[18px] p-6 mb-5 flex flex-col items-center text-center gap-3"
            style={{ background: "linear-gradient(135deg,var(--atlas-surface3),var(--atlas-surface))", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <TrophyIcon size={44} color="#F97316" />
            <p className="text-[18px] font-bold text-atlas-text" style={{ fontFamily: "var(--font-display)" }}>
              {t("compete_title")}
            </p>
            <p className="text-[13px] text-atlas-muted leading-relaxed">
              {t("compete_sub")}
            </p>
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setModal('create')}
                className="flex-1 py-3 rounded-xl text-white text-[14px] font-bold"
                style={{ background: "#F97316" }}
              >
                {t("create_group")}
              </button>
              <button
                onClick={() => setModal('join')}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold"
                style={{ background: "var(--atlas-surface2)", border: "1px solid var(--atlas-glass-border)", color: "var(--atlas-text)" }}
              >
                {t("join_btn")}
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
                    background: activeGroup === i ? "#F97316" : "var(--atlas-surface2)",
                    border: `1px solid ${activeGroup === i ? "#F97316" : "var(--atlas-glass-md)"}`,
                    color: activeGroup === i ? "#fff" : "#8892B0",
                  }}
                >
                  {g.name}
                </button>
              ))}
              <button
                onClick={() => setModal('create')}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[18px] font-bold"
                style={{ background: "var(--atlas-surface2)", border: "1px solid var(--atlas-glass-border)", color: "#8892B0" }}
              >
                +
              </button>
            </div>

            {/* Active group card */}
            {current && (
              <div
                className="rounded-[18px] p-4 mb-5"
                style={{ background: "linear-gradient(135deg,var(--atlas-surface3),var(--atlas-surface))", border: "1px solid rgba(249,115,22,0.25)" }}
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
                        {t("copy_code")}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => shareGroup(current)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[12px] font-bold"
                      style={{ background: "#F97316" }}
                    >
                      {t("share_btn")}
                    </button>
                    {current.created_by === user?.id && (
                      <button
                        onClick={() => setModal('delete')}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}
                        aria-label="Eliminar grupo"
                      >
                        <span className="text-[14px]">🗑️</span>
                      </button>
                    )}
                  </div>
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
                    href={`/grupos/chat/${current.id}?name=${encodeURIComponent(current.name)}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-[13px] font-bold"
                    style={{ background: "#F97316", fontFamily: "var(--font-sans)" }}
                  >
                    {t("chat_btn")}
                  </Link>
                  <button
                    onClick={() => setModal('join')}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                    style={{ background: "var(--atlas-glass)", border: "1px dashed var(--atlas-glass-border)", color: "#8892B0" }}
                  >
                    {t("invite_btn")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── WC Standings ──────────────────────────────────────── */}

        <div style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-3 tracking-tight">
          {t("standings")}
        </div>

        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {WC_GROUP_IDS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveWC(g)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                fontFamily: "var(--font-display)",
                background: activeWC === g ? "#F97316" : "var(--atlas-surface2)",
                border: `1px solid ${activeWC === g ? "#F97316" : "var(--atlas-glass-md)"}`,
                color: activeWC === g ? "#fff" : "#8892B0",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <div
          className="rounded-2xl overflow-hidden mb-2"
          style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border)" }}
        >
          <div
            className="grid px-3.5 py-2.5"
            style={{ gridTemplateColumns: "24px minmax(0,1fr) repeat(8, 22px)", borderBottom: "1px solid var(--atlas-border)", gap: 2 }}
          >
            {["#", t("table_selection"), "PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"].map((h, i) => (
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
                borderBottom: "1px solid var(--atlas-glass-sm)",
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
            <span className="text-[11px] text-atlas-dimmed">{t("qualify_note")}</span>
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
            style={{ background: "var(--atlas-surface)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--atlas-glass-border)" }} />

            {/* ── CREATE — Step 1: name input ── */}
            {modal === 'create' && !created && (
              <>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-5">
                  {t("create_group")}
                </h2>
                <label className="block text-[11px] font-bold text-atlas-muted mb-2 tracking-widest uppercase">
                  {t("group_name_label")}
                </label>
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder={t("group_name_placeholder")}
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl text-[16px] text-atlas-text outline-none mb-4"
                  style={{ background: "var(--atlas-surface3)", border: "1px solid var(--atlas-border-md)" }}
                />
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  className="w-full py-3.5 rounded-xl text-white text-[15px] font-bold mb-2"
                  style={{ background: newName.trim() ? "#F97316" : "#374151", opacity: creating ? 0.7 : 1 }}
                >
                  {creating ? t("creating") : t("create_group")}
                </button>
                <button onClick={() => setModal('join')} className="w-full py-2 text-[13px] text-atlas-dimmed">
                  {t("has_code")}
                </button>
              </>
            )}

            {/* ── CREATE — Step 2: share code ── */}
            {modal === 'create' && created && (
              <>
                <div className="text-center mb-6">
                  <span className="text-[48px]">🎉</span>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mt-2">
                    ¡{created.name} {t("group_ready")}
                  </h2>
                  <p className="text-[13px] text-atlas-muted mt-1">{t("share_code_hint")}</p>
                </div>
                <div
                  className="flex items-center justify-center py-5 rounded-2xl mb-5"
                  style={{ background: "var(--atlas-surface3)" }}
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
                    {t("share_btn")}
                  </button>
                  <button
                    onClick={() => copyLink(created)}
                    className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold"
                    style={{
                      background: "var(--atlas-surface3)",
                      border: "1px solid var(--atlas-border-md)",
                      color: copied ? "#22C55E" : "var(--atlas-text)",
                    }}
                  >
                    {copied ? t("link_copied") : t("copy_link")}
                  </button>
                </div>
                <button onClick={closeModal} className="w-full py-2 text-[13px] text-atlas-dimmed">
                  {t("go_to_group")}
                </button>
              </>
            )}

            {/* ── JOIN ── */}
            {modal === 'join' && (
              <>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-5">
                  {t("join_group_title")}
                </h2>
                <label className="block text-[11px] font-bold text-atlas-muted mb-2 tracking-widest uppercase">
                  {t("join_code_label")}
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
                    background: "var(--atlas-surface3)",
                    border: `1px solid ${joinError ? 'rgba(239,68,68,0.5)' : 'var(--atlas-border-md)'}`,
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
                  {joining ? t("searching") : t("join_btn")}
                </button>
                <button onClick={() => setModal('create')} className="w-full py-2 text-[13px] text-atlas-dimmed">
                  {t("no_code")}
                </button>
              </>
            )}

            {/* ── DELETE confirmation ── */}
            {modal === 'delete' && current && (
              <>
                <div className="flex flex-col items-center text-center mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-[32px] mb-4"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
                  >
                    🗑️
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[22px] font-bold text-atlas-text mb-2">
                    {t("delete_title").replace("{name}", current.name)}
                  </h2>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#EF4444" }}>
                    {t("delete_warning")}
                  </p>
                  <p className="text-[13px] text-atlas-muted leading-relaxed mt-1">
                    {t("delete_detail")}
                  </p>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-3.5 rounded-xl text-white text-[15px] font-bold mb-3 transition-all"
                  style={{
                    background: deleting ? "rgba(239,68,68,0.5)" : "#EF4444",
                    opacity: deleting ? 0.8 : 1,
                  }}
                >
                  {deleting ? t("deleting") : t("delete_confirm")}
                </button>
                <button
                  onClick={closeModal}
                  disabled={deleting}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold"
                  style={{ background: "var(--atlas-surface2)", color: "var(--atlas-text)" }}
                >
                  {t("cancel")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
