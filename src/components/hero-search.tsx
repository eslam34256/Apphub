"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppItem } from "@/lib/types";
import { categoryLabels } from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";

// بحث تفاعلي في الـ Hero: اقتراحات حية + Enter يوديك /apps?q=... أو صفحة التطبيق مباشرة
export function HeroSearch({ apps }: { apps: AppItem[] }) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  const ql = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!ql) return [];
    return apps
      .filter(
        (a) =>
          a.name.toLowerCase().includes(ql) ||
          a.shortDescription.toLowerCase().includes(ql) ||
          a.tags.join(" ").toLowerCase().includes(ql)
      )
      .slice(0, 8);
  }, [apps, ql]);

  // قفل القايمة لما تضغط بره
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function go() {
    if (hi >= 0 && results[hi]) {
      router.push(`/apps/${results[hi].slug}`);
      return;
    }
    if (ql) router.push(`/apps?q=${encodeURIComponent(q.trim())}`);
    else router.push("/apps");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      go();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, results.length - 1));
      setOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // شرائح الرائج — أسماء حقيقية من الداتا نفسها (مفيش ترجمة ملفوظة)
  const trendingSlugs = ["netflix", "spotify", "shahid", "talabat"];
  const trending = trendingSlugs
    .map((slug) => apps.find((a) => a.slug === slug))
    .filter((a): a is AppItem => Boolean(a));

  const placeholder =
    lang === "ar"
      ? "دوّر على تطبيق أو اشتراك… (مثلًا: نتفليكس، سبوتيفاي، شاهد)"
      : "Search an app or subscription… (e.g. Netflix, Spotify, Shahid)";
  const searchLabel = lang === "ar" ? "بحث" : "Search";
  const trendingLabel = lang === "ar" ? "الأكثر رواجًا:" : "Trending:";
  const emptyText =
    lang === "ar"
      ? "مفيش نتائج مطابقة — جرّب اسم تاني"
      : "No matching results — try another name";

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl mx-auto text-right">
      {/* صندوق البحث */}
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-2xl ring-1 ring-black/10">
        <span className="text-xl" aria-hidden>🔍</span>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setHi(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={lang === "ar" ? "بحث في التطبيقات" : "Search apps"}
          className="w-full bg-transparent py-3 text-base sm:text-lg text-brand-900 placeholder:text-charcoal-400 focus:outline-none"
        />
        <button
          onClick={go}
          className="shrink-0 bg-accent-400 text-brand-900 px-6 py-3 rounded-full font-bold hover:bg-accent-500 transition"
        >
          {searchLabel}
        </button>
      </div>

      {/* الاقتراحات الحية */}
      {open && ql.length > 0 && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden z-30"
        >
          {results.map((a, i) => (
            <Link
              key={a.id}
              href={`/apps/${a.slug}`}
              role="option"
              aria-selected={hi === i}
              onMouseEnter={() => setHi(i)}
              className={`flex items-center gap-3 px-5 py-3 transition ${
                hi === i ? "bg-cream-100" : "bg-white"
              }`}
            >
              <span className="text-2xl" aria-hidden>{a.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-brand-900 truncate">{a.name}</span>
                <span className="block text-xs text-charcoal-500 truncate">
                  {categoryLabels[a.category] ?? a.category}
                </span>
              </span>
              <span className="text-sm text-amber-600 font-bold shrink-0">
                ★ {a.rating.toFixed(1)}
              </span>
            </Link>
          ))}
          {results.length === 0 && (
            <p className="px-5 py-4 text-sm text-charcoal-500">{emptyText}</p>
          )}
        </div>
      )}

      {/* شرائح الرائج */}
      {trending.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-white/70 ml-1">{trendingLabel}</span>
          {trending.map((a) => (
            <Link
              key={a.id}
              href={`/apps/${a.slug}`}
              className="rounded-full bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-1.5 hover:bg-white/20 transition"
            >
              {a.icon} {a.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
