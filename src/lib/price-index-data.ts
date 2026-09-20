import { createClient } from "@/lib/supabase/server";
import { priceRadar } from "@/data/price-history";
import { PlanSeries } from "./price-index";

export type PlanSeriesPayload = { plans: PlanSeries[]; source: "db" | "seed" };

/**
 * تحميل سلاسل الأسعار: من قاعدة البيانات (رصد الرادار المؤكد) لو متوفرة،
 * وللا نرجع لبذور الداتا الثابتة الموثّقة — والصفحة بتعلن المصدر في الحالتين.
 */
export async function loadPlanSeries(): Promise<PlanSeriesPayload> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("price_history")
      .select("price, checked_at, watch:price_watch(app_slug, plan_name, country, currency)")
      .order("checked_at", { ascending: true })
      .limit(10000);

    if (!error && data && data.length > 0) {
      const byWatch = new Map<string, PlanSeries>();
      for (const row of data as any[]) {
        const w = Array.isArray(row.watch) ? row.watch[0] : row.watch;
        if (!w) continue;
        const key = `${w.app_slug}|${w.plan_name}|${w.country}`;
        const price = Number(row.price);
        if (!Number.isFinite(price)) continue;
        if (!byWatch.has(key)) {
          byWatch.set(key, {
            appSlug: w.app_slug,
            planName: w.plan_name,
            country: w.country,
            currency: w.currency,
            points: []
          });
        }
        byWatch.get(key)!.points.push({
          date: String(row.checked_at).slice(0, 10),
          price
        });
      }
      const plans = [...byWatch.values()];
      if (plans.length > 0) return { plans, source: "db" };
    }
  } catch {
    /* fallback للبذور */
  }

  const plans: PlanSeries[] = priceRadar.flatMap((e) =>
    e.plans.map((pl) => ({
      appSlug: e.appSlug,
      planName: pl.name,
      country: e.country,
      currency: e.currency,
      points: pl.points
    }))
  );
  return { plans, source: "seed" };
}
