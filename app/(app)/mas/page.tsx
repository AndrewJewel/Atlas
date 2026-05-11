"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import { LANGS, type Lang } from "@/lib/i18n";
import { AppHeader } from "@/components/app-header";
import { TrophyIcon } from "@/components/TrophyIcon";
import { loadUserPredictions, getLevel } from "@/lib/predictions";

export default function MasPage() {
  const { user, completeProfile, signOut } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    loadUserPredictions().then((preds) => {
      const pts = preds.reduce((s, p) => s + (p.points_earned ?? 0), 0);
      setTotalPoints(pts);
    });
  }, [user?.id]);

  function startEdit() {
    setNewName(user?.username ?? "");
    setNameError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setNameError("");
  }

  async function handleSave() {
    const trimmed = newName.trim();
    if (trimmed.length < 3) { setNameError(t("min_chars")); return; }
    if (trimmed.length > 24) { setNameError(t("max_chars")); return; }
    setSaving(true);
    await completeProfile(trimmed, user?.team);
    setSaving(false);
    setEditing(false);
  }

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.replace("/");
  }

  const currentLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title={t("nav_mas")} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">

        {/* ── Profile Card ─────────────────────────────────── */}
        <div
          className="p-4 rounded-[18px] mb-5"
          style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border-card)" }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-[18px] flex items-center justify-center flex-shrink-0"
              style={{ background: user?.avatar.bg ?? "#F97316" }}
            >
              <span className="text-[36px]">{user?.avatar.emoji ?? "⭐"}</span>
            </div>

            {/* Name + edit */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex flex-col gap-1.5">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => { setNewName(e.target.value); setNameError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") cancelEdit(); }}
                    maxLength={24}
                    className="w-full text-[20px] font-bold bg-transparent outline-none border-b-2 text-atlas-text pb-0.5"
                    style={{
                      fontFamily: "var(--font-display)",
                      borderBottomColor: nameError ? "#EF4444" : "#F97316",
                    }}
                  />
                  {nameError && (
                    <span className="text-[11px] text-red-400">{nameError}</span>
                  )}
                </div>
              ) : (
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-[24px] font-bold text-atlas-text tracking-tight truncate"
                >
                  {user?.username ?? "..."}
                </div>
              )}
              <div className="text-[13px] font-semibold text-atlas-primary mt-0.5">
                {getLevel(totalPoints, t)} · {totalPoints} pts
              </div>
            </div>

            {/* Edit / Save / Cancel buttons */}
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "var(--atlas-glass)", border: "1px solid var(--atlas-glass-md)" }}
                aria-label={t("edit_name_aria")}
              >
                <span className="text-[16px]">✏️</span>
              </button>
            ) : (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: "var(--atlas-glass)", border: "1px solid var(--atlas-glass-md)" }}
                  aria-label={t("cancel")}
                >
                  <span className="text-[16px]">✕</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: saving ? "rgba(249,115,22,0.4)" : "#F97316",
                    border: "1px solid #F97316",
                  }}
                  aria-label="Guardar"
                >
                  {saving
                    ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin block" />
                    : <span className="text-[16px]">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Menu Items ───────────────────────────────────── */}
        {[
          { icon: "🏆", label: t("champions_label"), sub: t("champions_sub"), href: "/mas/campeones" },
          { icon: "📒", label: t("panini_label"),    sub: t("panini_sub"),    href: "/mas/panini"    },
        ].map((item, i) => (
          <Link key={i} href={item.href}>
            <div
              className="flex items-center gap-3.5 p-4 rounded-2xl mb-2 w-full text-left"
              style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border)" }}
            >
              <span className="text-[22px] flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-atlas-text">{item.label}</div>
                <div className="text-[12px] text-atlas-dimmed mt-0.5">{item.sub}</div>
              </div>
              <span className="text-[22px] text-atlas-dimmed">›</span>
            </div>
          </Link>
        ))}

        {/* ── Idioma ───────────────────────────────────────── */}
        <button
          onClick={() => setShowLangPicker(true)}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl mb-2 transition-all"
          style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border)" }}
        >
          <span className="text-[22px] flex-shrink-0">🌍</span>
          <div className="flex-1 text-left">
            <div className="text-[15px] font-semibold text-atlas-text">{t("language_label")}</div>
            <div className="text-[12px] text-atlas-dimmed mt-0.5">
              {currentLang.flag} {currentLang.name}
            </div>
          </div>
          <span className="text-[22px] text-atlas-dimmed">›</span>
        </button>

        {/* ── Modo oscuro / claro ──────────────────────────── */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl mb-2 transition-all"
          style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border)" }}
        >
          <span className="text-[22px] flex-shrink-0">{theme === "dark" ? "🌙" : "☀️"}</span>
          <div className="flex-1 text-left">
            <div className="text-[15px] font-semibold text-atlas-text">
              {theme === "dark" ? t("dark_mode") : t("light_mode")}
            </div>
            <div className="text-[12px] text-atlas-dimmed mt-0.5">{t("mode_active")}</div>
          </div>
          <div
            className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300"
            style={{ background: theme === "dark" ? "#4A5178" : "#F97316" }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
              style={{ left: theme === "dark" ? 2 : 26 }}
            />
          </div>
        </button>

        {/* ── Sign Out ─────────────────────────────────────── */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl mt-3 transition-all"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.18)",
            opacity: signingOut ? 0.6 : 1,
          }}
        >
          <span className="text-[22px] flex-shrink-0">🚪</span>
          <div className="flex-1 text-left">
            <div className="text-[15px] font-semibold" style={{ color: "#EF4444" }}>
              {signingOut ? t("signing_out") : t("sign_out")}
            </div>
            <div className="text-[12px] text-atlas-dimmed mt-0.5">
              {user?.username ?? ""}
            </div>
          </div>
        </button>

      </div>

      {/* ── Language Picker Sheet ────────────────────────────── */}
      {showLangPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowLangPicker(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-[28px] p-6 pb-10"
            style={{ background: "var(--atlas-surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "var(--atlas-glass-border)" }} />
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[22px] font-bold text-atlas-text mb-4"
            >
              {t("language_label")}
            </h2>
            <div className="flex flex-col gap-2">
              {LANGS.map((l) => {
                const selected = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Lang); setShowLangPicker(false); }}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all"
                    style={{
                      background: selected ? "rgba(249,115,22,0.10)" : "var(--atlas-surface2)",
                      border: `1.5px solid ${selected ? "#F97316" : "var(--atlas-border)"}`,
                    }}
                  >
                    <span className="text-[28px]">{l.flag}</span>
                    <span
                      className="flex-1 text-left text-[16px] font-semibold text-atlas-text"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {l.name}
                    </span>
                    {selected && (
                      <span className="text-[18px]" style={{ color: "#F97316" }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
