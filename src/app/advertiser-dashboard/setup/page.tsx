"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetupBrandPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    logo_url: ""
  });

  async function handleSubmit() {
    if (!form.name) {
      setMessage("لازم تكتب اسم البراند");
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage("سجّل دخول الأول");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("brands").insert({
      owner_id: user.id,
      name: form.name,
      description: form.description,
      website: form.website,
      logo_url: form.logo_url
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/advertiser-dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-8 text-white">
        <h1 className="text-3xl font-extrabold">🏪 سجّل البراند بتاعك</h1>
        <p className="mt-2 text-white/90">
          املأ البيانات دي عشان تبدأ تنشئ إعلانات
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold">اسم البراند *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: مطعم البيك"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الوصف</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="عن البراند بتاعك..."
            rows={3}
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الموقع الإلكتروني</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">رابط اللوجو</label>
          <input
            type="url"
            value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-brand-600 px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {loading ? "جاري الحفظ..." : "سجّل البراند ←"}
        </button>

        {message && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-rose-700 text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
