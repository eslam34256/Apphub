# 🗺️ APPHUB_ROADMAP — أولويات مُرتبة (من الـ Master Audit)

## P0 — حرج (منفذ ✅)
- [x] نزاهة الداتا والثقة: صفر ادعاءات غير قابلة للإثبات (v37/v39)
- [x] بيانات تواصل موحدة حقيقية (lib/contact.ts)
- [x] ثبات البناء بدون envs (v33.2)
- [x] حماية الأدمن server-side (requireAdmin بدور DB)

## P1 — أساس البيزنس (منفذ ✅ ماعدا المُعلّق)
- [x] أسعار موثقة بتواريخ ومصادر (الرادارات الأربعة)
- [x] Affiliate attribution: /api/track + affiliate_clicks + stats محمي (v38)
- [x] Conversion analytics: commerce_events + /api/track/stats
- [x] جودة المقارنات (الخلاصة السريعة + bestFor)
- [x] SEO: canonical موحّد (v41) + مقالات في sitemap (v40) + JSON-LD (v41)
- [ ] **معلق:** اعتماد شبكات أفيليات حقيقية (خطوة بيزنس مش كود — AFFILIATE-PLAYBOOK.md)
- [ ] **معلق:** SQL-COMMERCE.sql يتنفذ في Supabase (خطوة يدوية عند المالك)

## P2 — نمو
- [x] توصيات أفضل: «ساعدني أختار» بالعامية (v37)
- [x] Advertiser inquiry workflow: باقات Sponsored + WaitlistForm interest=advertiser (v39)
- [x] Business lead-gen: StackBuilder + business-lead (v39)
- [ ] تفضيلات مستخدم + Price Alerts (watchlist موجود جزئيًا — WatchPriceButton) → توسعة P2 قادمة
- [ ] محتوى تحريري أسبوعي مستمر (5/5 مقالات الخطة الأولى ✅ — الدورة مستمرة)

## P3 — لاحقًا (بقرار صريح)
- LLM recommendations · اشتراكات مستخدمين مدفوعة · فوترة معلنيين أوتوماتيك · Apple native app

## قاعدة العمل
كل مرحلة: build 100% + سموك HTTP للصفحات المتأثرة + توثيق النتيجة في رسالة الكوميت. مفيش مرحلة بتكسر اللي قبلها (الباتشات بتتطبق على ريبو متزامن).
