"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewAppPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    icon: "📱",
    category: "food",
    short_description: "",
    description: "",
    rating: 4.5,
    pros: [""],
    cons: [""],
    countries: ["EG"],
    tags: [""],
    pricing_eg: 0,
    pricing_sa: 0,
    pricing_ae: 0,
    is_featured: false,
    is_active: true
  });

  async function handleSubmit() {
    if (!form.slug || !form.name) {
      setMessage("املأ الحقول المطلوبة");
      return;
    }

    setLoading(true);

    const pricing = [];
    if (form.pricing_eg > 0 || form.countries.includes("EG")) {
      pricing.push({ country: "EG", monthly: form.pricing_eg, currency: "EGP" });
    }
    if (form.pricing_sa > 0 || form.countries.includes("SA")) {
      pricing.push({ country: "SA", monthly: form.pricing_sa, currency: "SAR" });
    }
    if (form.pricing_ae > 0 || form.countries.includes("AE")) {
      pricing.push({ country: "AE", monthly: form.pricing_ae, currency: "AED" });
    }

    const supabase = createClient();
    const { error } = await supabase.from("managed_apps").insert({
      slug: form.slug,
      name: form.name,
      icon: form.icon,
      category: form.category,
      short_description: form.short_description,
      description: form.description,
      rating: form.rating,
      pros: form.pros.filter((p) => p.trim()),
      cons: form.cons.filter((c) => c.trim()),
      countries: form.countries,
      pricing,
      tags: form.tags.filter((t) => t.trim()),
      is_featured: form.is_featured,
      is_active: form.is_active
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/apps");
  }

  function updateArray(field: "pros" | "cons" | "tags", index: number, value: string) {
    setForm({
      ...form,
      [field]: form[field].map((item, i) => (i === index ? value : item))
    });
  }

  function addToArray(field: "pros" | "cons" | "tags") {
    setForm({ ...form, [field]: [...form[field], ""] });
  }

  function removeFromArray(field: "pros" | "cons" | "tags", index: number) {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  }

  function toggleCountry(country: string) {
    setForm({
      ...form,
      countries: form.countries.includes(country)
        ? form.countries.filter((c) => c !== country)
        : [...form.countries, country]
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">➕ إضافة تطبيق جديد</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">الأيقونة (Emoji)</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3 text-2xl text-center"
              maxLength={2}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">اسم التطبيق *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثال: طلبات"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">Slug (URL) *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              placeholder="talabat"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">الفئة *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="food">🍔 أكل وتوصيل</option>
              <option value="streaming">🎬 ستريمنج</option>
              <option value="shopping">🛍️ تسوق</option>
              <option value="health">💪 صحة</option>
              <option value="transport">🚗 مواصلات</option>
              <option value="education">📚 تعليم</option>
              <option value="finance">💰 فلوس وبنوك</option>
              <option value="real-estate">🏠 عقارات</option>
              <option value="travel">✈️ سفر</option>
              <option value="gaming">🎮 ألعاب</option>
              <option value="kids">👶 أطفال</option>
              <option value="tools">🛠️ أدوات</option>
              <option value="religious">🕌 ديني</option>
              <option value="government">🏛️ حكومي</option>
              <option value="freelance">💼 فريلانس</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الوصف القصير</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            placeholder="وصف في سطر واحد"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الوصف الكامل</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">التقييم (من 5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        {/* الدول */}
        <div>
          <label className="mb-2 block text-sm font-bold">الدول المتاح فيها</label>
          <div className="flex gap-2">
            {[
              { code: "EG", label: "🇪🇬 مصر" },
              { code: "SA", label: "🇸🇦 السعودية" },
              { code: "AE", label: "🇦🇪 الإمارات" }
            ].map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => toggleCountry(country.code)}
                className={`rounded-2xl border-2 px-4 py-2 text-sm font-bold ${
                  form.countries.includes(country.code)
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200"
                }`}
              >
                {country.label}
              </button>
            ))}
          </div>
        </div>

        {/* الأسعار */}
        <div className="grid gap-4 md:grid-cols-3">
          {form.countries.includes("EG") && (
            <div>
              <label className="mb-2 block text-sm font-bold">سعر شهري 🇪🇬 (جنيه)</label>
              <input
                type="number"
                value={form.pricing_eg}
                onChange={(e) => setForm({ ...form, pricing_eg: parseFloat(e.target.value) })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          )}
          {form.countries.includes("SA") && (
            <div>
              <label className="mb-2 block text-sm font-bold">سعر شهري 🇸🇦 (ريال)</label>
              <input
                type="number"
                value={form.pricing_sa}
                onChange={(e) => setForm({ ...form, pricing_sa: parseFloat(e.target.value) })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          )}
          {form.countries.includes("AE") && (
            <div>
              <label className="mb-2 block text-sm font-bold">سعر شهري 🇦🇪 (درهم)</label>
              <input
                type="number"
                value={form.pricing_ae}
                onChange={(e) => setForm({ ...form, pricing_ae: parseFloat(e.target.value) })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          )}
        </div>

        {/* المميزات */}
        <ArrayField
          label="✅ المميزات"
          items={form.pros}
          onUpdate={(i, v) => updateArray("pros", i, v)}
          onAdd={() => addToArray("pros")}
          onRemove={(i) => removeFromArray("pros", i)}
          placeholder="مثال: مطاعم كثيرة"
        />

        {/* العيوب */}
        <ArrayField
          label="❌ العيوب"
          items={form.cons}
          onUpdate={(i, v) => updateArray("cons", i, v)}
          onAdd={() => addToArray("cons")}
          onRemove={(i) => removeFromArray("cons", i)}
          placeholder="مثال: السعر مرتفع"
        />

        {/* الكلمات الدلالية */}
        <ArrayField
          label="🏷️ الكلمات الدلالية"
          items={form.tags}
          onUpdate={(i, v) => updateArray("tags", i, v)}
          onAdd={() => addToArray("tags")}
          onRemove={(i) => removeFromArray("tags", i)}
          placeholder="مثال: توصيل"
        />

        {/* الخيارات */}
        <div className="flex gap-4 border-t pt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-5 w-5"
            />
            <span className="text-sm">⭐ تطبيق مميز</span>
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
          {loading ? "جاري الحفظ..." : "حفظ التطبيق ←"}
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

function ArrayField({ label, items, onUpdate, onAdd, onRemove, placeholder }: {
  label: string;
  items: string[];
  onUpdate: (i: number, v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdate(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-2xl border px-4 py-2"
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="rounded-xl bg-rose-100 px-3 text-rose-700"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm"
        >
          + إضافة
        </button>
      </div>
    </div>
  );
}
