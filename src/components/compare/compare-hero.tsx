import type { Comparison } from "@/data/comparisons";

export function CompareHero({ comparison: c }: { comparison: Comparison }) {
  return (
    <header className="text-center">
      <span className="rounded-full bg-accent-100 text-accent-700 px-4 py-1.5 text-sm font-bold">
        ⚖️ مقارنة {c.category}
      </span>

      <div className="mt-8 flex items-center justify-center gap-4 sm:gap-8">
        {c.apps.map((a, i) => (
          <div key={a.appSlug} className="flex items-center gap-4 sm:gap-8">
            {i > 0 && (
              <span className="rounded-full bg-brand-900 px-3.5 py-1.5 text-sm font-black text-white shadow-soft">
                VS
              </span>
            )}
            <div className="flex flex-col items-center">
              <span className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-5xl shadow-soft">
                {a.icon}
              </span>
              <span className="mt-3 font-bold text-brand-900">{a.name}</span>
              <span className="text-sm text-accent-600">⭐ {a.rating}</span>
            </div>
          </div>
        ))}
      </div>

      <h1 className="heading-display mt-8 text-3xl sm:text-4xl text-brand-900">{c.h1}</h1>
      <p className="mx-auto mt-4 max-w-2xl leading-8 text-charcoal-500">{c.intro}</p>

      <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-sage-50 border border-sage-200 px-3 py-1 text-xs font-bold text-sage-700">
        🔄 آخر تحديث:{" "}
        {new Date(c.updatedAt).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </p>
    </header>
  );
}
