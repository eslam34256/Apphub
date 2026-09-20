import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "بيانات وأبحاث — بيع تقارير السوق والـ API المدفوعة",
  description:
    "بيانات AppHub الفعلية: أسعار التطبيقات والاشتراكات في مصر والخليج — متاحة كتقرير مخصص أو API للشركات والبنوك.",
  url: "https://apphub.eg/data",
  keywords: ["بيانات سوق", "api أسعار", "تقارير سوق"]
});

const TIERS = [
  {
    name: "مجاني",
    price: "0 ج",
    tagline: "للمهتمين والمطورين",
    features: [
      "API عام بدون مفتاح (60 طلب/دقيقة)",
      "نقاط النهاية: /api/best, /api/price-index, /api/fx",
      "إعادة التحميل كل ساعة",
      "CC-BY سمة AppHub"
    ],
    cta: { label: "ابدأ فورًا", href: "/developers" },
    featured: false
  },
  {
    name: "Pro",
    price: "$29/شهر",
    tagline: "لشركات المتوسطة",
    features: [
      "5000 طلب/يوم (3× لكل ثانية)",
      "البيانات الكاملة: تاريخ ٧ سنوات + فروق العملات",
      "تصدير CSV لكل نقطة نهاية",
      "دعم بريدي خلال ٢٤ ساعة"
    ],
    cta: { label: "اطلب مفتاح API", href: "mailto:business@apphub.eg?subject=API Pro" },
    featured: true
  },
  {
    name: "Enterprise",
    price: "اتفاق خاص",
    tagline: "للبنوك والاستشارات",
    features: [
      "Rate-limit حر بالاتفاق",
      "تقرير مخصص شهري (صيغة PDF/Excel)",
      "SLA مكتوب واستشارة فنية",
      "White-label متاح"
    ],
    cta: { label: "احجز مكالمة", href: "mailto:business@apphub.eg?subject=API Enterprise" },
    featured: false
  }
];

export default function DataPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-6xl mb-3">📊</div>
        <h1 className="text-4xl font-extrabold mb-2">البيانات والأبحاث</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          نفس البيانات اللي بتظهر على AppHub — متاحة للشركات كـ API مرن أو تقارير استشارية مخصصة.
        </p>
      </div>

      {/* نبذة الجودة */}
      <div className="grid gap-4 md:grid-cols-3 text-center">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-3xl mb-1">📈</div>
          <div className="text-2xl font-extrabold text-brand-900">٧ سنين</div>
          <div className="text-sm text-charcoal-500">تاريخ أسعار متّصل</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-3xl mb-1">🌍</div>
          <div className="text-2xl font-extrabold text-brand-900">١٠ أسواق</div>
          <div className="text-sm text-charcoal-500">مصر + السعودية + الخليج + تركيا…</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-3xl mb-1">⏱️</div>
          <div className="text-2xl font-extrabold text-brand-900">كل ساعة</div>
          <div className="text-sm text-charcoal-500">تحديث المؤشر والفروقات</div>
        </div>
      </div>

      {/* الباقات */}
      <div>
        <h2 className="heading-elegant text-3xl text-brand-900 mb-6 text-center">اختر الوصول المناسب</h2>
        <div className="grid gap-5 md:grid-cols-3 items-stretch">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-6 shadow-soft flex flex-col gap-4 ${
                t.featured ? "gradient-brand text-white border-2 border-accent-400 scale-[1.03]" : "bg-white"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-400 px-4 py-1 text-xs font-extrabold text-brand-900">
                  الأكثر طلبًا
                </span>
              )}
              <div>
                <div className={`text-sm font-bold ${t.featured ? "text-white/80" : "text-charcoal-400"}`}>{t.tagline}</div>
                <div className={`text-xl font-extrabold ${t.featured ? "" : "text-brand-900"}`}>{t.name}</div>
                <div className="mt-1 text-xl font-extrabold">{t.price}</div>
              </div>
              <ul className="flex-1 space-y-2 text-sm">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.cta.href}
                className={`mt-auto text-center rounded-full px-5 py-3 text-sm font-bold transition ${
                  t.featured
                    ? "bg-accent-400 text-brand-900 hover:bg-accent-500"
                    : "bg-brand-900 text-white hover:bg-brand-800"
                }`}
              >
                {t.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* سؤال عادل */}
      <div className="rounded-3xl bg-white p-6 shadow-soft space-y-3">
        <h3 className="font-bold text-brand-900">❓ فين تُدفع القيمة فعليًا؟</h3>
        <ul className="text-sm text-charcoal-600 space-y-2">
          <li>• <strong>المجانية</strong>: للمهتمين والمطورين والتقارير الشخصية — كافية لـ ٩٠٪ من الحاجات.</li>
          <li>• <strong>Pro</strong>: لو بتحتاج داتا تاريخية أو أكتر من رجل أعمال/ساعة — بيُسد حجم استخدامك.</li>
          <li>• <strong>Enterprise</strong>: لو بتبني على البيانات (تأمين، تقرير ائتمان، عقد توريد) — منتناقش SLA وصلاحيات White-label.</li>
        </ul>
        <p className="rounded-xl bg-brand-50 p-3 text-xs text-charcoal-600 border-r-4 border-accent-400">
          💡 <strong>مثال:</strong> «مصرف محلي حابب يقارن أسعار اشتراكات في مصر مقابل الدولار السعودي للتهديف الائتماني»
          — Enterprise بيقيفل العقد ويخصم تقرير الشهر اتوماتيك من حسابه.
        </p>
      </div>
    </div>
  );
}
