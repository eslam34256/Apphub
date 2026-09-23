# 🏪 الدليل الكامل: المتاجر + الظهور في البحث — v32 (٢٣ سبت ٢٠٢٦)

## 🟢 الجزء الأول: Google Play (الأقرب للتحقيق — بدون كود native)

**السر:** Google Play ليه جسر رسمي يسمى **TWA (Trusted Web Activity)** — تطبيقك مهما لائق فيه PWA، وكل الأساس اتعمل في v31. الأداة المعتمدة هي **PWABuilder** (من Microsoft رسميًا).

### خطواتك (١٥-٣٠ دقيقة بعد الـ live):
1. **اتنشر (تطبق الباتشات)** → الموقع يكون على https الخاص بك
2. روح **pwabuilder.com** → الصق رابط موقعك → «Package for Stores»
   - بيسحب manifest الـ v31 لوحده (الأيقونة/الـ name/الـ shortcuts)
3. اختار **Android** → حمل ZIP (بيحتوي: AAB + مفتاح توقيع + SHA256 fingerprint)
4. **استبدل fingerprint** في `public/.well-known/assetlinks.json`:
   ```json
   "sha256_cert_fingerprints": ["XX:YY:ZZ..."]
   ```
   `(الـ package_name عندنا eg.apphub.twa — نفس اللي في الملف)`
5. اعمل hot-patch (commit بسيط) والموقع يupdate — PWABuilder عليه statذا الربط
6. **Google Play Console (play.google.com/console)**: $٢٥ لمرة واحدة → Create app → ارفع الـ AAB → صفحات listing (سكرينات من موقعك) → Publish

✅ **المستخدم اللي ينزّل التطبيق**: يفتح في شاشة كاملة، مش متصفح — وكل حاجة في التطبيق نفس كل اللي شفته في الموقع (نفس الكود).

## 🍏 الجزء الثاني: Apple Store (بصراحة وشجاعة)

| الخيار | حكمنا |
|---|---|
| PWABuilder iOS package | محتاج Mac + حساب Apple Developer ($99/سنة) + غالبًا يرفض (Guideline 4.2: ممنوع تطبيقات «web shell فقط» من غير ميزات native) |
| Capacitor + ميزات native (push الإشعارات مثلا) | ممكن لاحقًا بعد ما native IDs وgranted perms |
| **الآن: iOS بتلميح PWA** ✅ | جاهز في v31 (بطاقة «مشاركة ← إضافة للشاشة الرئيسية» تلقائي لكل آيفون جنوبي) — و80% من سوقنا أندرويد |

**الحكم:** ادخل Play الآن بتكلفة ٢٥$ دفعة، و خد Apple بعد بلوغ أول ميزات native فعلية (دفعات داخلية / إشعارات).

## 🔍 الجزء الثالث: الظهور في البحث (الشغل تحت v32)

### ✅ العناصر المُكتملة في الكود فعلاً
- `sitemap.xml` (١٣٧ بتعثر PUBLISHED_REPORTS) ديناميكي — facet كل الصفحات الجديدة تلقائي
- `robots.txt` — بيسمح السرش وبيحجب /admin /api /auth
- Open Graph + Twitter cards + Article JSON-LD (v28) + FAQ/Breadcrumb schemas
- ١٤٥ صفحة ثابتة (ultra fast — Core Web Vitals خفيفة)
- Content عربي حي كل أسبوع (رادارات/مقالات/blog-posts)

### ⚙️ خطوات إدارية علىيك (٥-١٠ دقيقة)
1. **Google Search Console** (search.google.com/search-console)
   - Add property: `https://apphub-eight.vercel.app` (أو دومينك الخاص لو وصلته)
   - Verify by "meta tag" → خد السطر:
     `<meta name="google-site-verification" content="XXXX" />`
   - حط الـ XXXX في **Vercel env**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXX` → Redeploy
2. **Bing Webmaster Tools** — نفس الفكرة بالـ env `NEXT_PUBLIC_BING_VERIFICATION=XXXX` (بيلعبوا Bing + Yahoo + DuckDuckGo في زاما)
3. في Sift Search Console → Sitemaps → submit: `https://apphub-eight.vercel.app/sitemap.xml`
4. **URL Inspection** → اطلب Indexing على الـ ٥-٦ أولى صفحات:
   `/`·`/price-radar`·`/deals`·`/reports/q3-2026`·`/uc-radar`·`/telecom-radar`
   (احتياطٍ Google ولكن احتياطكم في حدود الحصة اليومية ـ برفش)

### ⚠️ 3 سلوكيات مشكلات معيّرة لاتنساها
- **دومين مخصص يفتح بشكل أفضل**: كل الـ OG/canonical في الكود بتقول `apphub.eg`، فلو هاتணشر بدومين vercel sub بدون تغيير السيت للـ prop `NEXT_PUBLIC_SITE_URL` → الروبوتات هتلّاقي canonical صفاح في دومين تاني → مع كا瑩ات أسوة بشكل خفيف جدًا. أحسن: روح Vercel → Domains → ضيف apphub.eg بعد ما تشتغل الـ A record عند لوحة التحكم بتاعتك (اYWZ/NY غالباً Namecheap أو GoDaddy)
- الأرشفة بتاخد من **أيام لأسبوعين** — مفيش «سوالبة محرز لليوم التاني»
- أفضل وقت للإرشفة: Sabbamواجهة الـ HI لو انتهيتها ابعت الرابط لصحفة واحد بس ليها الداتا تفي لأن رابط واحد صفي خبري من مصدر مألوف بيضاعف السرعة التعاونية

---

**الخلاصة:** Play = معبدًا جاهز (٢٥$+٢٥ دقيقة). Apple = بعد ميزات native. البحث = معرفات الضبط الصحيحة الواحدة مرة، والكود بيشحن نفسه ذاتي كل صفحة جديدة.
