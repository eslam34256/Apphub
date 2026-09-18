import type { Comparison } from "@/data/comparisons";

/**
 * details/summary بيشتغل من غير JavaScript —
 * النص موجود في الـ HTML الأصلي = جوجل بيقراه وبيظهره كـ FAQ rich result.
 */
export function ComparisonFaq({ comparison: c }: { comparison: Comparison }) {
  return (
    <section aria-labelledby="faq" className="mt-12">
      <h2 id="faq" className="heading-elegant text-2xl text-brand-900">
        🤔 أسئلة شائعة
      </h2>

      <div className="mt-5 space-y-3">
        {c.faq.map((f, i) => (
          <details key={i} className="card-elegant group p-5 open:ring-1 open:ring-accent-300">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-brand-900 marker:hidden">
              {f.q}
              <span aria-hidden className="shrink-0 text-charcoal-500 transition-transform group-open:rotate-180">
                ⌄
              </span>
            </summary>
            <p className="mt-3 leading-8 text-charcoal-500">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
