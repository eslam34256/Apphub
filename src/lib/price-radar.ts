import { PricePoint, RadarEntry, RadarPlan } from "@/data/price-history";

/** أحدث سعر في الباقة */
export function latestPrice(plan: RadarPlan): PricePoint | null {
  return plan.points.length ? plan.points[plan.points.length - 1] : null;
}

/** التغيّر بين آخر نقطتين: القيمة والنسبة والاتجاه */
export function priceChange(plan: RadarPlan): {
  diff: number;
  pct: number;
  dir: "up" | "down" | "same" | "new";
  oldDate?: string;
} {
  if (plan.points.length < 2) return { diff: 0, pct: 0, dir: "new" };
  const prev = plan.points[plan.points.length - 2];
  const curr = plan.points[plan.points.length - 1];
  const diff = +(curr.price - prev.price).toFixed(2);
  if (diff === 0) return { diff: 0, pct: 0, dir: "same", oldDate: prev.date };
  const pct = +(((curr.price - prev.price) / prev.price) * 100).toFixed(1);
  return { diff, pct: Math.abs(pct), dir: diff > 0 ? "up" : "down", oldDate: prev.date };
}

/** أكبر تغيّر في خطط الاشتراك — يلخّص حالة الكارت */
export function entryChange(entry: RadarEntry) {
  const changes = entry.plans.map(priceChange);
  const up = changes.filter((c) => c.dir === "up").sort((a, b) => b.pct - a.pct)[0];
  const down = changes.filter((c) => c.dir === "down").sort((a, b) => b.pct - a.pct)[0];
  if (up) return { dir: "up" as const, pct: up.pct };
  if (down) return { dir: "down" as const, pct: down.pct };
  const hasHistory = entry.plans.some((p) => p.points.length > 1);
  return { dir: hasHistory ? ("same" as const) : ("new" as const), pct: 0 };
}

/** تنسيق الأرقام بالعربي */
export function formatPrice(value: number, currency: string): string {
  const locale = currency === "EGP" ? "ar-EG" : currency === "SAR" ? "ar-SA" : "ar-AE";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

export const currencySymbols: Record<string, string> = {
  EGP: "ج.م",
  SAR: "ر.س",
  AED: "د.إ"
};
