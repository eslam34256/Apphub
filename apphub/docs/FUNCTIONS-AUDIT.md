# 🖱️ تدقيق الأزرار والوظائف — v29 (٢٣ سبت ٢٠٢٦)

## البلاغ الأصلي والحل
| البلاغ | الدياجنوز | الإصلاح |
|---|---|---|
| «تسجيل الخروج مبيخرجش» | **classical SSR bug**: `signOutAction` (server action) كانت تستدعي `createBrowserClient` من `lib/auth` — في بيئة السيرفر مفيش document/cookies browser APIs فـ signOut بيفشل **بصمت**، والـ redirect بيحصل واليوزر بيفضل مسجل | إعادة كتابة الأكشن بحيث يستخدم `createClient()` السيرفري (cookies-based) + زرار الشكل بقى معاه feedback مرئي (useTransition + «بنسجل خروجك…» + disabled) |

## الأوديت المنهجي (٦ فحوص)
| الفحص | النتيجة |
|---|---|
| أزرار ميتة (`<button>` بلا onClick/submit) عبر كل `.tsx` (٧٢ ملف) | **كانديدت واحد**: «تعديل» في لوحة المعلنين → الحُلت لـ mailto واضح «اطلب تعديل» ✓ |
| زحف لينكات (٥٦ لينك داخلي من / /shop /partners /press /data) — HTTP check | **لينكوا واحد ديد**: `/developers` (CTA من /data إلى صفحة مش موجودة) → اتصلح لـ «ابدأ فورًا بالـ APIs المفتوحة» → /press ✓ |
| سمُوك GET APIs (٦ مسارات عامة) | **٦/٦ = 200** ✓ (telecom + uc + ai-radar + price-index + fx + CSV) |
| سمُوك POST APIs (٦) بمداخل فاضية | **٦/٦ = 400** ✓ (validation عربي سليم) — بصحيحة المدخل: 503 صادق حسب وضع قاعدة البيانات المحلية (في الإنتاج: جداول اتعملت من SETUP-HUB ✓) |
| Rate limiting بعدة HTTPS متتالية | 429 بعد الخامسة ✓ (مُتحقق live في v27) |
| profile page | 200 ✓ |
| `tsc` + build | ٠ أخطاء · **١٤٥/١٤٥** صفحة ✓ |

## قاعدة معمارية جديدة (فلسفة v29)
**«عينة الدنيا بين browser وserver مش تفصيلة»**: أي عملية مصادق عليها (signOut, OAuth…) لازم تكون في طبقة واحدة بس:
- cookies httpOnly ← server actions/routes فقط
- localStorage/session ← client components فقط
- الاختلاط = فشل صامت زي اللي حصل.

وده مكتوب الآن في PROJECT-AUDIT — عشان أي كود تال (ومش أي حد من الفريق) يتنبّه في المراجعة.
