import { apps as allApps } from "@/data/apps";
import { AppItem, CountryCode } from "./types";
import { getPriceForCountry } from "./helpers";

/**
 * منطق حاسبة المصروف الرقمي — دوال نقية قابلة للاختبار.
 */

/** التطبيقات مدفوعة الاشتراك في دولة معينة */
export function paidAppsForCountry(country: CountryCode): AppItem[] {
  return allApps
    .filter((a) => {
      const p = getPriceForCountry(a, country);
      return p && (p.monthly ?? 0) > 0;
    })
    .sort((a, b) => b.rating - a.rating);
}

export function monthlyOf(app: AppItem, country: CountryCode): number {
  return getPriceForCountry(app, country)?.monthly ?? 0;
}

export function currencyOf(country: CountryCode): "EGP" | "SAR" | "AED" {
  return country === "EG" ? "EGP" : country === "SA" ? "SAR" : "AED";
}

/** إجمالي شهري + سنوي (لو دفعت شهري طول السنة) */
export function calcTotals(selected: AppItem[], country: CountryCode) {
  const monthly = selected.reduce((sum, a) => sum + monthlyOf(a, country), 0);
  return { monthly, yearly: monthly * 12, count: selected.length };
}

/** التفصيل حسب الفئة */
export function categoryBreakdown(selected: AppItem[], country: CountryCode) {
  const map = new Map<string, number>();
  selected.forEach((a) => {
    map.set(a.category, (map.get(a.category) ?? 0) + monthlyOf(a, country));
  });
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

/** توفير الدفع السنوي: لما يكون للتطبيق سعر سنوي أرخص من 12 شهر */
export function yearlyTips(selected: AppItem[], country: CountryCode) {
  return selected
    .map((a) => {
      const p = getPriceForCountry(a, country);
      if (!p?.yearly || !p.monthly) return null;
      const yearlyAsMonthly = p.yearly / 12;
      const savingPerMonth = p.monthly - yearlyAsMonthly;
      if (savingPerMonth <= 0) return null;
      return { app: a, savingPerMonth, yearly: p.yearly };
    })
    .filter(Boolean) as { app: AppItem; savingPerMonth: number; yearly: number }[];
}

/**
 * بدائل أوفر بنفس الفئة: ريتنج مشابه وسعر أقل.
 * بندير مقترح واحد لكل تطبيق مختار.
 */
export function swapSuggestions(
  selected: AppItem[],
  country: CountryCode,
  maxRatingDrop = 0.5
) {
  const selectedIds = new Set(selected.map((a) => a.id));
  return selected
    .map((a) => {
      const myPrice = monthlyOf(a, country);
      if (myPrice <= 0) return null;
      const cheaper = allApps
        .filter((c) => {
          if (selectedIds.has(c.id) || c.category !== a.category) return false;
          const p = monthlyOf(c, country);
          return p > 0 && p < myPrice && c.rating >= a.rating - maxRatingDrop;
        })
        .sort(
          (x, y) =>
            y.rating - x.rating || monthlyOf(x, country) - monthlyOf(y, country)
        )[0];
      if (!cheaper) return null;
      return {
        from: a,
        to: cheaper,
        savingPerMonth: myPrice - monthlyOf(cheaper, country)
      };
    })
    .filter(Boolean) as {
    from: AppItem;
    to: AppItem;
    savingPerMonth: number;
  }[];
}
