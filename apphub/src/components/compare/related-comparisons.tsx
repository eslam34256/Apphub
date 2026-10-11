import Link from "next/link";
import { getComparisonBySlug, type Comparison } from "@/data/comparisons";

/**
 * ربط داخلي بين المقارنات — بيوزع قوة الصفحات وبيخلي جوجل يفهم هيكل الموقع.
 */
export function RelatedComparisons({ comparison: c }: { comparison: Comparison }) {
  const related = c.related
    .map((slug) => getComparisonBySlug(slug))
    .filter((r): r is Comparison => Boolean(r));

  if (!related.length) return null;

  return (
    <section aria-labelledby="related" className="mt-12">
      <h2 id="related" className="heading-elegant text-2xl text-brand-900">
        🔗 مقارنات ذات صلة
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {related.map((r) => (
          <Link
            key={r.slug}
            href={`/compare/${r.slug}`}
            className="card-elegant group p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="flex items-center gap-1.5 text-2xl" aria-hidden>
              {r.apps.map((a, i) => (
                <span key={a.appSlug} className="flex items-center gap-1.5">
                  {a.icon}
                  {i === 0 && <span className="text-xs font-black text-charcoal-300">VS</span>}
                </span>
              ))}
            </div>
            <p className="mt-3 font-bold text-brand-900 group-hover:text-accent-600 transition">{r.h1}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-charcoal-500">{r.metaDescription}</p>
            <span className="mt-3 inline-block text-sm font-bold text-accent-600">اقرأ المقارنة ←</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
