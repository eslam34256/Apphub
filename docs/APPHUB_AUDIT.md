# 🔍 APPHUB_AUDIT — فحص شامل (Master Product Audit)

**التاريخ:** 2026-09-23 · **النطاق:** الفحص + إصلاحات v41 · **القاعدة:** لا ادعاء غير مُختبر

## 1) الـ Stack الفعلي (مُفحوص)
- **Framework:** Next.js (App Router) + TypeScript + Tailwind · React server/client components
- **قاعدة البيانات:** Supabase (Postgres) عبر `@supabase/ssr` — server client + anon client + admin كسول (`lib/supabase/admin.ts`)
- **Auth:** Supabase Auth (email + Google اختياري بـ env) · أدمن بدور `profiles.role` في `lib/admin-check.ts` (server-side، redirect لغير المصرح)
- **Deploy:** Vercel (auto from GitHub) · PWA: manifest + sw.js v3 · RTL عربي أول + EN toggle
- **Scripts:** dev/build/start فقط — **مفيش lint/test scripts** (موثق كفجوة، مش مكسور)

## 2) عيوب مؤكدة — أُصلحت في v41
| # | العيب | الخطورة | الإصلاح |
|---|---|---|---|
| 1 | Canonical هاردكود على vercel في /best و/price-radar و/compare (يكسر دومين مخصص) | P1-SEO | بقت من `NEXT_PUBLIC_SITE_URL` |
| 2 | فورم النشرة بدون تحقق شكل البريد client-side | P1 | regex قبل الـ insert + رسائل AR/EN |
| 3 | المقالات بدون structured data | P1-SEO | JSON-LD Article في /blog/[slug] |

## 3) عيوب مؤكدة — أصلُحت في إصدارات سابقة (موثقة)
- v33.2: admin clients في module-scope كانت تكسر البناء بدون envs → `createAdminClient()` كسول
- v34: canonical هاردكود apphub.eg في buildMeta → من الـ env
- v37: ادعاءات غير قابلة للإثبات («1000+ مراجعة»، 50K مشاهدات في /advertise، placeholders تواصل) → أرقام محسوبة من الداتا + `lib/contact.ts` مصدر واحد
- v31: /api مش بيتكاش في الـ SW أبدًا

## 4) عيوب محتملة تحتاج تحقق Runtime (مش مؤكدة)
- جداول Supabase اختيارية (newsletter/waitlist/commerce_events/affiliate_clicks) — لو مش متعملة، الفورمز بترد برسالة خطأ لطيفة مش كسر (سلوك مُتحقق في الكود، مش في production)
- `managed_apps` من الداتابيز في الهوم — لو الجدول فاضي الهوم بيرجع للستاتيك (fallback موجود)
- أداء LCP على موبايل غير مقيس بأداة حقيقية (مفيش browser tools هنا)

## 5) وظائف شغالة (مُتحقق بالبناء + سموك HTTP)
Search+فلاتر · المقارنات + الخلاصة · ٤ رادارات بتواريخ مراجعة · الحاسبة · «ساعدني أختار» (قواعد شفافة بدون AI خارجي) · المدونة 7 مقالات في sitemap · PWA install · تتبع كليكات + /api/track/stats محمي · أدمن محمي بدور · advertiser-dashboard محمي بتسجيل دخول + owner_id

## 6) خدمات خارجية تحتاج اعتمادات (موثقة في .env.example)
Supabase (أساسي) · Stripe/Paymob (مدفوعات) · Telegram bot (تنبيهات) · Google OAuth · Search Console/Bing verification · شبكات أفيليات (لسه غير معتمدة — الحدود جاهزة بس)

## 7) توصيات لا تُنفذ الآن (بقرار)
- Apple Store native (Guideline 4.2 web-shell rejection) — موثق في STORES-AND-SEARCH.md
- AI provider خارجي للتوصيات — الفولباك الحتمي شغال وشفاف؛ إضافة LLM لاحقًا اختياري
- Automated advertiser billing — الاستعلامات يدوية الموافقة أولًا (Phase 10 من الخطة)
- آلاف صفحات SEO متطابقة — ممنوع بسياسة المحتوى

## 8) أمان (مُراجع)
- Server-side authz في /admin و/advertiser-dashboard ✓ · rate-limit على كل POST ✓ · RLS policies في SQL المرفق ✓ · مفيش dangerouslySetInnerHTML بمدخلات مستخدم (JSON-LD بـ safeJsonLd ثابت) ✓ · مفيش أسرار في NEXT_PUBLIC_* ✓ · مفيش open-redirect (روابط الأفيليات hardcoded allowlist) ✓

## 9) تحديث v42 (تنفيذ ملاحظات الـ Master Review)
**إصلاحات مؤكدة:**
- Unsubscribe: رابط GET حقيقي `/api/watchlist/unsubscribe?id&token(HMAC-32, timing-safe)` + الدومين من env + صفحة تأكيد عربية + 503 صادق لو DB غايبة
- النشرة: server-side `/api/newsletter/subscribe` (validation + rate-limit) والفورم بقى بيستدعيه
- صفحات التطبيقات: مصدر السعر + تاريخ آخر تحقق + حالة «السعر قديم >٩٠ يوم» (بس لو الداتا موجودة) + قسم بدائل من نفس الفئة (علاقات حقيقية)
- البحث: فلاتر دولة + مجاني/مدفوع + ترتيب (تطبيق فوري على النتائج)
- المقارنات: زرار «شارك المقارنة» بنسخ الرابط الثابت + رسالة نجاح
- Consent: بانر قبول الكل/الضروري فقط/إدارة + البوابة مطبقة فعليًا في TrackedAffiliateLink وAppStoreButtons + «تفضيلات الكوكيز» في الفوتر
- Lint: eslint + next/core-web-vitals مضافين؛ قرار موثق: تعطيل no-unescaped-entities (نصوص عربية) + استثناء og-font.ts (base64)

**تقرير اختبار v42 الفعلي (منفذ على سيرفر محلي بـ CRON_SECRET تجريبي):**
| الاختبار | النتيجة |
|---|---|
| unsubscribe: id باطل / توكن ناقص / توكن غلط | 403 ×3 ✓ |
| unsubscribe: توكن صحيح بدون DB | 503 صادق (التحقق عدّى) ✓ |
| newsletter: بريد باطل | 400 ✓ |
| newsletter: بريد صحيح بدون DB | 503 صادق ✓ |
| newsletter: ٧ طلبات متتالية | 429 على السابع ✓ |
| مقارنة في جلسة جديدة + زرار المشاركة | 200 + الزرار SSR ✓ |
| صفحة تطبيق: شارة تحقق + بدائل | ظاهرة ✓ |
| تفضيلات الكوكيز في الفوتر | موجودة ✓ |
| tsc / build / lint | 0 / 152-152 / exit 0 (تحذيرات deps موثقة) |

**غير متحقق runtime (موثق بصدق):** سلوك فلاتر البحث وبانر الـ consent في متصفح حقيقي — مفيش browser automation في بيئة الفحص؛ منطقهم مراجع يدويًا + SSR/build سليمين. الـ unsubscribe 200 النهائي وidempotency بيتحققوا في الإنتاج لما DB متاحة.
