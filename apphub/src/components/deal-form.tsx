"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function DealForm() {
  const [title, setTitle] = useState(""); const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("tech"); const [discount, setDiscount] = useState(10);
  const [expiresAt, setExpiresAt] = useState(""); const [code, setCode] = useState("");
  const [message, setMessage] = useState<string|null>(null);
  async function handleSubmit() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage("لازم تسجل دخول"); return; }
    const { error } = await supabase.from("deals").insert({ title, brand, category, discount, expires_at: expiresAt, code: code||null, advertiser_id: user.id });
    if (error) { setMessage(error.message); return; }
    setMessage("تم إضافة العرض"); setTitle(""); setBrand(""); setCode("");
  }
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">أضف عرض جديد</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-2xl border px-4 py-3" placeholder="عنوان العرض" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="rounded-2xl border px-4 py-3" placeholder="البراند" value={brand} onChange={e => setBrand(e.target.value)} />
        <select className="rounded-2xl border px-4 py-3" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="tech">تكنولوجيا</option><option value="food">أكل</option>
          <option value="beauty">جمال</option><option value="fashion">ملابس</option>
        </select>
        <input className="rounded-2xl border px-4 py-3" type="number" placeholder="نسبة الخصم" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
        <input className="rounded-2xl border px-4 py-3" type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
        <input className="rounded-2xl border px-4 py-3" placeholder="كود الخصم (اختياري)" value={code} onChange={e => setCode(e.target.value)} />
      </div>
      <button onClick={handleSubmit} className="mt-4 rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white">إضافة العرض</button>
      {message && <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">{message}</p>}
    </div>
  );
}
