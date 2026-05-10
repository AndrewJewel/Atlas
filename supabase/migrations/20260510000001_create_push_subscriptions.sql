-- Push notification subscriptions per device/browser per user.
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (endpoint)
);

create index if not exists push_subs_user_idx on push_subscriptions(user_id);

alter table push_subscriptions enable row level security;

-- Open policies (consistent with rest of app — identity is client-trusted).
create policy "push subs read"   on push_subscriptions for select using (true);
create policy "push subs insert" on push_subscriptions for insert with check (true);
create policy "push subs update" on push_subscriptions for update using (true) with check (true);
create policy "push subs delete" on push_subscriptions for delete using (true);
