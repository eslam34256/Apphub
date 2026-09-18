import type { Metadata } from "next";
import Link from "next/link";
import {
  BEST_CATEGORIES,
  BEST_COUNTRIES,
  categoryEmoji,
  categoryName,
  comboAppCount
} from "@/lib/best";

/**
 * /best — فهرس صفحات الترشيحات البرمجية (45 صفحة).
 * نقطة دخول جوجل والمستخدمين لكل فئة × دولة.
 */

export const metadata: Metadata = {
  title: "الأفضل في بلدك — ترشيحات التطبيقات حسب الفئة والدولة",
  description:
    "ترشيحات AppHub المرتبة لأفضل التطبيقات في كل فئة (ستريمنج، أكل، مشاوير، تقسيط...) مخصوصة لكل دولة: مصر والسعودية والإمارات — بالأسعار المحلية والتقييم الحقيقي.",
  alternates: { canonical: "https://apphub-eight.vercel.app/best" }
};

export default function BestIndexPage() {
  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <header className="text-center">
          <span className="rounded-full bg-accent-100 text-accent-700 px-4 py-1.5 text-sm font-bold">
            🏆 ترشيحات مرتبة
          </span>
          <h1 className="heading-display mt-4 text-4xl md:text-5xl text-brand-900">
            الأفضل في بلدك
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-charcoal-500 leading-relaxed">
            اختار فئتك ودولتك — وهتلاقي القائمة مرتبة بالتقييم مع الأسعار
            المحلية بالعملة والمقارنات المتصلة. مش قايمة عشوائية — ترتيب على بيانات.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BEST_CATEGORIES.map((cat) => {
            const availableCountries = BEST_COUNTRIES.filter(
              (c) => comboAppCount(cat, c.code) >= 1
            );
            return (
              <div key={cat} className="card-elegant p-5">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center text-3xl shadow-soft">
                    {categoryEmoji[cat] ?? "📱"}
                  </span>
                  <div>
                    <h2 className="font-bold text-brand-900">{categoryName(cat)}</h2>
                    <p className="text-xs text-charcoal-500">
                      {comboAppCount(cat, "EG") + comboAppCount(cat, "SA") + comboAppCount(cat, "AE")} ترشيح إجمالي
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {availableCountries.map((c) => (
                    <Link
                      key={c.code}
                      href={`/best/${cat}/${c.slug}`}
                      className="rounded-full border-2 border-cream-200 bg-white px-4 py-2 text-sm font-bold text-charcoal-800 transition hover:border-accent-300 hover:text-accent-700"
                    >
                      {c.flag} {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
