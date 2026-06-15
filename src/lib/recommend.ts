import { apps } from "@/data/apps";
import { getMonthlyPrice } from "./helpers";
import { AppItem, CountryCode } from "./types";
type Answers = { activity: string; priority: string; country: CountryCode };
const activityToCategories: Record<string, string[]> = {
  food: ["food"], entertainment: ["streaming"], shopping: ["shopping"],
  learning: ["education"], health: ["health"], mobility: ["transport"],
  finance: ["finance"], home: ["real-estate"]
};
export function recommendApps({ activity, priority, country }: Answers): AppItem[] {
  const categories = activityToCategories[activity] ?? [];
  return apps
    .filter(app => app.countries.includes(country))
    .map(app => {
      let score = 0;
      if (categories.includes(app.category)) score += 4;
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
