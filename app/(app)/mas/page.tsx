"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useTheme } from "@/contexts/theme-context";
import { AppHeader } from "@/components/app-header";

export default function MasPage() {
  const { user, completeProfile, signOut } = useUser();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

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
    if (trimmed.length < 3) { setNameError("Mínimo 3 caracteres"); return; }
    if (trimmed.length > 24) { setNameError("Máximo 24 caracteres"); return; }
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

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title="Más" />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">

        {/* ── Profile Card ─────────────────────────────────── */}
        <div
          className="p-4 rounded-[18px] mb-5"
          style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)" }}
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
                ⚡ Aficionado · 0 puntos
              </div>
            </div>

            {/* Edit / Save / Cancel buttons */}
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                aria-label="Editar nombre"
              >
                <span className="text-[16px]">✏️</span>
              </button>
            ) : (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  aria-label="Cancelar"
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
          { icon: "🏆", label: "Campeones históricos", sub: "Todos los ganadores del Mundial", href: "/mas/campeones" },
          { icon: "📒", label: "Álbum Panini",          sub: "287 / 640 láminas completadas",  href: "/mas/panini" },
          { icon: "🌍", label: "Idioma",                sub: "Español",                         href: null },
        ].map((item, i) => {
          const Inner = (
            <div
              key={i}
              className="flex items-center gap-3.5 p-4 rounded-2xl mb-2 w-full text-left"
              style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border)" }}
            >
              <span className="text-[22px] flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-atlas-text">{item.label}</div>
                <div className="text-[12px] text-atlas-dimmed mt-0.5">{item.sub}</div>
              </div>
              {item.href && <span className="text-[22px] text-atlas-dimmed">›</span>}
            </div>
          );
          return item.href ? (
            <Link key={i} href={item.href}>{Inner}</Link>
          ) : (
            <button key={i} className="w-full cursor-default">{Inner}</button>
          );
        })}

        {/* ── Modo oscuro / claro ──────────────────────────── */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl mb-2 transition-all"
          style={{ background: "var(--atlas-surface)", border: "1px solid var(--atlas-border)" }}
        >
          <span className="text-[22px] flex-shrink-0">{theme === "dark" ? "🌙" : "☀️"}</span>
          <div className="flex-1 text-left">
            <div className="text-[15px] font-semibold text-atlas-text">
              {theme === "dark" ? "Modo oscuro" : "Modo claro"}
            </div>
            <div className="text-[12px] text-atlas-dimmed mt-0.5">
              {theme === "dark" ? "Activo" : "Activo"}
            </div>
          </div>
          {/* Toggle pill */}
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
              {signingOut ? "Cerrando sesión…" : "Cerrar sesión"}
            </div>
            <div className="text-[12px] text-atlas-dimmed mt-0.5">
              {user?.username ?? ""}
            </div>
          </div>
        </button>

      </div>
    </div>
  );
}
