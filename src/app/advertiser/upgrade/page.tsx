"use client";
import { useState } from "react";
import { PLANS, PlanKey } from "@/lib/stripe";
import { UpgradePlanCard } from "@/components/upgrade-plan-card";
export default function UpgradePage() {
  const [loading, setLoading] = useState<PlanKey|null>(null);
  const [message, setMessage] = useState<string|null>(null);
  async function handleCheckout(plan: PlanKey) {
    setLoading(plan); setMessage(null);
    try {
      const res = await fetch("/api/payments/create-session", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ plan }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMessage(data.error ?? "حصل خطأ");
    } catch { setMessage("تعذّر الاتصال بالخادم"); }
    finally { setLoading(null); }
  }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-slate-900 p-8 text-white">
        <h1 className="text-3xl font-extrabold">اختر الباقة المناسبة</h1>
        <p className="mt-2 text-white/80">وصّل عرضك لآلاف المستخدمين العرب</p>
      </div>
      {message && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-700">{message}</div>}
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(PLANS) as PlanKey[]).map(key => (
          <UpgradePlanCard key={key} planKey={key} plan={PLANS[key]} loading={loading===key} onSelect={handleCheckout} />
        ))}
      </div>
    </div>
  );
}
