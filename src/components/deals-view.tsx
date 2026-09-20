"use client";

/**
 * صفحة العروض — الصالحة في الأعلى مرتبة بالأقرب انتهاءً،
 * والمنتهية بتتخفي في قسم مطوي بدل ما تضرب الثقة في الأكواد الشغالة.
 */

import { useMemo, useState, useEffect } from "react";
import { deals as initialDeals } from "@/data/deals";
import { ReportDealButton } from "@/components/report-deal-button";
import { TrackedAffiliateLink } from "@/components/tracked-affiliate-link";
import { DealItem } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { getActiveDeals, getExpiredDeals, getExpiryLabel } from "@/lib/deals";

export function DealsView() {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("deals")
          .select("*")
          .order("created_at", { ascending: false });
        if (data?.length)
          setDeals(
            data.map((row: any) => ({
              id: row.id,
              title: row.title,
              brand: row.brand,
              category: row.category,
              discount: row.discount,
              views: row.views,
              expiresAt: row.expires_at,
              code: row.code ?? undefined
            }))
          );
      } catch {
        // لو القاعدة مش متاحة نكمل بالبيانات الثابتة
      }
    }
    load();
  }, []);

  const byCategory = useMemo(
    () => deals.filter((d) => category === "all" || d.category === category),
    [deals, category]
  );
  const active = useMemo(() => getActiveDeals(byCategory), [byCategory]);
  const expired = useMemo(() => getExpiredDeals(byCategory), [byCategory]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">العروض والخصومات</h1>
            <p className="mt-1 text-sm text-slate-500">
              {active.length > 0
                ? `${active.length} عرض شغال دلوقتي ✅`
                : "مفيش عروض شغالة حاليًا — راجعنا قريب"}
            </p>
          </div>
          <select
            className="rounded-2xl border px-4 py-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">كل الفئات</option>
            <option value="tech">تكنولوجيا</option>
            <option value="food">أكل</option>
            <option value="beauty">جمال</option>
            <option value="fashion">ملابس</option>
          </select>
        </div>
      </div>

      {/* العروض الصالحة */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {active.map((deal) => {
          const expiry = getExpiryLabel(deal);
          return (
            <div
              key={deal.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                  خصم {deal.discount}%
                </span>
                <span className="text-sm text-slate-500">{deal.views} مشاهدة</span>
              </div>
              <h3 className="text-lg font-bold">{deal.title}</h3>
              <p className="text-sm text-slate-600">البراند: {deal.brand}</p>
              <p
                className={`text-sm font-bold ${
                  expiry.urgent ? "text-red-600" : "text-slate-600"
                }`}
              >
                {expiry.text}
              </p>
              {deal.code && (
                <p className="rounded-xl bg-slate-50 px-4 py-2 text-sm">
                  كود الخصم: <b className="tracking-wider">{deal.code}</b>
                </p>
              )}
              <ReportDealButton dealId={deal.id} />
              {deal.affiliateUrl && (
                <TrackedAffiliateLink target={`deal:${deal.id}`} url={deal.affiliateUrl} label="اشتري العرض" />
              )}
            </div>
          );
        })}
      </div>

      {active.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 p-10 text-center">
          <p className="text-4xl">⏳</p>
          <p className="mt-3 font-bold text-slate-700">
            العروض الجديدة في الطريق
          </p>
          <p className="mt-1 text-sm text-slate-500">
            فريقنا بيراجع الأكواد دوريًا — متنساش تراجعنا في مواسم التخفيضات
          </p>
        </div>
      )}

      {/* المنتهية — مطوية عشان متضربش الثقة */}
      {expired.length > 0 && (
        <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <summary className="cursor-pointer list-none font-bold text-slate-500 marker:hidden">
            🗃️ أرشيف العروض المنتهية ({expired.length})
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {expired.map((deal) => (
              <div key={deal.id} className="rounded-xl bg-white p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">
                    خصم {deal.discount}%
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500">
                    منتهي
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  {deal.title}
                </p>
                <p className="text-xs text-slate-400">
                  {deal.brand} — انتهى في {deal.expiresAt}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
