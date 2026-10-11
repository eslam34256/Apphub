-- ═══════════════════════════════════════════════════════════
-- 🚨 Price Radar Automation — قاعدة بيانات رادار الأسعار
-- شغّل الملف ده كله في Supabase → SQL Editor → Run مرة واحدة
-- ═══════════════════════════════════════════════════════════

-- 1) جدول «عناصر المراقبة» — كل صف = باقة اشتراك في دولة معينة
create table if not exists price_watch (
  id           uuid primary key default gen_random_uuid(),
  app_slug     text not null,
  plan_name    text not null,
  plan_note    text,
  country      text not null check (country in ('EG','SA','AE')),
  currency     text not null check (currency in ('EGP','SAR','AED')),
  current_price numeric not null,

  -- محرك الرصد الآلي
  source_url   text,                 -- الصفحة الرسمية اللي هيتفحص منها (فاضي = يدوي فقط)
  price_regex  text,                 -- أول () capture group في الريجيكس = رقم السعر
  check_mode   text not null default 'manual' check (check_mode in ('auto','manual')),

  -- حالة التشغيل
  is_active    boolean not null default true,
  needs_review boolean not null default false,  -- الأوتوماتيك فشل — عايز عين بشرية
  fail_count   int not null default 0,
  last_checked_at timestamptz,
  updated_at   timestamptz not null default now(),

  unique (app_slug, plan_name, country)
);

-- 2) جدول التاريخ — append-only، صف جديد «فقط عند تغيّر السعر»
create table if not exists price_history (
  id         bigint generated always as identity primary key,
  watch_id   uuid not null references price_watch(id) on delete cascade,
  price      numeric not null,
  checked_at timestamptz not null default now(),
  source     text not null default 'cron' check (source in ('cron','admin','manual'))
);

create index if not exists idx_price_history_watch on price_history (watch_id, checked_at desc);
create index if not exists idx_price_watch_active on price_watch (is_active, check_mode);

-- 3) حماية RLS: القراءة عامة (صفحة الرادار)، الكتابة للسيرفر بس (service role)
alter table price_watch   enable row level security;
alter table price_history enable row level security;

drop policy if exists "public read price_watch" on price_watch;
create policy "public read price_watch"
  on price_watch for select using (is_active = true);

drop policy if exists "public read price_history" on price_history;
create policy "public read price_history"
  on price_history for select using (true);

-- 4) بذرة البيانات: نفس اشتراكات الرادار الحالية (وضع يدوي أولًا — الأوتوماتيك بيتفعل بعد ما تضيف source_url + regex وتجرب)
insert into price_watch (app_slug, plan_name, plan_note, country, currency, current_price, check_mode) values
  ('netflix',        'الأساسية',        'شاشة واحدة — HD',  'EG','EGP', 100,   'manual'),
  ('netflix',        'القياسية',        'شاشتين — Full HD', 'EG','EGP', 170,   'manual'),
  ('netflix',        'المميزة',         '4 شاشات — 4K',     'EG','EGP', 240,   'manual'),
  ('shahid',         'VIP الشهرية',      null,               'EG','EGP', 49,    'manual'),
  ('shahid',         'الرياضية الشهرية', null,               'EG','EGP', 99,    'manual'),
  ('shahid',         'VIP الشهرية',      null,               'SA','SAR', 29.62, 'manual'),
  ('shahid',         'الرياضية الشهرية', null,               'SA','SAR', 57.99, 'manual'),
  ('watchit',        'الشهرية',          null,               'EG','EGP', 49,    'manual'),
  ('spotify',        'Individual',       null,               'EG','EGP', 79.99, 'manual'),
  ('spotify',        'Family',           '6 حسابات',         'EG','EGP', 129.99,'manual'),
  ('anghami',        'Plus الشهرية',     null,               'EG','EGP', 39.99, 'manual'),
  ('youtube-premium','Individual',       null,               'EG','EGP', 84.99, 'manual'),
  ('youtube-premium','Family',           null,               'EG','EGP', 169.99,'manual'),
  ('osn-plus',       'الشهرية',          null,               'SA','SAR', 31.5,  'manual'),
  ('tod',            'الشهرية',          null,               'SA','SAR', 69,    'manual'),
  ('disney-plus',    'الشهرية',          null,               'AE','AED', 33.99, 'manual')
on conflict (app_slug, plan_name, country) do nothing;

-- ═══════════════════════════════════════════════════════════
-- 📌 أمثلة تشغيل (انسخها وقت الحاجة):
--
-- ← تفعيل الرصد الآلي لعنصر (بعد ما تتأكد إن الريجيكس بيلقط السعر صح):
-- update price_watch
-- set check_mode='auto',
--     source_url='https://www.example.com/plans',
--     price_regex='باقة القياسية[^\d]*(\d+[\d.,]*)'
-- where app_slug='netflix' and plan_name='القياسية' and country='EG';
--
-- ← تسجيل تغيّر يدوي (التاريخ بيتكتب أوتوماتيك من الواجهة العامة؟ لا —
-- ده من SQL Editor أو من cron; التاريخ بيتسجل عند أي تغيير):
-- update price_watch set current_price=190, updated_at=now()
-- where app_slug='netflix' and plan_name='القياسية' and country='EG';
-- insert into price_history (watch_id, price, source)
--   select id, 190, 'manual' from price_watch
--   where app_slug='netflix' and plan_name='القياسية' and country='EG';
-- ═══════════════════════════════════════════════════════════
