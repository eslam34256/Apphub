"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { translateText } from "@/lib/translator";

export function useTranslatedText(text: string): string {
  const { lang } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) return;
    
    // لو اللغة عربي والنص عربي، خليه زي ما هو
    if (lang === "ar") {
      setTranslated(text);
      return;
    }

    // لو اللغة انجليزي، ترجم
    translateText(text, lang).then(setTranslated);
  }, [text, lang]);

  return translated;
}

// Hook لترجمة Array من النصوص
export function useTranslatedArray(texts: string[]): string[] {
  const { lang } = useLanguage();
  const [translated, setTranslated] = useState(texts);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    if (lang === "ar") {
      setTranslated(texts);
      return;
    }

    Promise.all(texts.map((t) => translateText(t, lang))).then(setTranslated);
  }, [texts, lang]);

  return translated;
}