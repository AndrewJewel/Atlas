"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type EmailOtpType = "signup" | "recovery" | "email" | "magiclink" | "invite";

// detectSessionInUrl:true in supabase.ts handles PKCE code exchange automatically.
// This page only needs to:
//   - For Google OAuth (?code=): wait for onAuthStateChange then redirect.
//   - For email OTP (?token_hash=): call verifyOtp manually then redirect.
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    const type = params.get("type") as EmailOtpType | null;

    // Email OTP path — not auto-handled by detectSessionInUrl
    if (tokenHash && type) {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        .finally(() => router.replace("/"));
      return;
    }

    // Google OAuth path — detectSessionInUrl already exchanged the code.
    // Subscribe to get SIGNED_IN or INITIAL_SESSION (with session) and redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && session)) {
        router.replace("/");
      }
    });

    // Fallback: if auth never resolves (e.g. invalid code), redirect after 8s
    const fallback = setTimeout(() => router.replace("/"), 8_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
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
