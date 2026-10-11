"use client";

import { useState } from "react";

/** v42 — نسخ رابط المقارنة الثابت (قابل للفهرسة وللفتح في جلسة جديدة) */
export function ShareCompareButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback قديم
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-brand-300 transition"
      aria-label="نسخ رابط المقارنة"
    >
      {copied ? "✅ اتنسخ — ابعتوا اللي انت عايزه" : "🔗 شارك المقارنة"}
    </button>
  );
}
