"use client";
import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { User, Team } from "@/lib/types";

type ProfileRow = {
  id: string;
  username: string | null;
  team_code: string | null;
  team_name: string | null;
  team_flag: string | null;
};

function toUser(p: ProfileRow): User | null {
  if (!p.username) return null;
  const team: Team | undefined =
    p.team_code && p.team_name && p.team_flag
      ? { code: p.team_code, name: p.team_name, flag: p.team_flag }
      : undefined;
  return {
    id: p.id,
    username: p.username,
    avatar: { emoji: team?.flag ?? "⭐", bg: "#0F1228" },
    team,
  };
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, username, team_code, team_name, team_flag")
    .eq("id", userId)
    .maybeSingle();
  return data ? toUser(data as ProfileRow) : null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function sync(session: Session | null) {
      if (!active) return;
      if (!session?.user) {
        setUser(null);
        setAuthSession(null);
        setLoaded(true);
        return;
      }
      const profile = await fetchProfile(session.user.id);
      if (!active) return;
      setAuthSession(session);
      setUser(profile);
      setLoaded(true);
    }

    // Timeout de seguridad: si Supabase no responde en 6s, forzar loaded=true
    const timeout = setTimeout(() => { if (active) setLoaded(true); }, 6000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => { clearTimeout(timeout); sync(session); })
      .catch(() => { clearTimeout(timeout); if (active) setLoaded(true); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => sync(session)
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Llamar al final del onboarding para guardar username + selección
  async function completeProfile(username: string, team?: Team): Promise<void> {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data } = await supabase
      .from("profiles")
      .update({
        username,
        team_code: team?.code ?? null,
        team_name: team?.name ?? null,
        team_flag: team?.flag ?? null,
      })
      .eq("id", authUser.id)
      .select("id, username, team_code, team_name, team_flag")
      .maybeSingle();

    if (data) setUser(toUser(data as ProfileRow));
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    setUser(null);
    setAuthSession(null);
  }

  return { user, authSession, loaded, completeProfile, signOut };
}
