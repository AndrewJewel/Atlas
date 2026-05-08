-- Atlas friend groups
create table if not exists groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 50),
  code        text unique not null,
  created_by  text not null,
  created_at  timestamptz not null default now()
);

create table if not exists group_members (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references groups(id) on delete cascade,
  user_id     text not null,
  username    text not null,
  avatar      jsonb not null,
  joined_at   timestamptz not null default now(),
  unique(group_id, user_id)
);

create index if not exists idx_gm_user  on group_members(user_id);
create index if not exists idx_gm_group on group_members(group_id);
create index if not exists idx_grp_code on groups(code);
