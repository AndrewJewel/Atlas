"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { AtlasGroup } from "@/lib/types";

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export function useGroups() {
  const [groups, setGroups] = useState<AtlasGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const headers = await authHeaders();
    if (!headers.Authorization) { setLoading(false); return; }
    try {
      const res = await fetch("/api/groups", { headers });
      const { groups } = await res.json();
      setGroups(groups ?? []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createGroup(name: string, username: string, avatar: object): Promise<AtlasGroup | null> {
    const headers = await authHeaders();
    if (!headers.Authorization) return null;
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ name, username, avatar }),
    });
    const { group, error } = await res.json();
    if (error || !group) return null;
    setGroups((p) => [group, ...p]);
    return group;
  }

  async function joinGroup(code: string, username: string, avatar: object): Promise<AtlasGroup | string | null> {
    const headers = await authHeaders();
    if (!headers.Authorization) return null;
    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ code, username, avatar }),
    });
    const { group, error } = await res.json();
    if (error) return error as string;
    if (group) setGroups((p) => (p.find((g) => g.id === group.id) ? p : [group, ...p]));
    return group ?? null;
  }

  return { groups, loading, reload: load, createGroup, joinGroup };
}
