"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function EditAppPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    countries: ["EG"] as string[],
    tags: [""],
    pricing_eg: 0,
    pricing_sa: 0,
    pricing_ae: 0,
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    async function loadApp() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("managed_apps")
        .select("*")
        .eq("id", appId)
        .single();

      if (error || !data) {
        setMessage("التطبيق غير موجود");
        setFetching(false);
        return;
      }

      const pricing = Array.isArray(data.pricing) ? data.pricing : [];
      const egPrice = pricing.find((p: any) => p.country === "EG")?.monthly || 0;
      const saPrice = pricing.find((p: any) => p.country === "SA")?.monthly || 0;
      const aePrice = pricing.find((p: any) => p.country === "AE")?.monthly || 0;

      setForm({
        slug: data.slug,
        name: data.name,
        icon: data.icon,
        category: data.category,
        short_description: data.short_description || "",
        description: data.description || "",
        rating: parseFloat(data.rating) || 0,
        pros: Array.isArray(data.pros) && data.pros.length > 0 ? data.pros : [""],
        cons: Array.isArray(data.cons) && data.cons.length > 0 ? data.cons : [""],
        countries: Array.isArray(data.countries) ? data.countries : ["EG"],
        tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [""],
        pricing_eg: egPrice,
        pricing_sa: saPrice,
        pricing_ae: aePrice,
        is_featured: data.is_featured || false,
        is_active: data.is_active !== false
      });

      setFetching(false);
    }
    loadApp();
  }, [appId]);

  async function handleSubmit() {
    if (!form.slug || !form.name) {
      setMessage("املأ الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setMessage(null);

    const pricing: any[] = [];
    if (form.countries.includes("EG")) {
      pricing.push({ country: "EG", monthly: form.pricing_eg, currency: "EGP" });
    }
    if (form.countries.includes("SA")) {
      pricing.push({ country: "SA", monthly: form.pricing_sa, currency: "SAR" });
    }
    if (form.countries.includes("AE")) {
      pricing.push({ country: "AE", monthly: form.pricing_ae, currency: "AED" });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("managed_apps")
      .update({
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
        is_active: form.is_active,
        updated_at: new Date().toISOString()
      })
      .eq("id", appId);

    if (error) {
      setMessage("خطأ: " + error.message);
      setLoading(false);
      return;
    }

    setMessage("تم الحفظ بنجاح");
    setTimeout(() => {
      router.push("/admin/apps");
      router.refresh();
    }, 1000);
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

  if (fetching) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <p className="text-2xl">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">
            تعديل {form.icon} {form.name}
          </h1>
        </div>
        <Link
          href="/admin/apps"
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold"
        >
          الرجوع
        </Link>
      </div>

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
            <label className="mb-2 block text-sm font-bold">اسم التطبيق</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-")
                })
              }
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
              <option value="food">أكل وتوصيل</option>
              <option value="streaming">ستريمنج</option>
              <option value="shopping">تسوق</option>
              <option value="health">صحة</option>
              <option value="transport">مواصلات</option>
              <option value="education">تعليم</option>
              <option value="finance">فلوس وبنوك</option>
              <option value="real-estate">عقارات</option>
              <option value="travel">سفر</option>
              <option value="gaming">ألعاب</option>
              <option value="kids">أطفال</option>
              <option value="tools">أدوات</option>
              <option value="religious">ديني</option>
              <option value="government">حكومي</option>
              <option value="freelance">فريلانس</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الوصف القصير</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
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

        <div>
          <label className="mb-2 block text-sm font-bold">الدول المتاحة</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleCountry("EG")}
              className={form.countries.includes("EG")
                ? "rounded-2xl border-2 border-brand-600 bg-brand-50 px-4 py-2 text-sm font-bold"
                : "rounded-2xl border-2 border-slate-200 px-4 py-2 text-sm font-bold"
              }
            >
              مصر
            </button>
            <button
              type="button"
              onClick={() => toggleCountry("SA")}
              className={form.countries.includes("SA")
                ? "rounded-2xl border-2 border-brand-600 bg-brand-50 px-4 py-2 text-sm font-bold"
                : "rounded-2xl border-2 border-slate-200 px-4 py-2 text-sm font-bold"
              }
            >
              السعودية
            </button>
            <button
              type="button"
              onClick={() => toggleCountry("AE")}
              className={form.countries.includes("AE")
                ? "rounded-2xl border-2 border-brand-600 bg-brand-50 px-4 py-2 text-sm font-bold"
                : "rounded-2xl border-2 border-slate-200 px-4 py-2 text-sm font-bold"
              }
            >
              الإمارات
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {form.countries.includes("EG") && (
            <div>
              <label className="mb-2 block text-sm font-bold">سعر مصر (جنيه)</label>
              <input
                type="number"
                value={form.pricing_eg}
                onChange={(e) =>
                  setForm({ ...form, pricing_eg: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          )}
          {form.countries.includes("SA") && (
            <div>
              <label className="mb-2 block text-sm font-bold">سعر السعودية (ريال)</label>
              <input
                type="number"
                value={form.pricing_sa}
                onChange={(e) =>
                  setForm({ ...form, pricing_sa: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          )}
          {form.countries.includes("AE") && (
            <div>
              <label className="mb-2 block text-sm font-bold">سعر الإمارات (درهم)</label>
              <input
                type="number"
                value={form.pricing_ae}
                onChange={(e) =>
                  setForm({ ...form, pricing_ae: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">المميزات</label>
          <div className="space-y-2">
            {form.pros.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArray("pros", i, e.target.value)}
                  placeholder="مثال: مطاعم كثيرة"
                  className="flex-1 rounded-2xl border px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeFromArray("pros", i)}
                  className="rounded-xl bg-rose-100 px-3 text-rose-700"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addToArray("pros")}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm"
            >
              إضافة ميزة
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">العيوب</label>
          <div className="space-y-2">
            {form.cons.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArray("cons", i, e.target.value)}
                  placeholder="مثال: السعر مرتفع"
                  className="flex-1 rounded-2xl border px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeFromArray("cons", i)}
                  className="rounded-xl bg-rose-100 px-3 text-rose-700"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addToArray("cons")}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm"
            >
              إضافة عيب
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">الكلمات الدلالية</label>
          <div className="space-y-2">
            {form.tags.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArray("tags", i, e.target.value)}
                  placeholder="مثال: توصيل"
                  className="flex-1 rounded-2xl border px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeFromArray("tags", i)}
                  className="rounded-xl bg-rose-100 px-3 text-rose-700"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addToArray("tags")}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm"
            >
              إضافة كلمة
            </button>
          </div>
        </div>

        <div className="flex gap-4 border-t pt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-5 w-5"
            />
            <span className="text-sm">تطبيق مميز</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-5 w-5"
            />
            <span className="text-sm">نشط</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-brand-600 px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>

        {message && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}