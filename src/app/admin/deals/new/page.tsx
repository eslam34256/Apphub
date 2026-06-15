"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    category: "tech",
    discount: 10,
    expires_at: "",
    code: "",
    link: "",
    image_url: "",
    is_active: true,
    is_featured: false
  });

  async function handleSubmit() {
    if (!form.title || !form.brand) {
      setMessage("املأ الحقول المطلوبة");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("managed_deals").insert(form);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/deals");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">➕ إضافة عرض جديد</h1>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold">عنوان العرض *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="خصم 50% على كل الطلبات"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">البراند *</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="طلبات"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">الفئة</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="tech">تكنولوجيا</option>
              <option value="food">أكل</option>
              <option value="beauty">جمال</option>
              <option value="fashion">ملابس</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-bold">نسبة الخصم %</label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: parseInt(e.target.value) })}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">كود الخصم</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="SAVE50"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">تاريخ الانتهاء</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الرابط</label>
          <input
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div className="flex gap-4 border-t pt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-5 w-5"
            />
            <span className="text-sm">⭐ مميز</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-5 w-5"
            />
            <span className="text-sm">✅ نشط</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-brand-600 px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {loading ? "جاري الحفظ..." : "حفظ ←"}
        </button>

        {message && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-rose-700 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}