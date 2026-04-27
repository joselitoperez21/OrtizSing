create table if not exists public.site_profile (
  id text primary key,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_profile (id, profile)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
