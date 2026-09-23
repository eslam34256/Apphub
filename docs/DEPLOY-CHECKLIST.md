# 🚀 قائمة الـ Go-Live — AppHub (نفّذ بالترتيب، كل مربع قبل اللي بعده)

## المتطلبات عندك أولًا
- [ ] جهازك فيه git + الوصول للريبو المحلي اللي عليه الباتشات المنزّلة
- [ ] حساب Supabase (المشروع نفسه اللي بتاخد منه الأنون كي)
- [ ] حساب Vercel مربوط بـ GitHub repo (apphub-eight.vercel.app موجود)

---

## ① الترحيلات (قاعدة البيانات)
1. [ ] Supabase → مشروع AppHub → **SQL Editor** → New query
2. [ ] الصق **`supabase/SETUP-HUB.sql`** كله → **RUN** → لازم تطلع `Success`
3. [ ] تحقق: الصق ده وشغّله، لازم يطلع ٤ صفوف:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema='public'
     AND table_name IN ('shop_products','shop_orders','waitlist','brand_updates');
   ```
4. [ ] (اختياري بعدين — الباقي يشتغل من غيرهم) migration 001/002/004 للرادار والبلاغات والتنبيهات

## ② الكود
5. [ ] في الريبو المحلي:
   ```bash
   git am --abort 2>/dev/null   # لو محاولة نصف كاملة
   git am <هنا آخر باتش غير مطبق بالترتيب تصاعديًا>   # v23 v24 v25 v26
   git status                   # لازم clean، على HEAD الأخير
   ```
6. [ ] متغيرات البيئة (Vercel → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (اختياري للتوسع لاحقًا) `PAYMOB_*` · `RESEND_API_KEY` · `TELEGRAM_*`
7. [ ] `git push origin main` → Vercel بيبني تلقائي

## ③ التحقق بعد النشر (افتح apphub-eight.vercel.app)
8. [ ] `/shop` — كل منتج فيه زر «اطلب تنفيذها دلوقتي» والنموذج بيفتح
9. [ ] قدّم طلب تجريبي بإيميلك → لازم يرجع رقم طلب (مش 503) → بتتأكد في Supabase Table Editor إن الصف اتسجّل في `shop_orders`
10. [ ] `/partners` — قدّم تحديث شركة تجريبي → بيتسجّل في `brand_updates`
11. [ ] `/press` — حمّل عينة الـ CSV وافتحها في Excel (٣٦ سطر + شروط الإشارة)
12. [ ] `/price-radar` — التوبات الأربعة بتعمل ومؤشرك ظاهر
13. [ ] زر 🌙 → الدارك مود بيشتغل وبيفضل بعد الريلود
14. [ ] زر AR/EN → الهيدر/الفوتر/الهوم بيقلّبوا، والاتجاه RTL/LTR بينعكس

## ⚠️ لو حاجة ظهرت 503
معناها ترحيل ناقص — راجع خطوة ① (تشغّلت SETUP-HUB؟) والـ env vars خطوة ②.

## 🧭 بعد الـ Go-Live مباشرة (باقي الخطة)
- v27: التقرير الربع سنوي الأول (الاستخراج تلقائي من السلاسل)
- رادار فري فاير (الداتا جاهزة)
- `PAYMOB_*` للمدفوعات الرقمية + `RESEND_API_KEY` لرسائل الطلبات
