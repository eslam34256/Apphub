"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { apps } from "@/data/apps";
import { categoryLabels } from "@/lib/constants";

export default function NewAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);

  const [form, setForm] = useState({
    app_slug: "",
    category: "food",
    ad_type: "featured" as "featured" | "discount" | "pricing" | "banner",
    title: "",
    description: "",
    cta_text: "اعرف أكثر",
    cta_link: "",
    custom_price: "",
    discount_percent: "",
    promo_code: "",
    duration_days: 7,
    budget: 500
  });

  useEffect(() => {
    async function loadBrand() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("brands")
        .select("id")
        .eq("owner_id", user.id)
        .single();
      if (data) setBrandId(data.id);
    }
    loadBrand();
  }, []);

  async function handleSubmit() {
    if (!brandId) {
      setMessage("سجّل البراند الأول");
      return;
    }
    if (!form.title || !form.app_slug) {
      setMessage("املأ الحقول المطلوبة");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + form.duration_days);

    const { error } = await supabase.from("brand_ads").insert({
      brand_id: brandId,
      app_slug: form.app_slug,
      category: form.category,
      ad_type: form.ad_type,
      title: form.title,
      description: form.description,
      cta_text: form.cta_text,
      cta_link: form.cta_link,
      custom_price: form.custom_price ? parseFloat(form.custom_price) : null,
      discount_percent: form.discount_percent ? parseInt(form.discount_percent) : null,
      promo_code: form.promo_code || null,
      end_date: endDate.toISOString(),
      budget: form.budget,
      status: "pending"
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/advertiser-dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-8 text-white">
        <h1 className="text-3xl font-extrabold">📢 إنشاء إعلان جديد</h1>
        <p className="mt-2 text-white/90">
          اعمل إعلان مخصص لجمهور AppHub
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold">التطبيق المستهدف *</label>
          <select
            value={form.app_slug}
            onChange={(e) => setForm({ ...form, app_slug: e.target.value })}
            className="w-full rounded-2xl border px-4 py-3"
          >
            <option value="">اختار التطبيق</option>
            {apps.map((app) => (
              <option key={app.id} value={app.slug}>
                {app.icon} {app.name} - {categoryLabels[app.category]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">نوع الإعلان *</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "featured", label: "⭐ ظهور مميز" },
              { value: "discount", label: "💰 خصم خاص" },
              { value: "pricing", label: "💵 سعر مخصص" },
              { value: "banner", label: "🖼️ بانر إعلاني" }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setForm({ ...form, ad_type: type.value as any })}
                className={`rounded-xl border-2 p-3 text-sm font-bold transition ${
                  form.ad_type === type.value
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">عنوان الإعلان *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="مثال: خصم 50% على كل الطلبات"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الوصف</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="تفاصيل العرض..."
            rows={3}
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        {form.ad_type === "discount" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold">نسبة الخصم</label>
              <input
                type="number"
                value={form.discount_percent}
                onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                placeholder="30"
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">كود الخصم</label>
              <input
                type="text"
                value={form.promo_code}
                onChange={(e) => setForm({ ...form, promo_code: e.target.value })}
                placeholder="SAVE30"
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          </div>
        )}

        {form.ad_type === "pricing" && (
          <div>
            <label className="mb-2 block text-sm font-bold">السعر المخصص (بالجنيه)</label>
            <input
              type="number"
              value={form.custom_price}
              onChange={(e) => setForm({ ...form, custom_price: e.target.value })}
              placeholder="299"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">نص الزرار</label>
            <input
              type="text"
              value={form.cta_text}
              onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">رابط الزرار</label>
            <input
              type="url"
              value={form.cta_link}
              onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
              placeholder="https://"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">مدة الإعلان</label>
            <select
              value={form.duration_days}
              onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) })}
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="7">7 أيام - 500 ج</option>
              <option value="30">30 يوم - 1,500 ج</option>
              <option value="90">90 يوم - 5,000 ج</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">الميزانية</label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) })}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ <strong>ملاحظة:</strong> الإعلان هيدخل قائمة المراجعة وهنفعّله خلال 24 ساعة
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-brand-600 px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {loading ? "جاري الإرسال..." : "نشر الإعلان ←"}
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
