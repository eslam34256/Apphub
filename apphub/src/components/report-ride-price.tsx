"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  appId: string;
  appName: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
};

export function ReportRidePrice({ appId, appName, fromLocation, toLocation, distance }: Props) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [isPeak, setIsPeak] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!price) {
      setMessage("اكتب السعر الفعلي");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage("لازم تسجّل دخول الأول");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("actual_ride_reports").insert({
      user_id: user.id,
      app_id: appId,
      from_location: fromLocation,
      to_location: toLocation,
      distance,
      actual_price: parseFloat(price),
      is_peak_hour: isPeak
    });

    if (error) {
      setMessage("حصل خطأ");
    } else {
      setMessage("✅ شكرًا! ساعدت المجتمع");
      setPrice("");
      setTimeout(() => setOpen(false), 2000);
    }

    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-brand-600 hover:underline"
      >
        💬 ركبت {appName} وعايز تشارك السعر الحقيقي؟
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-xl bg-blue-50 p-3 border border-blue-200">
      <p className="text-xs font-bold mb-2">شارك السعر الفعلي لـ {appName}</p>
      <div className="flex gap-2">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="السعر (ج)"
          className="flex-1 rounded-lg border px-3 py-1 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-brand-600 px-3 py-1 text-xs font-bold text-white"
        >
          {loading ? "..." : "إرسال"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg bg-slate-200 px-3 py-1 text-xs"
        >
          ✕
        </button>
      </div>
      {message && <p className="mt-2 text-xs">{message}</p>}
    </div>
  );
}