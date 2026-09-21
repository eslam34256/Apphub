-- 004: Watchlist — تنبيه نزول السعر + سجل الإيميلات
-- idempotent بالكامل (create if not exists / drop policy if exists)

-- 1) قائمة المتابعة: إيميل + تطبيق + دولة + سعر مستهدف (اختياري)
create table if not exists public.price_watchlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  app_slug text not null,
  country text not null default 'EG',
  target_price numeric,              -- لو null: اتنبّه عند أي نزلة سعر
  active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(email, app_slug, country)
);
alter table public.price_watchlist enable row level security;

-- إدراج عام (الاشتراك نفسه) — الـ API بيتحقق من الصيغة قبل الإدراج
drop policy if exists insert_watch on public.price_watchlist;
create policy insert_watch on public.price_watchlist
  for insert to anon, authenticated with check (true);

-- إلغاء الاشتراك/التعطيل بمعرف الـ UUID كرمز ملكية (unguessable، يروح في لينك الإيميل)
drop policy if exists toggle_watch on public.price_watchlist;
create policy toggle_watch on public.price_watchlist
  for update to anon, authenticated using (true) with check (true);

-- القراءة العامة مقفولة (ممنوع تسريب قوائم إيميلات المشتركين)

-- 2) سجل الإيميلات المرسلة — مقفول تمامًا (خدمات فقط)
create table if not exists public.email_events (
  id bigint generated always as identity primary key,
  kind text not null,                -- price-drop | welcome | ...
  email text not null,
  app_slug text,
  payload jsonb,
  sent_at timestamptz not null default now()
);
alter table public.email_events enable row level security;

-- فهارس أداء للكرون اليومي
create index if not exists idx_watchlist_active on public.price_watchlist (active, app_slug, country);
create index if not exists idx_email_events_sent on public.email_events (sent_at desc);
