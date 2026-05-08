import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
