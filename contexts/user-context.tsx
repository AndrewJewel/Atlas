"use client";
import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from "react";
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
  const team =
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

interface UserContextValue {
  user: User | null;
  authSession: Session | null;
  loaded: boolean;
  profileLoaded: boolean;
  completeProfile: (username: string, team?: Team) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  // Tracks which userId's profile was already fetched to prevent double-fetch
  // when getSession() and onAuthStateChange INITIAL_SESSION fire concurrently
  const profileFetchedForRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    async function sync(session: Session | null) {
      if (!active) return;

      if (!session?.user) {
        profileFetchedForRef.current = null;
        setUser(null);
        setAuthSession(null);
        setLoaded(true);
        setProfileLoaded(true);
        return;
      }

      setAuthSession(session);
      setLoaded(true);

      if (profileFetchedForRef.current === session.user.id) return;
      profileFetchedForRef.current = session.user.id;

      try {
        const profile = await fetchProfile(session.user.id);
        if (!active) return;
        setUser(profile);
      } catch {
        if (active) profileFetchedForRef.current = null;
      } finally {
        if (active) setProfileLoaded(true);
      }
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => sync(session))
      .catch(() => { if (active) { setLoaded(true); setProfileLoaded(true); } });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { sync(session); }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

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
    profileFetchedForRef.current = null;
    setUser(null);
    setAuthSession(null);
  }

  return (
    <UserContext.Provider value={{ user, authSession, loaded, profileLoaded, completeProfile, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
