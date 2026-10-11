# 💰 APPHUB_MONETIZATION — التوحيد والحدود والآمان

## الحالة الحقيقية (بدون تجميل)
| القناة | الحالة | الدليل |
|---|---|---|
| Affiliate clicks tracking | **شغال** (حدود تكامل + تتبع) | /api/track + affiliate_clicks + stats |
| Affiliate conversions (عمولة فعلية) | **غير معتمدة بعد** — محتاجة قبول في الشبكات | AFFILIATE-PLAYBOOK.md |
| Sponsored listings | **جاهز للبيع يدوي** (باقات معلنة + استعلامات) | /advertise + waitlist advertiser |
| B2B leads | **شغال** (StackBuilder → واتساب/بريد) | interest=business-lead |
| مدفوعات مستخدمين | Stripe/Paymob موصولين كحدود — مش مفعّلين إنتاجيًا | env keys مطلوبة |
| إعلانات شبكات (AdSense) | متعمدًا آخر خيار (P3) | قرار منتج |

## إعداد الأفيليات Provider-agnostic
`lib/affiliate.ts`: { appSlug, url (وجهة معتمدة hardcoded — مفيش open redirect), source } + `affiliateUrl` اختياري في deals.
**قاعدة:** مفيش رابط بيتوسم «بعمولة» إلا لو affiliateUrl/url معتمد موجود — والشارة بتظهر أوتوماتيك (TrackedAffiliateLink) مع `rel="sponsored nofollow"` + إفصاح /disclosure.

## تتبع الكليكات (مخطط)
- `commerce_events(event, target, meta, created_at)` — events مسموحة whitelist: click/impression/waitlist/order
- `affiliate_clicks(app_slug, user_id, ref, created_at)`
- التحويل المؤكد: **مش بيتسجل إلا عبر callback شريك حقيقي** (مش موجود حاليًا — موثق)
- Rate-limit على التسجيل · RLS إدراج أنون + قراءة service_role فقط

## حماية
- /api/track/stats بهيدر Bearer CRON_SECRET (401 متحقق بالسموك)
- مفيش جمع بيانات شخصية في التتبع (مفيش fingerprint — target + timestamp بس)

## خطوات التفعيل اليدوية (عند المالك)
1. نفّذ docs/SQL-COMMERCE.sql
2. قدّم في الشبكات (الترتيب في AFFILIATE-PLAYBOOK.md) وبعد القبول استبدل urls
3. باقات المعلنين أسعارها قابلة للتعديل من /admin/settings لاحقًا — حاليًا معلنة في /advertise

## مخاطر معلنة
- الاعتماد على شبكات خارجية = إيرادات غير مضمونة (موثق في ROADMAP P1 معلق)
- أي عرض بدون affiliateUrl = تحريري فقط ومش بيتحسب دخل
