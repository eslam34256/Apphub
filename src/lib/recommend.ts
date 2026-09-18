import { apps } from "@/data/apps";
import { subcategoryOf } from "@/data/subcategories";
import { getMonthlyPrice } from "./helpers";
import { AppItem, CountryCode } from "./types";
type Answers = { activity: string; priority: string; country: CountryCode };

/**
 * نطاق النشاط: sub = فئات فرعية محددة (الأدق)، cats = فئات عامة.
 * الترشيح بيفلتر من النطاق بس — «الترفيه» القديم اتقسّم لمشاهدة وموسيقى
 * عشان السؤال «عايز تتفرج» ميرشحش أنغامي والعكس.
 */
type Scope = { sub?: string[]; cats?: string[] };
const activityToScope: Record<string, Scope> = {
  food: { cats: ["food"] },
  watch: { sub: ["streaming-video"] },
  music: { sub: ["streaming-music"] },
  entertainment: { cats: ["streaming"] }, // توافقية للروابط القديمة
  shopping: { cats: ["shopping"] },
  learning: { cats: ["education"] },
  health: { cats: ["health"] },
  mobility: { cats: ["transport"] },
  finance: { cats: ["finance"] },
  home: { cats: ["real-estate"] }
};

export function recommendApps({ activity, priority, country }: Answers): AppItem[] {
  const scope = activityToScope[activity] ?? {};
  const pool = apps.filter(app => {
    if (!app.countries.includes(country)) return false;
    if (scope.sub) return scope.sub.includes(subcategoryOf(app));
    if (scope.cats) return scope.cats.includes(app.category);
    return true;
  });
  return pool
    .map(app => {
      let score = 4;
      if (priority === "price") {
        const price = getMonthlyPrice(app, country);
        if (price === 0) score += 4;
        else if (price <= 50) score += 3;
        else if (price <= 150) score += 2;
        else score += 1;
      }
      if (priority === "quality") score += app.rating;
      if (priority === "business") score += app.businessUse?.length ? 3 : 0;
      if (priority === "popular") score += app.rating + app.tags.length / 2;
      return { app, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.app);
}
