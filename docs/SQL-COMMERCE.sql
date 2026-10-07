-- ═══════════════════════════════════════════════════════════
-- AppHub v38 — جداول التجارة (تتبع الكليكات + الأفيليات)
-- نفّذه في: Supabase Dashboard → SQL Editor → Run
-- آمن: الإدراج مفتوح للأنون (التتبع)، والقراءة للـ service_role بس (أنت).
-- ═══════════════════════════════════════════════════════════

create table if not exists public.commerce_events (
  id bigint generated always as identity primary key,
  event text not null,
  target text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index if not exists commerce_events_target_idx on public.commerce_events (target, created_at desc);
alter table public.commerce_events enable row level security;
drop policy if exists "anon insert commerce_events" on public.commerce_events;
create policy "anon insert commerce_events" on public.commerce_events
  for insert to anon with check (true);
drop policy if exists "authenticated insert commerce_events" on public.commerce_events;
create policy "authenticated insert commerce_events" on public.commerce_events
  for insert to authenticated with check (true);
drop policy if exists "service read commerce_events" on public.commerce_events;
create policy "service read commerce_events" on public.commerce_events
  for select to service_role using (true);

create table if not exists public.affiliate_clicks (
  id bigint generated always as identity primary key,
  app_slug text not null,
  user_id uuid,
  ref text default 'apphub',
  created_at timestamptz not null default now()
);
create index if not exists affiliate_clicks_slug_idx on public.affiliate_clicks (app_slug, created_at desc);
alter table public.affiliate_clicks enable row level security;
drop policy if exists "anon insert affiliate_clicks" on public.affiliate_clicks;
create policy "anon insert affiliate_clicks" on public.affiliate_clicks
  for insert to anon with check (true);
drop policy if exists "authenticated insert affiliate_clicks" on public.affiliate_clicks;
create policy "authenticated insert affiliate_clicks" on public.affiliate_clicks
  for insert to authenticated with check (true);
drop policy if exists "service read affiliate_clicks" on public.affiliate_clicks;
create policy "service read affiliate_clicks" on public.affiliate_clicks
  for select to service_role using (true);
