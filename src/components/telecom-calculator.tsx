"use client";

import { useState } from "react";
import { BUNDLES, NETWORK_LABELS, perGb, type Bundle, type Network } from "@/lib/telecom-data";

/**
 * «استخدامك كام جيجا في الشهر؟» → أرخص باقة تغطيه في كل شبكة (هوائي).
 * كل الحساب محلي في المتصفح من الجدول المعلن فوق الصفحة مباشرة.
 */
export function TelecomCalculator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ network: Network; bundle: Bundle }[] | null>(null);
  const [error, setError] = useState("");

  function compute() {
    const n = Number(input);
    if (!Number.isFinite(n) || n <= 0) {
      setError("اكتب استهلاكك التقريبي بالجيجا");
      setResults(null);
      return;
    }
    if (n > 400) {
      setError("١٤٠٠ جيجا دي قصة تانية 😄 — جرّب حتى ٤٠٠");
      setResults(null);
      return;
    }
    setError("");
    const nets: { network: Network; bundle: Bundle }[] = [];
    (Object.keys(NETWORK_LABELS) as Network[]).forEach((net) => {
      const options = BUNDLES
        .filter((b) => b.kind === "air" && b.network === net && b.gb >= n)
        .sort((a, b) => a.priceEgp - b.priceEgp);
      if (options[0]) nets.push({ network: net, bundle: options[0] });
    });
    nets.sort((a, b) => a.bundle.priceEgp - b.bundle.priceEgp);
    setResults(nets.length ? nets : null);
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-5">
      <div>
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">🧮 أحسن هوائي لاستخدامك</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          اكتب استهلاكك الشهري التقريبي بالجيجابايت — وهنقارن أرخص باقة <strong>هوائي</strong> تغطيه في كل شبكة جنب بعض.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="number"
          min={1}
          max={400}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && compute()}
          placeholder="مثال: 100"
          dir="ltr"
          className="flex-1 rounded-full border border-cream-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
        />
        <button
          onClick={compute}
          className="rounded-full bg-accent-400 px-8 py-3 text-sm font-bold text-brand-900 hover:bg-accent-500 transition"
        >
          قارنلي الشبكات
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {results && (
        <ul className="grid gap-3 sm:grid-cols-3 animate-fade-in">
          {results.map(({ network, bundle }, i) => (
            <li
              key={network}
              className={`rounded-2xl border-2 p-5 text-center space-y-1 ${
                i === 0 ? "border-sage-300 bg-sage-50" : "border-cream-200 bg-white"
              }`}
            >
              {i === 0 && (
                <span className="inline-block rounded-full bg-sage-500 px-3 py-0.5 text-[11px] font-bold text-white mb-1">
                  الأرخص
                </span>
              )}
              <div className="text-xs font-bold text-charcoal-500">{NETWORK_LABELS[network]}</div>
              <div className="font-extrabold text-brand-900">{bundle.name}</div>
              <div className="text-2xl font-extrabold text-accent-600">{bundle.priceEgp.toLocaleString("ar-EG")} ج</div>
              <div className="text-xs text-charcoal-500">
                {perGb(bundle).toFixed(2)} ج / جيجا
              </div>
            </li>
          ))}
        </ul>
      )}
      {results && (
        <p className="text-[11px] text-charcoal-400">
          المقارنة على سعر الاشتراك قبل العروض المؤقتة — شركتك ممكن يكون عندها ديسكونت للخطوط القديمة.
        </p>
      )}
    </div>
  );
}
