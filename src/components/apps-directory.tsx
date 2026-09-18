"use client";

import { useMemo, useState } from "react";
import { AppCard } from "./app-card";
import { groupAppsBySubcategory, subcategoryOf } from "@/data/subcategories";
import { AppItem, CountryCode, AppCategory } from "@/lib/types";
import { categoryLabels, countryLabels, categoryIcons } from "@/lib/constants";

export function AppsDirectory({ apps }: { apps: AppItem[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<CountryCode | "all">("all");
  const [viewMode, setViewMode] = useState<"categories" | "all">("categories");

  // فلترة بالبحث والبلد
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesQuery =
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        app.tags.join(" ").toLowerCase().includes(query.toLowerCase());

      const matchesCountry = country === "all" || app.countries.includes(country);

      return matchesQuery && matchesCountry;
    });
  }, [apps, query, country]);

  // تجميع التطبيقات حسب الفئة
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, AppItem[]> = {};

    filteredApps.forEach((app) => {
      if (!groups[app.category]) {
        groups[app.category] = [];
      }
      groups[app.category].push(app);
    });

    return groups;
  }, [filteredApps]);

  // ترتيب الفئات
  const categoryOrder: AppCategory[] = [
    "food",
    "streaming",
    "shopping",
    "transport",
    "finance",
    "health",
    "education",
    "real-estate",
    "travel",
    "gaming",
    "kids",
    "tools",
    "religious",
    "government",
    "freelance"
  ];

  return (
    <div className="space-y-6">
      {/* Header مع البحث والفلترة */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              دليل التطبيقات
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {filteredApps.length} تطبيق في {Object.keys(groupedByCategory).length} فئة
            </p>
          </div>

          {/* أزرار التبديل */}
          <div className="hidden gap-2 rounded-2xl bg-slate-100 p-1 md:flex">
            <button
              onClick={() => setViewMode("categories")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                viewMode === "categories"
                  ? "bg-white text-brand-600 shadow"
                  : "text-slate-600"
              }`}
            >
              📂 حسب الفئة
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                viewMode === "all"
                  ? "bg-white text-brand-600 shadow"
                  : "text-slate-600"
              }`}
            >
              📋 الكل
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500"
            placeholder="🔍 ابحث عن تطبيق..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500"
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode | "all")}
          >
            <option value="all">🌍 كل البلدان</option>
            {(["EG", "SA", "AE"] as CountryCode[]).map((c) => (
              <option key={c} value={c}>
                {countryLabels[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* عرض التطبيقات */}
      {viewMode === "categories" ? (
        // عرض حسب الفئة
        <div className="space-y-8">
          {categoryOrder.map((cat) => {
            const categoryApps = groupedByCategory[cat];
            if (!categoryApps || categoryApps.length === 0) return null;

            return (
              <section key={cat} className="space-y-4">
                {/* Header الفئة */}
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-l from-brand-600 to-slate-900 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{categoryIcons[cat]}</span>
                    <div>
                      <h2 className="text-xl font-extrabold">
                        {categoryLabels[cat]}
                      </h2>
                      <p className="text-sm text-white/80">
                        {categoryApps.length} تطبيق
                      </p>
                    </div>
                  </div>
                  <a
                    href={`#${cat}`}
                    className="hidden rounded-full bg-white/20 px-4 py-2 text-sm md:block"
                  >
                    عرض الكل ←
                  </a>
                </div>

                {/* التطبيقات في الفئة + فلاتر فرعية */}
                <CategoryAppsGrid cat={cat} apps={categoryApps} />
              </section>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-2xl">🔍</p>
              <p className="mt-2 text-slate-500">مفيش نتائج لبحثك</p>
            </div>
          )}
        </div>
      ) : (
        // عرض الكل
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * شبكة قسم واحد + فلاتر فرعية (شحن/فيديو/موسيقى...) —
 * بتظهر بس لما الفئة فيها أكتر من نوع، فالمستخدم يرشّح بدقة
 * (مثلاً: ستريمنج ← أفلام ومسلسلات / موسيقى وبودكاست).
 */
function CategoryAppsGrid({ cat, apps }: { cat: AppCategory; apps: AppItem[] }) {
  const [sub, setSub] = useState<string>("all");
  const groups = useMemo(() => groupAppsBySubcategory(apps), [apps]);
  const shown =
    sub === "all" ? apps : apps.filter((a) => subcategoryOf(a) === sub);

  return (
    <div id={cat} className="space-y-4">
      {groups.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSub("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              sub === "all"
                ? "bg-brand-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            الكل ({apps.length})
          </button>
          {groups.map((g) => (
            <button
              key={g.key}
              onClick={() => setSub(g.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                sub === g.key
                  ? "bg-brand-600 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {g.icon} {g.label} ({g.apps.length})
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
