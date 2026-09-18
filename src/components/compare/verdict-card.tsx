import type { Comparison } from "@/data/comparisons";

export function VerdictCard({ comparison: c }: { comparison: Comparison }) {
  return (
    <section aria-labelledby="verdict" className="mt-10">
      <div className="card-elegant border-r-4 border-r-accent-400 p-6 sm:p-8">
        <h2 id="verdict" className="heading-elegant flex items-center gap-2 text-xl text-brand-900">
          🏆 الخلاصة السريعة
        </h2>
        <p className="mt-3 leading-8 text-charcoal-800">{c.verdict}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {c.bestFor.map((b, i) => (
          <div key={i} className="card-elegant flex items-start gap-3 p-4">
            <span className="text-2xl" aria-hidden>{c.apps[b.appIndex].icon}</span>
            <div>
              <p className="text-xs font-bold text-charcoal-500">
                {c.apps[b.appIndex].name} يناسبك لو...
              </p>
              <p className="mt-0.5 font-bold text-charcoal-800">{b.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
