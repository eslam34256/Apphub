"use client";

import { useEffect, useState, useMemo } from "react";
import { getMonthlyPrice } from "@/lib/helpers";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { apps as staticApps } from "@/data/apps";
import { deals } from "@/data/deals";
import Link from "next/link";
import { AppCard } from "@/components/app-card";
import { categoryLabels } from "@/lib/constants";
import { AppItem } from "@/lib/types";

type SearchResults = {
  apps: AppItem[];
  deals: any[];
  blog: any[];
};

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults>({
    apps: [],
    deals: [],
    blog: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "apps" | "deals" | "blog">("all");

  // v42 — فلاتر ما بعد البحث: دولة + مجاني/مدفوع + ترتيب (بتتطبق فورًا على النتائج)
  const [fCountry, setFCountry] = useState<"all" | "EG" | "SA" | "AE">("all");
  const [fPrice, setFPrice] = useState<"all" | "free" | "paid">("all");
  const [fSort, setFSort] = useState<"rel" | "rating" | "price">("rel");
  const shownApps = useMemo(() => {
    let list = [...results.apps];
    if (fCountry !== "all") list = list.filter(a => a.countries.includes(fCountry));
    const cc = fCountry === "all" ? "EG" : fCountry;
    if (fPrice !== "all") {
      list = list.filter(a => (fPrice === "free" ? getMonthlyPrice(a, cc) === 0 : getMonthlyPrice(a, cc) > 0));
    }
    if (fSort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (fSort === "price") list.sort((a, b) => getMonthlyPrice(a, cc) - getMonthlyPrice(b, cc));
    return list;
  }, [results.apps, fCountry, fPrice, fSort]);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      setResults({ apps: [], deals: [], blog: [] });
      return;
    }

    setLoading(true);
    const q = searchQuery.toLowerCase().trim();

    const supabase = createClient();

    // جيب التطبيقات من Supabase
    const { data: dbApps } = await supabase
      .from("managed_apps")
      .select("*")
      .eq("is_active", true);

    const dbAppsMapped: AppItem[] = (dbApps ?? []).map((app: any) => ({
      id: `db-${app.id}`,
      slug: app.slug,
      name: app.name,
      icon: app.icon,
      category: app.category,
      shortDescription: app.short_description || "",
      description: app.description || "",
      rating: parseFloat(app.rating) || 0,
      pros: Array.isArray(app.pros) ? app.pros : [],
      cons: Array.isArray(app.cons) ? app.cons : [],
      countries: Array.isArray(app.countries) ? app.countries : [],
      pricing: Array.isArray(app.pricing) ? app.pricing : [],
      tags: Array.isArray(app.tags) ? app.tags : [],
      businessUse: Array.isArray(app.business_use) ? app.business_use : []
    }));

    const dbSlugs = new Set(dbAppsMapped.map((a) => a.slug));
    const filteredStatic = staticApps.filter((a) => !dbSlugs.has(a.slug));
    const allApps = [...dbAppsMapped, ...filteredStatic];

    // ابحث في التطبيقات
    const matchedApps = allApps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tags.join(" ").toLowerCase().includes(q) ||
        categoryLabels[app.category]?.toLowerCase().includes(q)
    );

    // ابحث في العروض
    const { data: dbDeals } = await supabase
      .from("managed_deals")
      .select("*")
      .eq("is_active", true);

    const allDeals = [
      ...(dbDeals ?? []).map((d: any) => ({ ...d, isDb: true })),
      ...deals.map((d) => ({ ...d, isDb: false }))
    ];

    const matchedDeals = allDeals.filter(
      (deal: any) =>
        deal.title?.toLowerCase().includes(q) ||
        deal.brand?.toLowerCase().includes(q) ||
        deal.category?.toLowerCase().includes(q)
    );

    // ابحث في المدونة
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true);

    const matchedBlog = (blogPosts ?? []).filter(
      (post: any) =>
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q)
    );

    setResults({
      apps: matchedApps,
      deals: matchedDeals,
      blog: matchedBlog
    });

    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  }

  const totalResults = shownApps.length + results.deals.length + results.blog.length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-8 text-white">
        <p className="mb-2 text-sm text-white/80">🔍 البحث في AppHub</p>
        <h1 className="text-3xl font-extrabold">ابحث في كل حاجة</h1>
        <p className="mt-2 text-white/90">
          تطبيقات • عروض • مقالات • فئات
        </p>
      </div>

      {/* فورم البحث */}
      <form onSubmit={handleSearch} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن تطبيق، عرض، مقال..."
            className="flex-1 rounded-2xl border border-slate-300 px-5 py-4 text-lg outline-none focus:border-brand-500"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-2xl bg-brand-600 px-8 py-4 font-bold text-white hover:bg-brand-500"
          >
            🔍 بحث
          </button>
        </div>

        {/* اقتراحات سريعة */}
        {!query && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-slate-500">اقتراحات سريعة:</p>
            <div className="flex flex-wrap gap-2">
              {["نتفليكس", "طلبات", "كريم", "أكل", "مواصلات", "بنوك", "تعليم"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      performSearch(suggestion);
                    }}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-brand-50"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </form>

      {/* النتائج */}
      {loading && (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-4xl">⏳</p>
          <p className="mt-2 text-slate-500">جاري البحث...</p>
        </div>
      )}

      {!loading && initialQuery && (
        <>
          {/* عدد النتائج */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">
              {totalResults > 0 ? (
                <>
                  وجدنا <span className="font-bold text-brand-600">{totalResults}</span> نتيجة لـ "
                  <span className="font-bold">{initialQuery}</span>"
                </>
              ) : (
                <>
                  مفيش نتائج لـ "<span className="font-bold">{initialQuery}</span>"
                </>
              )}
            </p>
          </div>

          {shownApps.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm text-xs">
              <span className="font-bold text-slate-500">تصفية وترتيب:</span>
              <select value={fCountry} onChange={e => setFCountry(e.target.value as "all" | "EG" | "SA" | "AE")} className="rounded-xl border border-cream-200 px-3 py-2">
                <option value="all">🌍 كل الدول</option>
                <option value="EG">مصر</option>
                <option value="SA">السعودية</option>
                <option value="AE">الإمارات</option>
              </select>
              <select value={fPrice} onChange={e => setFPrice(e.target.value as "all" | "free" | "paid")} className="rounded-xl border border-cream-200 px-3 py-2">
                <option value="all">💰 مجاني ومدفوع</option>
                <option value="free">مجاني فقط</option>
                <option value="paid">مدفوع</option>
              </select>
              <select value={fSort} onChange={e => setFSort(e.target.value as "rel" | "rating" | "price")} className="rounded-xl border border-cream-200 px-3 py-2">
                <option value="rel">الأكثر صلة</option>
                <option value="rating">الأعلى تقييمًا</option>
                <option value="price">الأرخص أولًا</option>
              </select>
            </div>
          )}

          {/* Tabs */}
          {totalResults > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              <TabButton
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                label={`🔍 الكل (${totalResults})`}
              />
              {shownApps.length > 0 && (
                <TabButton
                  active={activeTab === "apps"}
                  onClick={() => setActiveTab("apps")}
                  label={`📱 تطبيقات (${shownApps.length})`}
                />
              )}
              {results.deals.length > 0 && (
                <TabButton
                  active={activeTab === "deals"}
                  onClick={() => setActiveTab("deals")}
                  label={`💰 عروض (${results.deals.length})`}
                />
              )}
              {results.blog.length > 0 && (
                <TabButton
                  active={activeTab === "blog"}
                  onClick={() => setActiveTab("blog")}
                  label={`📝 مقالات (${results.blog.length})`}
                />
              )}
            </div>
          )}

          {/* نتائج التطبيقات */}
          {(activeTab === "all" || activeTab === "apps") && shownApps.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold">📱 التطبيقات</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {shownApps.slice(0, activeTab === "all" ? 6 : undefined).map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
              {activeTab === "all" && shownApps.length > 6 && (
                <button
                  onClick={() => setActiveTab("apps")}
                  className="mt-4 text-brand-600 hover:underline"
                >
                  عرض كل التطبيقات ({shownApps.length}) ←
                </button>
              )}
            </section>
          )}

          {/* نتائج العروض */}
          {(activeTab === "all" || activeTab === "deals") && results.deals.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold">💰 العروض</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.deals.slice(0, activeTab === "all" ? 3 : undefined).map((deal: any) => (
                  <div
                    key={deal.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="mb-2 text-xs text-slate-500">{deal.brand}</p>
                    <h3 className="mb-3 font-bold">{deal.title}</h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                      خصم {deal.discount}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* نتائج المدونة */}
          {(activeTab === "all" || activeTab === "blog") && results.blog.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold">📝 المدونة</h2>
              <div className="space-y-3">
                {results.blog.slice(0, activeTab === "all" ? 3 : undefined).map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-300"
                  >
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* لو مفيش نتائج */}
          {totalResults === 0 && (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
              <p className="text-6xl">🔍</p>
              <h3 className="mt-4 text-xl font-bold">مفيش نتائج</h3>
              <p className="mt-2 text-slate-500">
                جرب كلمات بحث مختلفة أو تصفح التطبيقات والعروض
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link
                  href="/apps"
                  className="rounded-2xl bg-brand-600 px-5 py-2 font-bold text-white"
                >
                  تصفح التطبيقات
                </Link>
                <Link
                  href="/deals"
                  className="rounded-2xl bg-emerald-600 px-5 py-2 font-bold text-white"
                >
                  شوف العروض
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-brand-600 text-white"
          : "bg-white text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}