-- 003: نواة التجارة — أفيليات، إعلانات برعاية، متجر رقمي، API مميز
-- idempotent بالكامل (create if not exists / drop policy if exists)

-- 1) خانات الإعلان برعاية (المواقع الثابتة في الصفحات)
create table if not exists public.sponsored_slots (
  id uuid primary key default gen_random_uuid(),
  placement text not null,           -- مثال: best:streaming | best:*
  brand text not null,
  text  text not null,               -- نص البانر
  url   text not null,
  starts_at timestamptz not null default now(),
  ends_at   timestamptz,
  active boolean not null default true,
  priority int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.sponsored_slots enable row level security;
drop policy if exists read_active_slots on public.sponsored_slots;
create policy read_active_slots on public.sponsored_slots
  for select to anon, authenticated using (active = true);

-- 2) أحداث التجارة (نقرات، مشاهدات إعلان، طلبات) — إدراج عام، قراءة مقفولة
create table if not exists public.commerce_events (
  id bigint generated always as identity primary key,
  event text not null check (event in ('click', 'impression', 'waitlist', 'order')),
  target text not null,              -- مثل: deal:d1 | slot:uuid | shop:slug
  meta jsonb,
  created_at timestamptz not null default now()
);
alter table public.commerce_events enable row level security;
drop policy if exists insert_events on public.commerce_events;
create policy insert_events on public.commerce_events
  for insert to anon, authenticated with check (true);

-- 3) منتجات المتجر الرقمي (بطاقات/شحن/اشتراكات)
create table if not exists public.shop_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  kind text not null check (kind in ('card', 'topup', 'subscription')),
  face_value numeric,
  currency text check (currency in ('EGP', 'SAR', 'AED', 'USD')),
  icon text,
  status text not null default 'waitlist' check (status in ('waitlist', 'live', 'off')),
  created_at timestamptz not null default now()
);
alter table public.shop_products enable row level security;
drop policy if exists read_products on public.shop_products;
create policy read_products on public.shop_products
  for select to anon, authenticated using (status <> 'off');

-- 4) قائمة انتظار المتجر (أصل ليدز قبل التشغيل)
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  interest text not null default 'general',
  created_at timestamptz not null default now(),
  unique (email, interest)
);
alter table public.waitlist enable row level security;
drop policy if exists insert_waitlist on public.waitlist;
create policy insert_waitlist on public.waitlist
  for insert to anon, authenticated with check (true);

-- 5) طلبات المتجر (بتتجهز مع بوابة الدفع)
create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product_slug text not null,
  amount numeric,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  paymob_ref text,
  created_at timestamptz not null default now()
);
alter table public.shop_orders enable row level security;
drop policy if exists insert_orders on public.shop_orders;
create policy insert_orders on public.shop_orders
  for insert to anon, authenticated with check (true);

-- 6) مفاتيح الـ API المميز (القراءة للسيرفر بس — service role)
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  rpm_limit int not null default 60,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.api_keys enable row level security;
-- مفيش سياسات select/insert للأنون — مغلقة بالكامل

-- 7) سجل استخدام الـ API
create table if not exists public.api_usage (
  id bigint generated always as identity primary key,
  key_id uuid references public.api_keys(id) on delete cascade,
  endpoint text not null,
  created_at timestamptz not null default now()
);
alter table public.api_usage enable row level security;

create index if not exists commerce_events_target_idx on public.commerce_events (target, created_at desc);
create index if not exists api_usage_key_idx on public.api_usage (key_id, created_at desc);
