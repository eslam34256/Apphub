"use client";

import { useMemo, useState } from "react";
import { apps } from "@/data/apps";
import { getMonthlyPrice } from "@/lib/helpers";
import { WaitlistForm } from "@/components/waitlist-form";
import { CONTACT } from "@/lib/contact";

/**
 * v39 — AppHub Business: محرك Lead-Gen حقيقي.
 * الشركة تدخل نوعها + ميزانيتها → بنرشح Stack من الداتا الفعلية بسعر شهري تقديري،
 * وبعدين «اطلب عرض» بيحوّلها Lead متتبع (waitlist interest=business-lead + واتساب).
 */

const BIZ_TYPES = [
  { id: "foodbiz", label: "🍔 مطعم / كافيه", tags: ["restaurant", "cafe"] },
  { id: "grocery", label: "🛒 بقالة / سوبرماركت", tags: ["grocery"] },
  { id: "delivery", label: "🛵 توصيل / لوجستيات", tags: ["delivery", "restaurant"] },
  { id: "services", label: "💼 شركة خدمات / فريلانس", tags: [] }
];

const SIZES = ["1-10 موظفين", "11-50 موظف", "+50 موظف"];

export function StackBuilder() {
  const [biz, setBiz] = useState(BIZ_TYPES[0]);
  const [size, setSize] = useState(SIZES[0]);
  const [budget, setBudget] = useState(500);

  const result = useMemo(() => {
    const pool = biz.tags.length
      ? apps.filter(a => a.countries.includes("EG") && a.businessUse?.some(t => biz.tags.includes(t)))
      : apps.filter(a => a.countries.includes("EG") && (a.businessUse?.length || a.category === "tools"));
    const sorted = [...pool].sort((a, b) => b.rating - a.rating);
    const picked: { app: (typeof apps)[number]; price: number }[] = [];
    let total = 0;
    for (const a of sorted) {
      if (picked.length >= 5) break;
      const p = getMonthlyPrice(a, "EG");
      if (p === 0 || total + p <= budget) {
        picked.push({ app: a, price: p });
        total += p;
      }
    }
    if (!picked.length) {
      for (const a of sorted.slice(0, 3)) picked.push({ app: a, price: getMonthlyPrice(a, "EG") });
      total = picked.reduce((s, x) => s + x.price, 0);
    }
    return { picked, total, over: total > budget };
  }, [biz, budget]);

  const waText = encodeURIComponent(
    `أهلًا AppHub 👋\nنوع البيزنس: ${biz.label}\nالحجم: ${size}\nالميزانية: ${budget} ج/شهر\nعايز عرض سعر للـ Stack اللي رشحتهولي.`
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-2xl font-extrabold">🛠️ ابنِ Stack شركتك في ١٠ ثواني</h2>
      <p className="mt-1 mb-5 text-sm text-slate-500">
        اختار نوع البيزنس والميزانية — وهنطلعلك ترشيح بتكلفة شهرية تقديرية من أسعار حقيقية.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        <select value={biz.id} onChange={e => setBiz(BIZ_TYPES.find(b => b.id === e.target.value)!)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          {BIZ_TYPES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
        </select>
        <select value={size} onChange={e => setSize(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          {SIZES.map(s => <option key={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          💰 ميزانية شهرية:
          <input
            type="number"
            min={0}
            value={budget}
            onChange={e => setBudget(Math.max(0, parseInt(e.target.value || "0", 10)))}
            className="w-24 rounded-xl border border-slate-200 px-2 py-1"
          />
          ج
        </label>
      </div>

      <div className="mt-5 space-y-2">
        {result.picked.map(({ app, price }) => (
          <div key={app.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{app.icon}</span>
              <div>
                <p className="font-bold">{app.name}</p>
                <p className="text-xs text-slate-500">تقييم {app.rating}⭐ · {app.shortDescription}</p>
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${price === 0 ? "bg-sage-50 text-sage-700" : "bg-cream-100 text-slate-700"}`}>
              {price === 0 ? "مجاني" : `${price} ج/شهر`}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white">
          <p className="font-bold">التكلفة الشهرية التقديرية</p>
          <p className="text-lg font-extrabold">{result.total} ج</p>
        </div>
        {result.over && <p className="text-xs text-amber-700">⚠️ الترشيح عدى ميزانيتك شوية — كلّمنا وهنظبطها يدوي.</p>}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <a
          href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-[#25D366] px-6 py-4 text-center font-extrabold text-white hover:opacity-90 transition"
        >
          💬 اطلب عرض سعر على واتساب
        </a>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="mb-2 text-center text-xs font-bold text-slate-500">أو سيب بريدك — بنرد خلال يوم شغل</p>
          <WaitlistForm interest="business-lead" />
        </div>
      </div>
    </section>
  );
}
