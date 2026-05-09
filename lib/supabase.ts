import { createClient } from "@supabase/supabase-js";

// Fallback vacío evita que createClient explote durante el prerender SSR
// de Next.js (los calls reales solo ocurren en el cliente).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

// PKCE flow: el code_verifier nunca viaja por URL → protege contra
// authorization code interception. Nunca usar flowType: 'implicit'.
export const supabase = createClient(url, key, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
