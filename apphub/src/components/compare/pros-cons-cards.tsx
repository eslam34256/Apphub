import type { Comparison } from "@/data/comparisons";

export function ProsConsCards({ comparison: c }: { comparison: Comparison }) {
  return (
    <section aria-labelledby="proscons" className="mt-12">
      <h2 id="proscons" className="heading-elegant text-2xl text-brand-900">
        ⚖️ المميزات والعيوب
      </h2>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {c.apps.map((app, ai) => (
          <div key={app.appSlug} className="card-elegant overflow-hidden p-0">
            <div className="bg-cream-100 px-5 py-3 font-bold text-brand-900">
              {app.icon} {app.name}
            </div>
            <div className="p-5">
              <h3 className="text-sm font-black text-sage-600">✅ المميزات</h3>
              <ul className="mt-3 space-y-2">
                {c.pros[ai].map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-7 text-charcoal-800">
                    <span className="mt-1 text-sage-500 shrink-0" aria-hidden>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-cream-200 p-5">
              <h3 className="text-sm font-black text-red-600">❌ العيوب</h3>
              <ul className="mt-3 space-y-2">
                {c.cons[ai].map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-7 text-charcoal-800">
                    <span className="mt-1 text-red-400 shrink-0" aria-hidden>✗</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
