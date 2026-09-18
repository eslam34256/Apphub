import type { Comparison } from "@/data/comparisons";

export function PricingSection({ comparison: c }: { comparison: Comparison }) {
  return (
    <section aria-labelledby="pricing" className="mt-12">
      <h2 id="pricing" className="heading-elegant text-2xl text-brand-900">
        💰 الأسعار حسب البلد
      </h2>

      <div className="mt-5 space-y-5">
        {c.pricing.map((cp, ci) => (
          <div key={ci} className="card-elegant p-6">
            <h3 className="font-bold text-lg text-brand-900">{cp.country}</h3>

            {cp.plans.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {c.apps.map((app, ai) => {
                  const plans = cp.plans.filter((p) => p.appIndex === ai);
                  if (!plans.length) return null;
                  return (
                    <div key={app.appSlug} className="rounded-2xl border-2 border-cream-200 p-4 bg-white">
                      <p className="mb-3 font-bold text-brand-900">
                        {app.icon} {app.name}
                      </p>
                      <ul className="space-y-2.5">
                        {plans.map((p, pi) => (
                          <li key={pi} className="rounded-xl bg-cream-50 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-charcoal-500">{p.name}</span>
                              <span className="text-sm font-black text-brand-900">{p.price}</span>
                            </div>
                            {p.note && <p className="mt-1 text-xs text-accent-600">{p.note}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {cp.footnote && (
              <p className="mt-4 rounded-xl bg-accent-50 border border-accent-200 p-3 text-sm leading-7 text-accent-800">
                💡 {cp.footnote}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
