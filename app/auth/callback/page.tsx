"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
// EmailOtpType: 'signup' | 'magiclink' | 'recovery' | 'invite' | 'email'
type EmailOtpType = "signup" | "recovery" | "email" | "magiclink" | "invite";

// Maneja dos tipos de callback:
//   1. Google OAuth (PKCE): ?code=XXX
//   2. Confirmación de email: ?token_hash=XXX&type=email|signup|recovery
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const tokenHash = params.get("token_hash");
    const type = params.get("type") as EmailOtpType | null;

    async function handle() {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else if (tokenHash && type) {
        await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      }
      router.replace("/");
    }

    handle();
  }, [router]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#090B19" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
        />
        <span className="text-[13px] text-atlas-muted">Iniciando sesión…</span>
      </div>
    </div>
  );
}
