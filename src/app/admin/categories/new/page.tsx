"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: "",
    name_ar: "",
    name_en: "",
    icon: "📁",
    description: "",
    sort_order: 0,
    is_active: true
  });

  async function handleSubmit() {
    if (!form.slug || !form.name_ar) {
      setMessage("املأ الحقول المطلوبة");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("categories").insert(form);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">➕ إضافة فئة جديدة</h1>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">الأيقونة</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3 text-2xl text-center"
              maxLength={2}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">الترتيب</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Slug (URL) *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            placeholder="food"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الاسم بالعربي *</label>
          <input
            type="text"
            value={form.name_ar}
            onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
            placeholder="أكل وتوصيل"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الاسم بالإنجليزي</label>
          <input
            type="text"
            value={form.name_en}
            onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            placeholder="Food & Delivery"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الوصف</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="h-5 w-5"
          />
          <span className="text-sm">✅ نشط</span>
        </label>

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