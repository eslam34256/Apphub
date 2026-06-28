"use client";

// Cache للترجمات عشان نوفر API calls
const translationCache: Map<string, string> = new Map();

// تحميل الـ Cache من localStorage
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("translation-cache");
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([key, value]) => {
        translationCache.set(key, value as string);
      });
    }
  } catch (err) {
    console.error("Failed to load translation cache");
  }
}

function saveCache() {
  if (typeof window !== "undefined") {
    try {
      const obj: Record<string, string> = {};
      translationCache.forEach((value, key) => {
        obj[key] = value;
      });
      localStorage.setItem("translation-cache", JSON.stringify(obj));
    } catch (err) {}
  }
}

// ترجمة باستخدام MyMemory API (مجاني)
export async function translateText(
  text: string,
  targetLang: "ar" | "en"
): Promise<string> {
  if (!text || !text.trim()) return text;

  // اللغة المصدر
  const sourceLang = targetLang === "en" ? "ar" : "en";
  
  // مفتاح الـ Cache
  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  
  // شوف لو الترجمة موجودة في الـ Cache
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );

    if (!response.ok) return text;

    const data = await response.json();
    const translated = data?.responseData?.translatedText || text;

    // احفظ في الـ Cache
    translationCache.set(cacheKey, translated);
    saveCache();

    return translated;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}

// ترجمة مجموعة نصوص
export async function translateBatch(
  texts: string[],
  targetLang: "ar" | "en"
): Promise<string[]> {
  const results = await Promise.all(
    texts.map((text) => translateText(text, targetLang))
  );
  return results;
}