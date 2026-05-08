import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const body = await req.json().catch(() => ({}));
  const { code, username, avatar } = body;

  if (!userId || !code?.trim()) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const { data: group } = await sb
    .from('groups')
    .select('*, members:group_members(id, user_id, username, avatar, joined_at)')
    .eq('code', code.trim().toUpperCase())
    .single();

  if (!group) {
    return NextResponse.json({ error: 'Código inválido. Revisá y volvé a intentar.' }, { status: 404 });
  }

  const alreadyIn = (group.members ?? []).some((m: { user_id: string }) => m.user_id === userId);
  if (!alreadyIn) {
    await sb.from('group_members').insert({
      group_id: group.id,
      user_id: userId,
      username: username ?? 'Anónimo',
      avatar: avatar ?? { emoji: '⭐', bg: '#F97316' },
    });
  }

  const { data: updated } = await sb
    .from('groups')
    .select('*, members:group_members(id, user_id, username, avatar, joined_at)')
    .eq('id', group.id)
    .single();

  return NextResponse.json({ group: updated });
}
