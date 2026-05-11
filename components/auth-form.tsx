"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  onSuccess: () => void;
  onModeChange?: (mode: "register" | "login") => void;
}

type Tab = "register" | "login";

const ERR: Record<string, string> = {
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "User already registered": "Ya existe una cuenta con ese email.",
  "Email not confirmed": "Confirma tu email antes de iniciar sesión.",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 8 caracteres.",
};

function humanize(msg: string): string {
  return ERR[msg] ?? msg;
}

export function AuthForm({ onSuccess, onModeChange }: Props) {
  const [tab, setTab] = useState<Tab>("register");

  const switchTab = (t: Tab) => { setTab(t); onModeChange?.(t); };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordOk = password.length >= 8;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailOk && passwordOk && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setError("");
    setInfo("");
    setLoading(true);

    if (tab === "register") {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (err) { setError(humanize(err.message)); return; }
      if (data.session) {
        // Email confirmation desactivada → sesión inmediata
        onSuccess();
      } else {
        // Email confirmation activada
        setInfo("Revisa tu email para confirmar la cuenta y continuar.");
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (err) { setError(humanize(err.message)); return; }
      onSuccess();
    }
  }

  async function handleGoogle() {
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Tabs */}
      <div
        className="flex rounded-2xl p-1 mb-6"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {(["register", "login"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { switchTab(t); setError(""); setInfo(""); }}
            className="flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-all"
            style={{
              background: tab === t ? "#F97316" : "transparent",
              color: tab === t ? "#fff" : "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-display)",
            }}
          >
            {t === "register" ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        ))}
      </div>

      {/* Google OAuth */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-[15px] font-semibold transition-opacity mb-3"
        style={{
          background: "#fff",
          color: "#1a1a1a",
          fontFamily: "var(--font-sans)",
        }}
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        <span className="text-[12px] text-atlas-dimmed">o con email</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          className="w-full px-4 py-3.5 rounded-2xl text-atlas-text text-[15px] outline-none"
          style={{
            background: "#181B30",
            border: `1.5px solid ${error && !emailOk ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
            fontFamily: "var(--font-sans)",
          }}
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            autoComplete={tab === "register" ? "new-password" : "current-password"}
            placeholder="Contraseña (mín. 8 caracteres)"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-4 py-3.5 pr-12 rounded-2xl text-atlas-text text-[15px] outline-none"
            style={{
              background: "#181B30",
              border: `1.5px solid ${error ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
              fontFamily: "var(--font-sans)",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-dimmed hover:text-atlas-text transition-colors"
            aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPass ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error / Info */}
      {error && (
        <p className="text-[12px] text-red-400 mb-2 px-1">{error}</p>
      )}
      {info && (
        <p className="text-[12px] text-atlas-success mb-2 px-1">{info}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-4 rounded-2xl text-white text-[18px] font-bold tracking-wide transition-opacity mt-1"
        style={{
          background: "#F97316",
          opacity: canSubmit ? 1 : 0.4,
          fontFamily: "var(--font-display)",
        }}
      >
        {loading
          ? "..."
          : tab === "register"
          ? "Crear cuenta →"
          : "Entrar →"}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
