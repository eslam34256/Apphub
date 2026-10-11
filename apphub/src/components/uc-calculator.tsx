"use client";

import { useState } from "react";
import { cheaperCombo, type UcComboResult } from "@/lib/uc-data";

/**
 * حاسبة الشدات: «عايز تشحن قد إيه؟» → أرخص تشكيلة رسمية (Midasbuy).
 * كل الحساب محلي في المتصفح — مفيش fetch ومفيش أرقام غير الجدول المعلن.
 */
export function UcCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<UcComboResult | null>(null);
  const [error, setError] = useState("");

  function compute() {
    const n = Number(input);
    if (!Number.isFinite(n) || n <= 0) {
      setError("اكتب رقم شدات صحيح");
      setResult(null);
      return;
    }
    const r = cheaperCombo(n);
    if (!r) {
      setError("الرقم كبير أوي — جرّب حتى 30,000 UC");
      setResult(null);
      return;
    }
    setError("");
    setResult(r);
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-5">
      <div>
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">🧮 حاسبة الشدات</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          اكتب عدد الشدات اللي محتاجها — وهنجيب لك <strong>أرخص تشكيلة من الجدول الرسمي</strong> توصّلها أو أكتر.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="number"
          min={1}
          max={30000}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && compute()}
          placeholder="مثال: 660"
          dir="ltr"
          className="flex-1 rounded-full border border-cream-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
        />
        <button
          onClick={compute}
          className="rounded-full bg-accent-400 px-8 py-3 text-sm font-bold text-brand-900 hover:bg-accent-500 transition"
        >
          احسبها لي
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-2xl bg-brand-50 p-5 text-center">
            <p className="text-sm text-charcoal-500">التشكيلة الرسمية الأرخص</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-900">
              {result.totalUc.toLocaleString("ar-EG")} UC
              <span className="mx-2 text-lg text-charcoal-400">=</span>
              <span className="text-accent-600">{result.totalPrice.toLocaleString("ar-EG")} جنيه</span>
            </p>
            <p className="mt-1 text-xs text-charcoal-500">
              {result.exact
                ? "بالظبط زي ما طلبت ✅"
                : `أقرب تشكيلة أكبر من هدفك (${(result.totalUc - result.target).toLocaleString("ar-EG")} UC زيادة)`}
              {" — "}
              {((result.totalPrice / result.totalUc) * 100).toFixed(2)} جنيه لكل 100 UC
            </p>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2">
            {result.items.map(({ pack, count }, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-2xl border border-cream-200 bg-white px-5 py-3"
              >
                <span className="text-sm font-bold text-brand-900">
                  {count > 1 ? `${count}× ` : ""}
                  باقة {pack.uc.toLocaleString("ar-EG")}
                  {pack.bonus > 0 && (
                    <span className="text-sage-600 font-semibold"> +{pack.bonus.toLocaleString("ar-EG")} هدية</span>
                  )}
                </span>
                <span className="text-sm text-charcoal-600">
                  {(pack.priceEgp * count).toLocaleString("ar-EG")} ج
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
