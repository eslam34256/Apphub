-- ═══════════════════════════════════════════════════════
-- AppHub v44 — جدول روابط الأفيليات المعتمدة
-- آمن للتكرار (if not exists) · RLS: الإدارة service_role فقط
-- ═══════════════════════════════════════════════════════

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  app_slug text,
  destination text not null,
  status text not null default 'pending' check (status in ('pending','active','paused','rejected')),
  countries jsonb default '[]'::jsonb,
  campaign text,
  source_url text,          -- الرابط الرسمي اللي اتراجع منه السعر/العرض
  verified_at timestamptz,  -- تاريخ آخر تحقق
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.affiliate_links enable row level security;

-- مفيش وصول anon/authenticated مباشر — كل القراءة والكتابة عبر service_role (السيرفر/الأدمن)
drop policy if exists "service all affiliate_links" on public.affiliate_links;
create policy "service all affiliate_links" on public.affiliate_links
  for all to service_role using (true) with check (true);
