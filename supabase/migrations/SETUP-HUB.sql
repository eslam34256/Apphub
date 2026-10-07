-- ═══════════════════════════════════════════════════════════════════
-- AppHub — إعداد الجداول الأربعة الأساسية (ملف واحد | idempotent آمن)
-- الصقه كله في Supabase → SQL Editor → RUN (مرة واحدة)
-- الجداول: shop_products · shop_orders · waitlist · brand_updates
-- ═══════════════════════════════════════════════════════════════════

-- 1) منتجات المتجر الرقمي (بطاقات/شحن/اشتراكات)
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

-- 2) قائمة الانتظار (الليدز: بريد + اهتمام)
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

-- 3) طلبات المتجر/التنفيذ الموثوق (مع أعمدة v25 من الأول)
create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product_slug text not null,
  amount numeric,
  player_ref text,              -- الـ Player ID (v25)
  notes text,                   -- ملاحظة العميل (v25)
  channel text not null default 'web',  -- web | concierge (v25)
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  paymob_ref text,
  created_at timestamptz not null default now()
);
alter table public.shop_orders enable row level security;
drop policy if exists insert_orders on public.shop_orders;
create policy insert_orders on public.shop_orders
  for insert to anon, authenticated with check (true);

-- لو الجدول اتعمل قبل كده من غير أعمدة v25 — ضيفها بأمان
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop_orders' AND column_name='player_ref') THEN
    ALTER TABLE public.shop_orders ADD COLUMN player_ref text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop_orders' AND column_name='notes') THEN
    ALTER TABLE public.shop_orders ADD COLUMN notes text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop_orders' AND column_name='channel') THEN
    ALTER TABLE public.shop_orders ADD COLUMN channel text not null default 'web';
  END IF;
END $$;

-- 4) تحديثات الشركات الرسمية (بوابة الشركاء — إدراج عام، قراءة مقفولة للتحقق اليدوي)
create table if not exists public.brand_updates (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_email text not null,
  plan_name text not null,
  old_price numeric,
  new_price numeric not null,
  currency text not null default 'EGP',
  evidence_url text not null,         -- رابط الإعلان الرسمي (إلزامي)
  note text,
  status text not null default 'pending' check (status in ('pending','verified','rejected')),
  created_at timestamptz not null default now()
);
alter table public.brand_updates enable row level security;
drop policy if exists insert_brand_update on public.brand_updates;
create policy insert_brand_update on public.brand_updates
  for insert to anon, authenticated with check (true);

create index if not exists idx_brand_updates_status on public.brand_updates (status, created_at desc);

-- ═══════════════════════════════════════════════════════════════════
-- ✅ للتحقق بعد التنفيذ (الصقه في محرر SQL جديد واضغط RUN):
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN ('shop_products','shop_orders','waitlist','brand_updates');
-- لازم يطلعلك ٤ صفوف.
-- ═══════════════════════════════════════════════════════════════════
