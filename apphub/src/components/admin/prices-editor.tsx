"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PricesEditor({ initialPrices }: { initialPrices: any[] }) {
  const router = useRouter();
  const [prices, setPrices] = useState(initialPrices);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function updatePrice(id: string, field: string, value: number) {
    setPrices(prices.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function saveAll() {
    setLoading("all");
    setMessage(null);

    const supabase = createClient();

    for (const price of prices) {
      await supabase
        .from("ride_prices")
        .update({
          base_price: price.base_price,
          price_per_km: price.price_per_km,
          price_per_minute: price.price_per_minute,
          minimum_fare: price.minimum_fare,
          last_updated: new Date().toISOString()
        })
        .eq("id", price.id);
    }

    setMessage("✅ تم حفظ كل الأسعار بنجاح");
    setLoading(null);
    router.refresh();
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {prices.map((price) => (
          <div key={price.id} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{price.app_name}</h3>
              <span className="text-xs text-slate-500">
                آخر تحديث: {new Date(price.last_updated).toLocaleDateString("ar-EG")}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div>
                <label className="text-xs text-slate-500">السعر الأساسي</label>
                <input
                  type="number"
                  step="0.5"
                  value={price.base_price}
                  onChange={(e) => updatePrice(price.id, "base_price", parseFloat(e.target.value))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">سعر كم</label>
                <input
                  type="number"
                  step="0.1"
                  value={price.price_per_km}
                  onChange={(e) => updatePrice(price.id, "price_per_km", parseFloat(e.target.value))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">سعر دقيقة</label>
                <input
                  type="number"
                  step="0.1"
                  value={price.price_per_minute}
                  onChange={(e) => updatePrice(price.id, "price_per_minute", parseFloat(e.target.value))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">الحد الأدنى</label>
                <input
                  type="number"
                  step="1"
                  value={price.minimum_fare}
                  onChange={(e) => updatePrice(price.id, "minimum_fare", parseFloat(e.target.value))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveAll}
        disabled={loading === "all"}
        className="w-full rounded-2xl gradient-brand py-4 font-bold text-white shadow-lg disabled:opacity-60"
      >
        {loading === "all" ? "جاري الحفظ..." : "💾 حفظ كل الأسعار"}
      </button>

      {message && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700 text-center font-bold">
          {message}
        </p>
      )}
    </div>
  );
}