import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { PUBLISHED_REPORTS } from "@/lib/quarterly-report";

export const metadata: Metadata = buildMeta({
  title: "التقارير الربع سنوية — مؤشر الاقتصاد الرقمي | AppHub",
  description:
    "تقارير دورية محسوبة تلقائيًا من رادارات AppHub الأربعة ومؤشر الأسعار: الاشتراكات، الشدات، اتصالات الإنترنت، وأدوات الـ AI.",
  url: "https://apphub.eg/reports",
  keywords: ["تقرير ربع سنوي", "مؤشر الاقتصاد الرقمي", "أسعار مصر", "بيانات"]
});

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">📊</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">التقارير الربع سنوية</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          كل رقم في كل تقرير محسوب تلقائيًا من نفس الداتا اللي بتشغّل راداراتنا الأربعة —
          صفر مقدمة يدوية، ومنهجية منشورة.
        </p>
      </div>

      <div className="space-y-4">
        {PUBLISHED_REPORTS.map((r) => (
          <Link
            key={r.id}
            href={`/reports/${r.id}`}
            className="block rounded-3xl bg-white p-6 sm:p-8 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-accent-600 uppercase tracking-widest">تقرير محسوب تلقائيًا</p>
                <h2 className="font-extrabold text-xl sm:text-2xl text-brand-900 group-hover:text-accent-600 transition">
                  {r.titleAr}
                </h2>
                <p className="text-sm text-charcoal-500">{r.periodAr} · ٤ رادارات + المؤشر العام</p>
              </div>
              <div className="shrink-0 rounded-full bg-accent-400 px-5 py-2.5 text-sm font-bold text-brand-900">
                📖 افتح التقرير
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-brand-50 p-5 text-sm text-charcoal-600 text-center space-y-1">
        <p>
          للصحافة: <Link href="/press" className="font-bold underline">مركز الصحافة</Link> بفيه اقتباسات جاهزة وعيّنة تقرير CSV —
          وللشركات: <Link href="/data" className="font-bold underline">الوصول الكامل عبر API</Link> من الباقات المميزة.
        </p>
      </div>
    </div>
  );
}
