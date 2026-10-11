import { apps as staticApps } from "@/data/apps";
import { categoryLabels } from "./constants";
import { AppItem, AppCategory, CountryCode } from "./types";

/**
 * منطق صفحات «الأفضل في...» البرمجية.
 * 15 فئة × 3 دول = 45 صفحة SEO تتولّد من نفس الداتا الموجودة.
 */

export type CountryInfo = {
  code: CountryCode;
  slug: string; // في الرابط lowercase
  name: string;
  flag: string;
  currency: "EGP" | "SAR" | "AED";
};

export const BEST_COUNTRIES: CountryInfo[] = [
  { code: "EG", slug: "eg", name: "مصر", flag: "🇪🇬", currency: "EGP" },
  { code: "SA", slug: "sa", name: "السعودية", flag: "🇸🇦", currency: "SAR" },
  { code: "AE", slug: "ae", name: "الإمارات", flag: "🇦🇪", currency: "AED" }
];

export const categoryEmoji: Record<string, string> = {
  food: "🍔",
  streaming: "🎬",
  shopping: "🛍️",
  health: "💊",
  transport: "🚗",
  education: "📚",
  finance: "💰",
  "real-estate": "🏠",
  travel: "✈️",
  gaming: "🎮",
  kids: "🧒",
  tools: "🔧",
  religious: "📿",
  government: "🏛️",
  freelance: "💼",
  topup: "🔋"
};

/** كل الفئات الموجودة فعلًا في الداتا */
export const BEST_CATEGORIES: AppCategory[] = [
  ...new Set(staticApps.map((a) => a.category))
];

/** عدد تطبيقات فئة معينة في دولة معينة (من الداتا الثابتة — للـ params) */
export function comboAppCount(category: string, country: CountryCode): number {
  return staticApps.filter(
    (a) => a.category === category && a.countries.includes(country)
  ).length;
}

/**
 * الكومبوهات الصالحة للـ generateStaticParams:
 * أي (فئة × دولة) فيها تطبيق واحد على الأقل. = 45 صفحة
 */
export function bestCombos(): { category: string; country: string }[] {
  const combos: { category: string; country: string }[] = [];
  for (const cat of BEST_CATEGORIES) {
    for (const c of BEST_COUNTRIES) {
      if (comboAppCount(cat, c.code) >= 1) {
        combos.push({ category: cat, country: c.slug });
      }
    }
  }
  return combos;
}

export function countryFromSlug(slug: string): CountryInfo | undefined {
  return BEST_COUNTRIES.find((c) => c.slug === slug);
}

/** اختيار وترتيب التطبيقات: الأعلى تقييمًا أولاً */
export function filterBest(
  apps: AppItem[],
  category: string,
  country: CountryCode
): AppItem[] {
  return apps
    .filter((a) => a.category === category && a.countries.includes(country))
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name, "ar"));
}

/** سعر التطبيق في الدولة — جاهز للعرض */
export function localPriceLabel(
  app: AppItem,
  country: CountryInfo
): string {
  const p = app.pricing.find((x) => x.country === country.code);
  if (!p || p.monthly === undefined) return "سعر متغير";
  if (p.monthly === 0) return "مجاني";
  const sym = country.currency === "EGP" ? "ج.م" : country.currency === "SAR" ? "ر.س" : "د.إ";
  const num = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(p.monthly);
  return `${num} ${sym}/ش`;
}

/** ملخصات ذكية للهيدر */
export function bestVerdicts(list: AppItem[], country: CountryInfo) {
  const withPrices = list.filter((a) => {
    const p = a.pricing.find((x) => x.country === country.code);
    return p && (p.monthly ?? 0) > 0;
  });
  const cheapest = [...withPrices].sort(
    (x, y) =>
      (x.pricing.find((p) => p.country === country.code)?.monthly ?? 9e9) -
      (y.pricing.find((p) => p.country === country.code)?.monthly ?? 9e9)
  )[0];
  const freeCount = list.length - withPrices.length;
  return { cheapest, freeCount, top: list[0] };
}

export function categoryName(cat: string): string {
  return categoryLabels[cat as AppCategory] ?? cat;
}
