# 🚨 أتمتة رادار الأسعار — دليل التشغيل

بنية النظام: **Cron يومي → يفحص الأسعار → يسجّل التاريخ → الصفحة تقرا من القاعدة تلقائيًا.**
بدون أي تدخل منك، الرادار يتحدّث مع الوقت ويجمع تاريخ أسعار ملكي 100%.

---

## 🧩 المكوّنات

| القطعة | المكان | الوظيفة |
|---|---|---|
| جدول `price_watch` | Supabase | الباقات المرصودة + السعر الحالي + إعدادات الفحص |
| جدول `price_history` | Supabase | سجل التغيّرات (صف جديد فقط عند تغيّر السعر) |
| Cron يومي 8:00 UTC | `/api/cron/price-check` + `vercel.json` | الفحص والتطبيق والتسجيل |
| صفحة الرادار | `/price-radar` | تقرا من القاعدة (fallback للثابتة لو القاعدة مش متاحة) |

## ⚙️ خطوة التفعيل (مرة واحدة — 3 دقائق)

1. **Supabase** → مشروعك → **SQL Editor** → الصق محتوى `supabase/migrations/001_price_radar.sql` → **Run**
2. تأكد إن `CRON_SECRET` متعرف في Vercel → Settings → Environment Variables (هو موجود فعلًا عندك لباقي كروناتك)
3. بعد الـ Deploy: Vercel → Project → **Cron Jobs** — هتشوف `/api/cron/price-check` بيقفل كل يوم 11:00 بتوقيت مصر
4. **اختبار يدوي فوري** (من المتنح):
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://apphub-eight.vercel.app/api/cron/price-check
   ```
   النتيجة: `{"success":true,"checked":0,...}` — طبيعي! لأن كل العناصر دلوقتي وضعها `manual`.

## 🔍 إزاي تفعّل الرصد الآلي لأي باقة؟

في Supabase Table Editor (أو SQL):

```sql
update price_watch
set check_mode  = 'auto',
    source_url  = 'https://official-page.example/pricing',
    price_regex = 'Standard[^\d]*(\d+[\d.,]*)'
where app_slug='netflix' and plan_name='القياسية' and country='EG';
```

**قواعد الريجيكس:** أول `()` capture group لازم يلقط رقم السعر (خلّي باقي النص ثابت قوويم الموقع).
جرب الريجيكس محليًا الأول على HTML الصفحة قبل ما تفعل `auto`.

## 🛡️ إزاي المحرك بيحمي مصداقيتك؟

المحرك **لن ينشر سعرًا غلط** أبدًا — لو فيه أي شك بيتصرف حذريًا:

| الموقف | التصرف |
|---|---|
| الريجيكس ملقطش رقمًا | `fail_count+1` — 3 مرات ورا بعض → `needs_review=true` والمحرك يسيبه لحد ما تتدخل |
| السعر الملقط خارج نطاق `0.3x – 3x` من القديم | **مش بيتطبق** — العنصر للمراجعة فورًا |
| فرق أقل من 0.01 | بيتجاهل (ضجيج كسور/عملات) |
| تغيّر حقيقي وسانه | يتطبّق فورًا + سطر جديد في `price_history` وتظهر في الصفحة العامة |

## ✍️ تغيّر يدوي (وضع manual)

لما تلاحظ سعر جديد بنفسك:
```sql
update price_watch set current_price=190, updated_at=now()
where app_slug='netflix' and plan_name='القياسية' and country='EG';

insert into price_history (watch_id, price, source)
  select id, 190, 'manual' from price_watch
  where app_slug='netflix' and plan_name='القياسية' and country='EG';
```

> 💡 لاحقًا هنعمل صفحة في `/admin` تنفذ نفس الخطوتين بضغطة واحدة (نفس نمط `PricesEditor` الموجود عندك).

## ➕ إضافة اشتراك جديد تحت الرصد

```sql
insert into price_watch (app_slug, plan_name, plan_note, country, currency, current_price)
values ('apple-tv', 'الشهرية', '4K', 'EG', 'EGP', 89.99);
```
الصفحة هتلاه تلقائيًا (الأيقونة والاسم بيجوا من داتا التطبيقات لو `app_slug` موجود فيها).

## 📈 الأفكار الجاية (الترقيات الطبيعية)

1. **تنبيهات فعلية**: لما `price_history` بيزيد سطر → إيميل/تيليجرام للمشتركين في `price_alerts` (الجدول والفورم جاهزين في تعليق `alert-form.tsx`)
2. **صفحة أدمن للمراجعة**: عناصر `needs_review` تظهر في لوحة التحكم بزرار «اطبق» / «تجاهل»
3. **OG card أسبوعي**: «حركة أسعار الأسبوع» للمشاركة على السوشيال
4. **Widget للصحفيين**: «متوسط زيادة الاشتراكات في مصر 2026» — داتا ملكية ترفع سلطة العلامة

---

**واحدة من أهم الأصول في المشروع بدأت تتبنى من النهاردة.** كل يوم شغال = تاريخ أكبر لا يمكن تقليده.
