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
  // loaded = auth confirmed; profileLoaded = perfil también confirmado
  const [loaded, setLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function sync(session: Session | null) {
      if (!active) return;

      if (!session?.user) {
        setUser(null);
        setAuthSession(null);
        setLoaded(true);
        setProfileLoaded(true);
        return;
      }

      // 1. Confirmar sesión de inmediato
      setAuthSession(session);
      setLoaded(true);

      // 2. Cargar perfil (puede tardar un poco más)
      try {
        const profile = await fetchProfile(session.user.id);
        if (!active) return;
        setUser(profile);
      } catch {
        // Error de red — dejamos user=null para que el layout redirija a onboarding
      } finally {
        if (active) setProfileLoaded(true);
      }
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => sync(session))
      .catch(() => {
        if (active) { setLoaded(true); setProfileLoaded(true); }
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => sync(session)
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Usa la sesión ya cargada en memoria — evita la llamada de red extra
  async function completeProfile(username: string, team?: Team): Promise<void> {
    const userId = authSession?.user?.id;
    if (!userId) return;

    const { data } = await supabase
      .from("profiles")
      .update({
        username,
        team_code: team?.code ?? null,
        team_name: team?.name ?? null,
        team_flag: team?.flag ?? null,
      })
      .eq("id", userId)
      .select("id, username, team_code, team_name, team_flag")
      .maybeSingle();

    if (data) setUser(toUser(data as ProfileRow));
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    setUser(null);
    setAuthSession(null);
  }

  return { user, authSession, loaded, profileLoaded, completeProfile, signOut };
}
