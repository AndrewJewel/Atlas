"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Status = "verifying" | "ready" | "invalid" | "saving" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    const type = params.get("type");
    const code = params.get("code");

    // OTP flow (legacy): verify the token explicitly
    if (tokenHash && type === "recovery") {
      supabase.auth
        .verifyOtp({ token_hash: tokenHash, type: "recovery" })
        .then(({ error: err }) => setStatus(err ? "invalid" : "ready"));
      return;
    }

    // PKCE flow (default): detectSessionInUrl exchanges the code automatically.
    // Wait for the session via onAuthStateChange.
    if (code) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || (event === "INITIAL_SESSION" && session)) {
          setStatus("ready");
        }
      });
      const fallback = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setStatus(session ? "ready" : "invalid");
        });
      }, 4_000);
      return () => { subscription.unsubscribe(); clearTimeout(fallback); };
    }

    // No params — maybe the user landed here directly with an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? "ready" : "invalid");
    });
  }, []);

  const passwordOk = password.length >= 8;
  const matches = password === confirm;
  const canSubmit = passwordOk && matches && status === "ready";

  async function handleSubmit() {
    if (!canSubmit) return;
    setError("");
    setStatus("saving");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setStatus("ready");
      setError(err.message);
      return;
    }
    setStatus("done");
    setTimeout(() => router.replace("/"), 800);
  }

  return (
    <div
      className="flex flex-col min-h-screen px-6 pt-6 pb-4 max-w-md mx-auto"
      style={{ background: "linear-gradient(160deg,#090B19 0%,#0F1228 60%,#0A0F1E 100%)" }}
    >
      <div className="flex items-center gap-2 justify-center mb-10">
        <Image src="/atlas-favicon.png" alt="Atlas" width={28} height={28} priority />
        <span
          style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}
          className="text-[24px] font-bold tracking-tight"
        >
          Atlas
        </span>
      </div>

      {status === "verifying" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
          />
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            Verificando enlace…
          </span>
        </div>
      )}

      {status === "invalid" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="text-[60px] mb-3">⚠️</div>
          <h2
            style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}
            className="text-[24px] font-extrabold mb-2"
          >
            Enlace inválido
          </h2>
          <p className="text-[14px] mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
            El enlace para recuperar tu contraseña es inválido o ha caducado. Solicita uno nuevo desde la pantalla de login.
          </p>
          <button
            onClick={() => router.replace("/")}
            className="w-full py-4 rounded-2xl text-white text-[18px] font-bold tracking-wide"
            style={{ background: "#F97316", fontFamily: "var(--font-display)" }}
          >
            Volver al login
          </button>
        </div>
      )}

      {(status === "ready" || status === "saving" || status === "done") && (
        <div className="flex flex-col">
          <h2
            style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}
            className="text-[28px] font-extrabold text-center mb-1.5"
          >
            Nueva contraseña
          </h2>
          <p className="text-[13px] text-center mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
            Elige una contraseña nueva para tu cuenta.
          </p>

          {status === "done" ? (
            <div
              className="rounded-2xl px-4 py-4 text-center"
              style={{
                background: "rgba(34,197,94,0.10)",
                border: "1.5px solid rgba(34,197,94,0.30)",
              }}
            >
              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.88)" }}>
                ✅ Contraseña actualizada. Te llevamos a la app…
              </p>
            </div>
          ) : (
            <>
              <div className="relative mb-2">
                <input
                  autoFocus
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Nueva contraseña (mín. 8)"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  disabled={status === "saving"}
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-dimmed transition-colors"
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

              <input
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={status === "saving"}
                className="w-full px-4 py-3.5 rounded-2xl text-atlas-text text-[15px] outline-none mb-2"
                style={{
                  background: "#181B30",
                  border: `1.5px solid ${error || (confirm && !matches) ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                  fontFamily: "var(--font-sans)",
                }}
              />

              {confirm && !matches && (
                <p className="text-[12px] text-red-400 mb-2 px-1">Las contraseñas no coinciden.</p>
              )}
              {error && (
                <p className="text-[12px] text-red-400 mb-2 px-1">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-4 rounded-2xl text-white text-[18px] font-bold tracking-wide transition-opacity mt-2"
                style={{
                  background: "#F97316",
                  opacity: canSubmit ? 1 : 0.4,
                  fontFamily: "var(--font-display)",
                }}
              >
                {status === "saving" ? "Guardando…" : "Guardar y entrar"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
