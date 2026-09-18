import { createClient } from "@/lib/supabase/server";
import {
  priceRadar as staticRadar,
  RadarEntry,
  PricePoint
} from "@/data/price-history";
import { AppCategory, CountryCode } from "@/lib/types";

/**
 * تحميل بيانات الرادار: من قاعدة البيانات (price_watch + price_history)
 * مع رجوع تلقائي للبيانات الثابتة لو القاعدة مش متاحة (تطوير محلي/تعطل).
 *
 * نفس نمط app-data.ts: الموقع العام لا يتعطل أبدًا بسبب قاعدة البيانات.
 */

type WatchRow = {
  id: string;
  app_slug: string;
  plan_name: string;
  plan_note: string | null;
  country: CountryCode;
  currency: "EGP" | "SAR" | "AED";
  current_price: number;
  updated_at: string;
};

type HistoryRow = {
  watch_id: string;
  price: number;
  checked_at: string;
};

const staticMeta = new Map(
  staticRadar.map((e) => [`${e.appSlug}|${e.country}`, { icon: e.icon, name: e.name, category: e.category }])
);

function rowIconName(row: WatchRow) {
  const meta = staticMeta.get(`${row.app_slug}|${row.country}`);
  const staticByApp = staticRadar.find((e) => e.appSlug === row.app_slug);
  return {
    icon: meta?.icon ?? staticByApp?.icon ?? "💳",
    name: meta?.name ?? staticByApp?.name ?? row.app_slug,
    category: (meta?.category ?? staticByApp?.category ?? "streaming") as AppCategory
  };
}

export async function getRadarEntries(): Promise<RadarEntry[]> {
  try {
    const supabase = createClient();
    const { data: watches, error } = await supabase
      .from("price_watch")
      .select("id, app_slug, plan_name, plan_note, country, currency, current_price, updated_at")
      .eq("is_active", true)
      .order("app_slug");

    if (error || !watches?.length) throw new Error(error?.message ?? "no data");

    const ids = watches.map((w: WatchRow) => w.id);
    const { data: history } = await supabase
      .from("price_history")
      .select("watch_id, price, checked_at")
      .in("watch_id", ids)
      .order("checked_at", { ascending: true });

    const historyByWatch = new Map<string, PricePoint[]>();
    (history as HistoryRow[] | null)?.forEach((h) => {
      const list = historyByWatch.get(h.watch_id) ?? [];
      list.push({
        date: h.checked_at.slice(0, 10),
        price: Number(h.price)
      });
      historyByWatch.set(h.watch_id, list);
    });

    // تجميع: watch مرفوعة → RadarEntry لكل (app + country)
    const grouped = new Map<string, RadarEntry>();
    for (const w of watches as WatchRow[]) {
      const key = `${w.app_slug}|${w.country}`;
      const meta = rowIconName(w);
      const points = historyByWatch.get(w.id) ?? [];
      // لو مفيش تاريخ لسه: نقطة واحدة بالسعر الحالي
      const planPoints =
        points.length > 0
          ? points
          : [{ date: w.updated_at.slice(0, 10), price: Number(w.current_price) }];

      const entry =
        grouped.get(key) ??
        ({
          appSlug: w.app_slug,
          name: meta.name,
          icon: meta.icon,
          category: meta.category,
          country: w.country,
          currency: w.currency,
          plans: [],
          updatedAt: w.updated_at.slice(0, 10)
        } satisfies RadarEntry);

      entry.plans.push({
        name: w.plan_name,
        note: w.plan_note ?? undefined,
        points: planPoints
      });
      // أحدث مراجعة للكارت = أقصى updated_at
      if (w.updated_at.slice(0, 10) > entry.updatedAt) {
        entry.updatedAt = w.updated_at.slice(0, 10);
      }
      grouped.set(key, entry);
    }

    return [...grouped.values()];
  } catch {
    // القاعدة مش متاحة → البيانات الثابتة (الموقع يفضل شغال)
    return staticRadar;
  }
}
