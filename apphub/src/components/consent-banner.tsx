"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/consent";

/**
 * v42 — بانر موافقة الكوكيز: قبول الكل / الضروري فقط / إدارة التفضيلات.
 * بيظهر لحد ما المستخدم يختار، وبيفتح تاني من «تفضيلات الكوكيز» في الفوتر.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const open = () => { setVisible(true); setManage(true); setAnalytics(getConsent()?.analytics ?? true); };
    if (!getConsent()) setVisible(true);
    window.addEventListener("apphub:consent-open", open);
    return () => window.removeEventListener("apphub:consent-open", open);
  }, []);

  if (!visible) return null;

  const decide = (a: boolean) => {
    setConsent(a);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-4 sm:max-w-md z-[60] animate-fade-in" dir="rtl">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <p className="text-sm font-extrabold text-slate-900">🍪 خصوصيتك عندنا</p>
        <p className="mt-1.5 text-xs leading-6 text-slate-600">
          مفيش إعلانات طرف تالت ولا أدوات تحليلات خارجية. بنستخدم تتبع first-party اختياري بس
          عشان نعرف أي روابط العمولة شغالة — مش بيشتغل إلا بموافقتك.
          <Link href="/cookies" className="text-brand-600 font-bold hover:underline"> سياسة الكوكيز</Link>
        </p>

        {manage && (
          <label className="mt-3 flex items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2.5 text-xs font-bold text-slate-700">
            <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="accent-brand-600" />
            السماح بتتبع نسب العمولة (اختياري)
          </label>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
          <button onClick={() => decide(true)} className="rounded-full bg-brand-600 px-4 py-2 text-white hover:bg-brand-500 transition">
            قبول الكل
          </button>
          <button onClick={() => decide(false)} className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 transition">
            الضروري فقط
          </button>
          <button
            onClick={() => { if (manage) decide(analytics); else setManage(true); }}
            className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
          >
            {manage ? "حفظ التفضيلات" : "إدارة التفضيلات"}
          </button>
        </div>
      </div>
    </div>
  );
}
