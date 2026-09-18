import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/data/comparisons";
import { CompareTool } from "@/components/compare/compare-tool";

/**
 * /compare — مركز المقارنات:
 * 1) المقارنات التفصيلية الجاهزة (SEO pages)
 * 2) الأداة التفاعلية لمقارنة أي تطبيقين
 */
export const metadata: Metadata = {
  title: "كل المقارنات — اختار التطبيق الأنسب ليك",
  description:
    "مقارنات تفصيلية بالأسعار والمميزات بين أفضل التطبيقات: ستريمنج، مشاوير، توصيل أكل، تقسيط وأكثر — أو قارن بين أي تطبيقين بنفسك.",
  alternates: { canonical: "https://apphub-eight.vercel.app/compare" }
};

export default function CompareIndexPage() {
  const categories = [...new Set(comparisons.map((c) => c.category))];

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        <header className="text-center">
          <span className="rounded-full bg-accent-100 text-accent-700 px-4 py-1.5 text-sm font-bold">
            ⚖️ قارن بذكاء
          </span>
          <h1 className="heading-display mt-4 text-3xl sm:text-4xl text-brand-900">
            كل المقارنات
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-charcoal-500 leading-relaxed">
            مقارنات تفصيلية بالأسعار الحالية والميزات الحقيقية، بنحدّثها دوريًا —
            أو استخدم الأداة وقارن أي تطبيقين بنفسك.
          </p>
        </header>

        {/* المقارنات التفصيلية */}
        <section aria-labelledby="detailed" className="space-y-10">
          <h2 id="detailed" className="heading-elegant text-2xl text-brand-900">
            📑 مقارناتنا التفصيلية
          </h2>
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="flex items-center gap-2 font-bold text-charcoal-800 mb-4">
                <span className="h-2 w-2 rounded-full bg-accent-400" aria-hidden />
                {cat}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comparisons
                  .filter((c) => c.category === cat)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/compare/${c.slug}`}
                      className="card-elegant group p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      <div className="flex items-center gap-1.5 text-3xl" aria-hidden>
                        {c.apps.map((a, i) => (
                          <span key={a.appSlug} className="flex items-center gap-1.5">
                            {a.icon}
                            {i === 0 && (
                              <span className="text-xs font-black text-charcoal-300">VS</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <h4 className="mt-3 font-bold text-brand-900 group-hover:text-accent-600 transition">
                        {c.h1}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-charcoal-500">
                        {c.metaDescription}
                      </p>
                      <span className="mt-3 inline-block text-sm font-bold text-accent-600">
                        اقرأ المقارنة ←
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </section>

        {/* الأداة التفاعلية */}
        <section aria-label="أداة المقارنة التفاعلية" className="space-y-6">
          <CompareTool />
        </section>
      </div>
    </div>
  );
}
