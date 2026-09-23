import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMeta } from "@/lib/seo";
import { safeJsonLd } from "@/lib/json-ld";
import { getReport, PUBLISHED_REPORTS } from "@/lib/quarterly-report";

export const revalidate = 3600;

type Params = { params: { quarter: string } };

export function generateStaticParams() {
  return PUBLISHED_REPORTS.map((r) => ({ quarter: r.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const meta = PUBLISHED_REPORTS.find((r) => r.id === params.quarter);
  if (!meta) return {};
  return buildMeta({
    title: `${meta.titleAr} | AppHub`,
    description: `تقرير ${meta.periodAr}: فجوة أسعار الشدات رسمي vs سوق، أرخص جيجا إنترنت، اشتراكات الـ AI — محسوب تلقائيًا من رادارات AppHub.`,
    url: `https://apphub.eg/reports/${meta.id}`,
    keywords: ["تقرير ربع سنوي", "اقتصاد رقمي", "أسعار مصر"]
  });
}

const fmt = (n: number, digits = 2) =>
  n.toLocaleString("ar-EG", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export default async function ReportPage({ params }: Params) {
  const r = await getReport(params.quarter);
  if (!r) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "AnalysisNewsArticle",
    headline: r.titleAr,
    datePublished: r.generatedAt.slice(0, 10),
    author: { "@type": "Organization", name: "AppHub", url: "https://apphub.eg" },
    publisher: { "@type": "Organization", name: "AppHub", url: "https://apphub.eg" }
  };

  const idx = r.index;
  const idxUp = idx.changePct >= 0;

  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }} />

      {/* رأس التقرير */}
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <p className="text-accent-300 font-bold text-sm mb-2">تقرير محسوب تلقائيًا · AppHub</p>
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">{r.titleAr}</h1>
        <p className="text-white/85 text-sm">{r.periodAr} · عينة الأسعار: {r.reviewDatesAr}</p>
        <p className="text-white/60 text-xs mt-3" dir="ltr">Generated: {r.generatedAt.slice(0, 19)} UTC</p>
      </div>

      {/* ① المؤشر العام */}
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-4">
        <h2 className="heading-elegant text-2xl text-brand-900">① مؤشر أسعار الاشتراكات العام</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-brand-50 p-5 text-center">
            <p className="text-sm text-charcoal-500 mb-1">القيمة الحالية</p>
            <p className="text-4xl font-extrabold text-brand-900" dir="ltr">{fmt(idx.current, 1)}</p>
            <p className="text-xs text-charcoal-400 mt-1">الأساس ١٠٠ (١٢ مايو ٢٠٢٥)</p>
          </div>
          <div className="rounded-2xl bg-brand-50 p-5 text-center">
            <p className="text-sm text-charcoal-500 mb-1">إجمالي التغير منذ الأساس</p>
            <p className={`text-4xl font-extrabold ${idxUp ? "text-red-600" : "text-sage-700"}`} dir="ltr">
              {idxUp ? "+" : ""}{fmt(idx.changePct, 1)}%
            </p>
          </div>
          <div className="rounded-2xl bg-brand-50 p-5 text-center">
            <p className="text-sm text-charcoal-500 mb-1">الخطط المتتبعة</p>
            <p className="text-4xl font-extrabold text-brand-900">{idx.plansCount}</p>
            <p className="text-xs text-charcoal-400 mt-1">↑ {idx.upCount} زادت · ↓ {idx.downCount} نقصت</p>
          </div>
        </div>
        <p className="text-xs text-charcoal-400">شرط المنهجية: لا تتسجل حركة إلا بتأكيد متقاطع من مصدرين — الزيادة مش غيبة في الرقم.</p>
      </section>

      {/* ② فجوة الـ UC */}
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-elegant text-2xl text-brand-900">② 🎮 فجوة أسعار الشدات: الرسمي vs السوق</h2>
          <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-700">{r.ucPacksCount} باك رسمي</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-cream-200 text-charcoal-500">
                <th className="p-3 text-right">الباك</th>
                <th className="p-3 text-center">الرسمي (للـ١٠٠)</th>
                <th className="p-3 text-center">متوسط السوق (للـ١٠٠)</th>
                <th className="p-3 text-center">الفجوة</th>
              </tr>
            </thead>
            <tbody>
              {r.ucGaps.map((g) => (
                <tr key={g.pack} className="border-b border-cream-100">
                  <td className="p-3 font-bold text-brand-900">{g.pack}</td>
                  <td className="p-3 text-center" dir="ltr">{fmt(g.officialPer100)} ج</td>
                  <td className="p-3 text-center" dir="ltr">{fmt(g.marketPer100)} ج</td>
                  <td className={`p-3 text-center font-extrabold ${g.gapPct < 0 ? "text-sage-700" : "text-red-600"}`} dir="ltr">
                    {g.gapPct > 0 ? "+" : ""}{fmt(g.gapPct, 1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl bg-sage-50 p-4 text-sm text-sage-800">
          <strong>الخلاصة:</strong> أرخص قناة رسمية بتديك {fmt(r.bestOfficialUcPer100)} ج لكل ١٠٠ UC —
          والسوق الموازي بيفرض فارق يوازي «ضريبة جهل» على المستخدم المصري.
          <Link href="/uc-radar" className="font-bold underline block mt-1">التفاصيل في رادار الـ UC →</Link>
        </div>
      </section>

      {/* ③ تيليك + AI */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-3">
          <h2 className="heading-elegant text-2xl text-brand-900">③ 📶 أرخص جيجا في السوق</h2>
          <div className="rounded-2xl bg-brand-50 p-5 text-center space-y-1">
            <p className="text-4xl font-extrabold text-accent-600" dir="ltr">{fmt(r.bestTelecom.perGb)} ج</p>
            <p className="text-sm font-bold text-brand-900">{r.bestTelecom.label}</p>
            <p className="text-xs text-charcoal-400">من أصل {r.bundlesCount} باقة من ٣ شبكات</p>
          </div>
          <Link href="/telecom-radar" className="text-sm font-bold text-accent-700 underline block">رادار الباقات →</Link>
        </section>

        <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-3">
          <h2 className="heading-elegant text-2xl text-brand-900">④ 🤖 تثبيث أسعار الـ AI</h2>
          <div className="rounded-2xl bg-brand-50 p-5 text-center space-y-1">
            <p className="text-4xl font-extrabold text-accent-600" dir="ltr">${fmt(r.cheapestAi.usd, 2)}</p>
            <p className="text-sm font-bold text-brand-900">أرخص اشتراك: {r.cheapestAi.name}</p>
            <p className="text-xs text-charcoal-400">{r.aiAt20Count} خطط ثابتة عند معيار $20/شهر من أصل {r.aiToolsCount} أدوات</p>
          </div>
          <Link href="/ai-radar" className="text-sm font-bold text-accent-700 underline block">رادار الـ AI →</Link>
        </section>
      </div>

      {/* سياسة الاستخدام */}
      <section className="rounded-2xl border-2 border-accent-300 bg-accent-50 p-5 text-sm text-charcoal-600 space-y-2">
        <p className="font-bold text-brand-900">📜 شروط الاستخدام والاقتباس:</p>
        <ul className="space-y-1">
          <li>• الإعادة والنشر مسموحين <strong>بشرط الإشارة الصريحة</strong>: «مؤشر AppHub — apphub.eg».</li>
          <li>• كل الأرقام من مصادر رسمية موثقة بتواريخ مراجعة مذكورة برأس التقرير — صفر تقديرات.</li>
          <li>• المواد القابلة إعادة الاستخدام للبحث: <a href="/api/reports/index.csv" className="font-bold underline">عينة CSV</a> · <Link href="/press" className="font-bold underline">Press Kit</Link> · <Link href="/data" className="font-bold underline">وصول API للشركات</Link>.</li>
        </ul>
      </section>
    </div>
  );
}
