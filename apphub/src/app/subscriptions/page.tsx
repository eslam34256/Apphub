"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createSubscription, deleteSubscription, getSubscriptions } from "@/lib/api";
import { SubscriptionItem } from "@/lib/types";
export default function SubscriptionsPage() {
  const [items, setItems] = useState<SubscriptionItem[]>([]);
  const [appName, setAppName] = useState(""); const [plan, setPlan] = useState("");
  const [price, setPrice] = useState(""); const [cycle, setCycle] = useState<"monthly"|"yearly">("monthly");
  const [loading, setLoading] = useState(false); const [message, setMessage] = useState<string|null>(null);
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) { setMessage("سجل دخول عشان تتابع اشتراكاتك"); return; }
      try { const data = await getSubscriptions(authData.user.id); setItems(data); }
      catch (err: any) { setMessage(err.message); }
    }
    load();
  }, []);
  const monthlyTotal = useMemo(() => items.reduce((sum, item) => sum + (item.cycle==="monthly" ? item.price : item.price/12), 0), [items]);
  async function addItem() {
    setLoading(true); setMessage(null);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) { setMessage("سجل دخول الأول"); return; }
      const created = await createSubscription({ userId: authData.user.id, appName, plan, price: Number(price), cycle });
      setItems(p => [created, ...p]); setAppName(""); setPlan(""); setPrice("");
    } catch (err: any) { setMessage(err.message); }
    finally { setLoading(false); }
  }
  async function removeItem(id: string) {
    try { await deleteSubscription(id); setItems(p => p.filter(i => i.id !== id)); }
    catch (err: any) { setMessage(err.message); }
  }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-extrabold">مدير الاشتراكات</h1>
        <p className="mb-4 text-slate-500">ضيف اشتراكاتك وتابع مصاريفك.</p>
        <div className="grid gap-3 md:grid-cols-4">
          <input className="rounded-2xl border px-4 py-3" placeholder="اسم التطبيق" value={appName} onChange={e => setAppName(e.target.value)} />
          <input className="rounded-2xl border px-4 py-3" placeholder="اسم الباقة" value={plan} onChange={e => setPlan(e.target.value)} />
          <input className="rounded-2xl border px-4 py-3" placeholder="السعر" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          <select className="rounded-2xl border px-4 py-3" value={cycle} onChange={e => setCycle(e.target.value as "monthly"|"yearly")}>
            <option value="monthly">شهري</option><option value="yearly">سنوي</option>
          </select>
        </div>
        <button onClick={addItem} disabled={loading} className="mt-4 rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white disabled:opacity-60">{loading?"جاري الإضافة...":"إضافة اشتراك"}</button>
        {message && <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-slate-700">{message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">إجمالي شهري</p><p className="mt-2 text-3xl font-extrabold">{monthlyTotal.toFixed(0)} ج</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">إجمالي سنوي</p><p className="mt-2 text-3xl font-extrabold">{(monthlyTotal*12).toFixed(0)} ج</p></div>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div><h3 className="font-bold">{item.appName}</h3><p className="text-sm text-slate-500">{item.plan} — {item.price} ج — {item.cycle==="monthly"?"شهري":"سنوي"}</p></div>
            <button onClick={() => removeItem(item.id)} className="rounded-xl bg-rose-100 px-4 py-2 text-rose-700">حذف</button>
          </div>
        ))}
        {!items.length && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">مفيش اشتراكات لسه</div>}
      </div>
    </div>
  );
}
