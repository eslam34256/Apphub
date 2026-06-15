import Link from "next/link";
import { AppItem } from "@/lib/types";
import { categoryLabels, countryLabels } from "@/lib/constants";

export function AppCard({ app }: { app: AppItem }) {
  return (
    <Link href={`/apps/${app.slug}`} className="block">
      <div className="card-hover rounded-2xl bg-white p-5 shadow-soft border border-slate-100 h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-3xl shadow-sm shrink-0">
            {app.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg text-slate-900 truncate">{app.name}</h3>
              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 shrink-0">
                <span>⭐</span>
                <span>{app.rating}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{categoryLabels[app.category]}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {app.shortDescription}
        </p>

        {/* Countries */}
        <div className="flex flex-wrap gap-1 mb-4">
          {app.countries.slice(0, 3).map((country) => (
            <span
              key={country}
              className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700"
            >
              {countryLabels[country]}
            </span>
          ))}
        </div>

        {/* Tags */}
        {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {app.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">عرض التفاصيل</span>
          <span className="text-brand-600 group-hover:translate-x-[-4px] transition">←</span>
        </div>
      </div>
    </Link>
  );
}