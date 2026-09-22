-- 005: حلقة الوصل — طلبات تنفيذ الشحن/الاشتراكات + تحديثات الشركات الرسمية
-- idempotent بالكامل (create if not exists / drop policy if exists / alter guarded by DO blocks)

-- 1) وسّع جدول shop_orders (من 003) لاستقبال تفاصيل التنفيذ
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

-- 2) تحديثات الشركات الرسمية — إدراج عام، قراءة مقفولة (تحقق فريق العمل)
create table if not exists public.brand_updates (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_email text not null,
  plan_name text not null,
  old_price numeric,
  new_price numeric not null,
  currency text not null default 'EGP',
  evidence_url text not null,          -- رابط الإعلان الرسمي/اللبنك
  note text,
  status text not null default 'pending' check (status in ('pending','verified','rejected')),
  created_at timestamptz not null default now()
);
alter table public.brand_updates enable row level security;

drop policy if exists insert_brand_update on public.brand_updates;
create policy insert_brand_update on public.brand_updates
  for insert to anon, authenticated with check (true);

create index if not exists idx_brand_updates_status on public.brand_updates (status, created_at desc);
