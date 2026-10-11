"use client";

import { useState } from "react";

/** كارت اقتباس جاهز للصحافة — زر نسخ بلمسة واحدة */
export function PressQuoteCard({ quote, source }: { quote: string; source: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${quote}\n— ${source}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // النسخ اليدوي متاح تحديدًا
    }
  }

  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5 space-y-3">
      <p className="text-sm leading-7 text-charcoal-800">“{quote}”</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-charcoal-400">— {source}</span>
        <button
          onClick={copy}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
            copied
              ? "bg-sage-500 text-white"
              : "bg-cream-100 text-brand-900 hover:bg-cream-200"
          }`}
        >
          {copied ? "اتنسخ ✅" : "انسخ الاقتباس"}
        </button>
      </div>
    </div>
  );
}
