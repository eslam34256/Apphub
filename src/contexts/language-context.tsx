"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, TranslationKey } from "@/lib/translations";

type Language = "ar" | "en";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("apphub-lang") as Language | null;
    const cookie = document.cookie.match(/apphub-lang=(ar|en)/)?.[1] as Language | undefined;
    const pre = saved ?? cookie;
    if (pre === "ar" || pre === "en") {
      setLangState(pre);
      document.documentElement.lang = pre;
      document.documentElement.dir = pre === "ar" ? "rtl" : "ltr";
    }
  }, []);

  function setLang(newLang: Language) {
    setLangState(newLang);
    localStorage.setItem("apphub-lang", newLang);
    // كوكيز كمان — يخلي السيرفر/الأناليتكس تتعامل مع نفس اللغة (تجهيز لترجمة SSR مستقبلية)
    document.cookie = `apphub-lang=${newLang};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  }

  function t(key: TranslationKey): string {
    return translations[lang][key] || translations.ar[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}