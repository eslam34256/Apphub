"use client";

import { useEffect, useState } from "react";

/**
 * مفتاح الدارك مود — class على <html> + localStorage ("apphub-theme").
 * الافتراضي: تفضيل النظام. سكربت layout بيطبقها قبل أول رسم (مفيش وميض).
 */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("apphub-theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center rounded-full bg-cream-100 w-10 h-10 text-base text-brand-900 hover:bg-cream-200 transition border border-cream-200 dark:bg-[#152536] dark:border-[#22354a] dark:hover:bg-[#1d3046]"
      aria-label={dark ? "الوضع الفاتح" : "الوضع الداكن"}
      title={dark ? "☀️ وضع فاتح" : "🌙 وضع داكن"}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
