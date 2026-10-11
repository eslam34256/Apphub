-- 002: بلاغات المجتمع — الأرقام الحية من المستخدمين أنفسهم
-- هجرة idempotent بالكامل (آمنة لإعادة التشغيل)

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('food', 'rides', 'streaming', 'bnpl')),
  app_id text not null,
  metric text not null,
  value numeric not null,
  city text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists community_reports_app_metric_idx
  on public.community_reports (app_id, metric, created_at desc);

alter table public.community_reports enable row level security;

-- البلاغ مفتوح للكل (من غير تسجيل — زي الرادار، الشفافية أولاً)
drop policy if exists insert_reports on public.community_reports;
create policy insert_reports on public.community_reports
  for insert to anon, authenticated
  with check (true);

-- القراءة مفتوحة — الواجهة بتعرض متوسطات فقط وموسومة «قيد المراجعة»
drop policy if exists select_reports on public.community_reports;
create policy select_reports on public.community_reports
  for select to anon, authenticated
  using (true);
