"use client";

/**
 * 🧮 حاسبة المصروف الرقمي — الأداة التفاعلية:
 * اختار اشتراكاتك ← شوف الإجمالي الشهري/السنوي ← اكتشف فين توفر.
 * المشاركة عبر رابط فيه الاختيارات (?apps=netflix,shahid) — النتيجة ظاهرة
 * في عنوان الصفحة المشارَك قبل ما الرابط يتفتح أصلًا.
 */

import { useMemo, useState } from "react";
import { apps as allApps } from "@/data/apps";
import { categoryLabels } from "@/lib/constants";
import { formatMoney } from "@/lib/helpers";
import {
  paidAppsForCountry,
  calcTotals,
  categoryBreakdown,
  swapSuggestions,
  yearlyTips,
  currencyOf,
  monthlyOf
} from "@/lib/spend";
import { AppItem, CountryCode } from "@/lib/types";

const countryNames: Record<CountryCode, string> = {
  EG: "🇪🇬 مصر",
  SA: "🇸🇦 السعودية",
  AE: "🇦🇪 الإمارات"
};

export function CalculatorClient({
  initialApps,
  initialCountry
}: {
  initialApps: string[];
  initialCountry: CountryCode;
}) {
  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [selected, setSelected] = useState<Set<string>>(new Set(initialApps));
  const [copied, setCopied] = useState(false);

  const paidApps = useMemo(() => paidAppsForCountry(country), [country]);

  const selectedApps = useMemo(
    () =>
      allApps.filter(
        (a) => selected.has(a.slug) && monthlyOf(a, country) > 0
      ),
    [selected, country]
  );

  const totals = useMemo(() => calcTotals(selectedApps, country), [selectedApps, country]);
  const breakdown = useMemo(() => categoryBreakdown(selectedApps, country), [selectedApps, country]);
  const swaps = useMemo(() => swapSuggestions(selectedApps, country), [selectedApps, country]);
  const annualTips = useMemo(() => yearlyTips(selectedApps, country), [selectedApps, country]);
  const totalSwapSaving = swaps.reduce((s, x) => s + x.savingPerMonth, 0);
  const currency = currencyOf(country);

  // اختيارات مش متاحة في الدولة الحالية (فقدت عند التبديل)
  const unavailable = useMemo(
    () =>
      allApps.filter(
        (a) => selected.has(a.slug) && monthlyOf(a, country) === 0
      ),
    [selected, country]
  );

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  function applySwap(swapSlug: string, fromSlug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(fromSlug);
      next.add(swapSlug);
      return next;
    });
  }

  function shareUrl() {
    const url = new URL(window.location.href.split("?")[0]);
    url.searchParams.set("country", country);
    if (selected.size) url.searchParams.set("apps", [...selected].join(","));
    return url.toString();
  }

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="space-y-8">
      {/* اختيار الدولة */}
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(countryNames) as CountryCode[]).map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
              country === c
                ? "bg-brand-900 text-white shadow-soft"
                : "bg-white border border-cream-200 text-charcoal-500 hover:border-accent-300"
            }`}
          >
            {countryNames[c]}
          </button>
        ))}
      </div>

      {/* اختيار الاشتراكات */}
      <section className="card-elegant p-6">
        <h2 className="heading-elegant text-xl text-brand-900 mb-4">
          1️⃣ اختار اشتراكاتك الحالية
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {paidApps.map((app) => {
            const isOn = selected.has(app.slug);
            return (
              <button
                key={app.id}
                onClick={() => toggle(app.slug)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition border-2 ${
                  isOn
                    ? "bg-brand-900 text-white border-brand-900 shadow-soft"
                    : "bg-white text-charcoal-800 border-cream-200 hover:border-accent-300"
                }`}
                aria-pressed={isOn}
              >
                <span aria-hidden>{app.icon}</span>
                <span>{app.name}</span>
                <span className={`text-xs ${isOn ? "text-white/70" : "text-charcoal-500"}`} dir="ltr">
                  {formatMoney(monthlyOf(app, country), currency)}
                </span>
                {isOn && <span aria-hidden>✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* النتيجة */}
      {selectedApps.length > 0 ? (
        <section className="rounded-3xl bg-brand-900 text-white p-8 text-center shadow-soft">
          <p className="text-white/70 text-sm font-bold">إجمالي مصروفك الرقمي</p>
          <p className="heading-display text-5xl md:text-6xl mt-2" dir="ltr">
            {formatMoney(totals.monthly, currency)}
          </p>
          <p className="text-white/70 font-bold">شهريًا</p>
          <p className="mt-4 text-2xl font-bold text-accent-400" dir="ltr">
            {formatMoney(totals.yearly, currency)}
            <span className="text-sm text-white/70 font-normal"> / سنويًا 😳</span>
          </p>
          <p className="mt-2 text-sm text-white/60">
            {totals.count} اشتراك في {countryNames[country]}
          </p>
        </section>
      ) : (
        <section className="rounded-3xl border-2 border-dashed border-cream-300 bg-white/50 p-10 text-center">
          <p className="text-4xl" aria-hidden>👆</p>
          <p className="mt-3 font-bold text-charcoal-800">اختار اشتراكاتك من فوق عشان تحسب</p>
        </section>
      )}

      {/* التفصيل بالفئة */}
      {breakdown.length > 0 && (
        <section className="card-elegant p-6">
          <h2 className="heading-elegant text-xl text-brand-900 mb-4">
            2️⃣ فلوسك رايحة فين؟
          </h2>
          <div className="space-y-3">
            {breakdown.map((b) => {
              const pct = Math.round((b.total / totals.monthly) * 100);
              return (
                <div key={b.category}>
                  <div className="flex justify-between text-sm font-bold text-charcoal-800">
                    <span>{categoryLabels[b.category as keyof typeof categoryLabels] || b.category}</span>
                    <span dir="ltr">
                      {formatMoney(b.total, currency)} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-3 rounded-full bg-cream-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-accent-400 to-accent-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* اقتراحات التوفير */}
      {(swaps.length > 0 || annualTips.length > 0) && (
        <section className="card-elegant p-6 border-r-4 border-r-sage-400">
          <h2 className="heading-elegant text-xl text-brand-900 mb-1">
            3️⃣ طلّع توفرنا ليك
          </h2>
          {totalSwapSaving > 0 && (
            <p className="text-sm font-bold text-sage-600 mb-4">
              💚 لو نفّذت كل المقترحات دي: توفر {formatMoney(totalSwapSaving, currency)} شهريًا ≈{" "}
              {formatMoney(totalSwapSaving * 12, currency)} في السنة!
            </p>
          )}
          <ul className="space-y-3">
            {swaps.map((s, i) => (
              <li key={`swap-${i}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sage-50 border border-sage-200 p-4">
                <p className="text-sm text-charcoal-800">
                  <b>{s.from.icon} {s.from.name}</b> بتكلفك {formatMoney(monthlyOf(s.from, country), currency)} —{" "}
                  <b>{s.to.icon} {s.to.name}</b> (⭐{s.to.rating}) نفس الفئة بـ{" "}
                  {formatMoney(monthlyOf(s.to, country), currency)} بس!
                </p>
                <button
                  onClick={() => applySwap(s.to.slug, s.from.slug)}
                  className="rounded-full bg-sage-600 px-4 py-2 text-xs font-black text-white hover:bg-sage-700 transition whitespace-nowrap"
                >
                  بدّل ووفّر {formatMoney(s.savingPerMonth, currency)} ←
                </button>
              </li>
            ))}
            {annualTips.map((t, i) => (
              <li key={`annual-${i}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent-50 border border-accent-200 p-4">
                <p className="text-sm text-charcoal-800">
                  باقة <b>{t.app.icon} {t.app.name}</b> السنوية ({formatMoney(t.yearly, currency)})
                  توفرلك <b>{formatMoney(t.savingPerMonth, currency)}/شهر</b> مقارنة بالدفع الشهري.
                </p>
                <span className="rounded-full bg-accent-100 px-4 py-2 text-xs font-black text-accent-700 whitespace-nowrap">
                  💡 ادفع سنوي
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* تنبيه الغير متوفرين + مشاركة */}
      {unavailable.length > 0 && (
        <p className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          ⚠️ التطبيقات دي مش موجودة في {countryNames[country]} فاتشالت من الحساب:{" "}
          {unavailable.map((a) => a.name).join("، ")}
        </p>
      )}

      {selectedApps.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={copyShare} className="btn-primary">
            {copied ? "✅ اتنسخ!" : "🔗 شارك حسابتك"}
          </button>
          <p className="text-xs text-charcoal-500 self-center">
            الرابط بيحمل نفس اختياراتك — شاركه مع العيلة وقارنوا مصروفكم
          </p>
        </div>
      )}
    </div>
  );
}
