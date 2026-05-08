'use client';
import { useState, useEffect, useCallback } from 'react';
import { getUserId, getUser } from '@/lib/user-store';
import type { AtlasGroup } from '@/lib/types';

export function useGroups() {
  const [groups, setGroups] = useState<AtlasGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const uid = getUserId();
    if (!uid) { setLoading(false); return; }
    try {
      const res = await fetch('/api/groups', { headers: { 'x-user-id': uid } });
      const { groups } = await res.json();
      setGroups(groups ?? []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createGroup(name: string): Promise<AtlasGroup | null> {
    const uid = getUserId();
    const user = getUser();
    if (!uid || !user) return null;
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': uid },
      body: JSON.stringify({ name, username: user.username, avatar: user.avatar }),
    });
    const { group, error } = await res.json();
    if (error || !group) return null;
    setGroups(p => [group, ...p]);
    return group;
  }

  async function joinGroup(code: string): Promise<AtlasGroup | string | null> {
    const uid = getUserId();
    const user = getUser();
    if (!uid) return null;
    const res = await fetch('/api/groups/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': uid },
      body: JSON.stringify({ code, username: user?.username, avatar: user?.avatar }),
    });
    const { group, error } = await res.json();
    if (error) return error as string;
    if (group) setGroups(p => p.find(g => g.id === group.id) ? p : [group, ...p]);
    return group ?? null;
  }

  return { groups, loading, reload: load, createGroup, joinGroup };
}
