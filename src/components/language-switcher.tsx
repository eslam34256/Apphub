"use client";

import { useLanguage } from "@/contexts/language-context";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  function toggleLang() {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
  }

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-2 rounded-full bg-cream-100 px-4 py-2 text-sm font-bold text-brand-900 hover:bg-cream-200 transition border border-cream-200"
      aria-label="تغيير اللغة"
    >
      <span className="text-base">{lang === "ar" ? "🇬🇧" : "🇪🇬"}</span>
      <span>{lang === "ar" ? "EN" : "AR"}</span>
    </button>
  );
}