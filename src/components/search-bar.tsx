"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { apps as staticApps } from "@/data/apps";
import Link from "next/link";

type QuickResult = {
  type: "app" | "deal" | "blog";
  title: string;
  subtitle: string;
  link: string;
  icon: string;
};

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuickResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // إغلاق النتائج عند الضغط خارج
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // بحث سريع مع debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.toLowerCase();

      // ابحث في التطبيقات الثابتة
      const appResults: QuickResult[] = staticApps
        .filter(
          (app) =>
            app.name.toLowerCase().includes(q) ||
            app.tags.join(" ").toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((app) => ({
          type: "app",
          title: app.name,
          subtitle: app.shortDescription,
          link: `/apps/${app.slug}`,
          icon: app.icon
        }));

      // ابحث في Supabase
      const supabase = createClient();
      const { data: dbApps } = await supabase
        .from("managed_apps")
        .select("slug, name, icon, short_description")
        .eq("is_active", true)
        .ilike("name", `%${q}%`)
        .limit(5);

      const dbAppResults: QuickResult[] = (dbApps ?? []).map((app: any) => ({
        type: "app",
        title: app.name,
        subtitle: app.short_description || "",
        link: `/apps/${app.slug}`,
        icon: app.icon
      }));

      // ادمج وشيل المكرر
      const seen = new Set<string>();
      const combined = [...dbAppResults, ...appResults].filter((r) => {
        if (seen.has(r.link)) return false;
        seen.add(r.link);
        return true;
      }).slice(0, 7);

      setResults(combined);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
      setQuery("");
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="🔍 ابحث في AppHub..."
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 pr-10 text-sm outline-none focus:border-brand-500 focus:bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* النتائج السريعة */}
      {showResults && query.length >= 2 && (
        <div className="absolute right-0 left-0 top-full mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
          {loading && (
            <div className="p-4 text-center text-sm text-slate-500">
              ⏳ جاري البحث...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              مفيش نتائج لـ "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((result, i) => (
                <Link
                  key={i}
                  href={result.link}
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{result.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {result.subtitle}
                    </p>
                  </div>
                </Link>
              ))}

              {/* زرار "اعرض كل النتائج" */}
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setShowResults(false);
                  setQuery("");
                }}
                className="block w-full bg-brand-50 px-4 py-3 text-center text-sm font-bold text-brand-600 hover:bg-brand-100"
              >
                🔍 شوف كل النتائج لـ "{query}" ←
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}