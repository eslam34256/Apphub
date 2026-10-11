import type { Comparison } from "@/data/comparisons";

export function ComparisonTable({ comparison: c }: { comparison: Comparison }) {
  return (
    <section aria-labelledby="details-table" className="mt-12">
      <h2 id="details-table" className="heading-elegant text-2xl text-brand-900">
        📊 مقارنة تفصيلية بند ببند
      </h2>

      <div className="card-elegant mt-5 overflow-x-auto p-0">
        <table className="w-full min-w-[560px] border-collapse text-right">
          <thead>
            <tr className="bg-brand-900 text-white">
              <th scope="col" className="p-4 text-sm font-bold">وجه المقارنة</th>
              {c.apps.map((a) => (
                <th key={a.appSlug} scope="col" className="p-4 text-sm font-bold">
                  {a.icon} {a.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.criteria.map((row, ri) => (
              <tr key={ri} className={ri % 2 ? "bg-cream-50" : "bg-white"}>
                <th scope="row" className="p-4 align-top text-sm font-bold text-brand-900">
                  {row.label}
                </th>
                {row.values.map((v, vi) => (
                  <td
                    key={vi}
                    className={`p-4 align-top text-sm leading-7 ${
                      row.winner === vi
                        ? "bg-sage-50 font-bold text-sage-700"
                        : "text-charcoal-500"
                    }`}
                  >
                    {row.winner === vi && (
                      <span className="ml-1 inline-block rounded-full bg-sage-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        الأفضل ✓
                      </span>
                    )}
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
