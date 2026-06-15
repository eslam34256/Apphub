"use client";
import { useMemo, useState, useEffect } from "react";
import { deals as initialDeals } from "@/data/deals";
import { ReportDealButton } from "@/components/report-deal-button";
import { DealItem } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
export default function DealsPage() {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [category, setCategory] = useState("all");
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
      if (data?.length) setDeals(data.map((row: any) => ({ id:row.id, title:row.title, brand:row.brand, category:row.category, discount:row.discount, views:row.views, expiresAt:row.expires_at, code:row.code??undefined })));
    }
    load();
  }, []);
  const filtered = useMemo(() => deals.filter(d => category==="all" || d.category===category), [deals, category]);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-extrabold">العروض والخصومات</h1>
        <select className="rounded-2xl border px-4 py-3" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">كل الفئات</option>
          <option value="tech">تكنولوجيا</option>
          <option value="food">أكل</option>
          <option value="beauty">جمال</option>
          <option value="fashion">ملابس</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(deal => (
          <div key={deal.id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">خصم {deal.discount}%</span>
              <span className="text-sm text-slate-500">{deal.views} مشاهدة</span>
            </div>
            <h3 className="text-lg font-bold">{deal.title}</h3>
            <p className="text-sm text-slate-600">البراند: {deal.brand}</p>
            <p className="text-sm text-slate-600">ينتهي: {deal.expiresAt}</p>
            {deal.code && <p className="rounded-xl bg-slate-50 px-4 py-2 text-sm">كود الخصم: {deal.code}</p>}
            <ReportDealButton dealId={deal.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
