"use client";

import Link from "next/link";
import { AppItem } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";
import { useTranslatedText, useTranslatedArray } from "@/hooks/use-translated-text";

const categoryTranslations: Record<string, { ar: string; en: string }> = {
  food: { ar: "أكل وتوصيل", en: "Food & Delivery" },
  streaming: { ar: "ستريمنج", en: "Streaming" },
  shopping: { ar: "تسوق", en: "Shopping" },
  health: { ar: "صحة", en: "Health" },
  transport: { ar: "مواصلات", en: "Transport" },
  education: { ar: "تعليم", en: "Education" },
  finance: { ar: "فلوس وبنوك", en: "Finance" },
  "real-estate": { ar: "عقارات", en: "Real Estate" },
  travel: { ar: "سفر", en: "Travel" },
  gaming: { ar: "ألعاب", en: "Gaming" },
  kids: { ar: "أطفال", en: "Kids" },
  tools: { ar: "أدوات", en: "Tools" },
  religious: { ar: "ديني", en: "Religious" },
  government: { ar: "حكومي", en: "Government" },
  freelance: { ar: "فريلانس", en: "Freelance" }
};

const countryTranslations: Record<string, { ar: string; en: string }> = {
  EG: { ar: "مصر", en: "Egypt" },
  SA: { ar: "السعودية", en: "Saudi Arabia" },
  AE: { ar: "الإمارات", en: "UAE" }
};

export function AppCard({ app }: { app: AppItem }) {
  const { lang, t } = useLanguage();
  const translatedDescription = useTranslatedText(app.shortDescription);
  const translatedTags = useTranslatedArray(app.tags || []);

  function getCategoryLabel(cat: string) {
    return categoryTranslations[cat]?.[lang] || cat;
  }

  function getCountryLabel(country: string) {
    return countryTranslations[country]?.[lang] || country;
  }

  return (
    <div className="card-elegant p-6 hover-lift">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center text-4xl shrink-0">
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="heading-elegant text-xl text-brand-900 truncate">
            {app.name}
          </h3>
          <p className="text-xs text-charcoal-500 mt-1">
            {getCategoryLabel(app.category)}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-accent-100 px-2 py-1 rounded-full">
          <span className="text-accent-600">⭐</span>
          <span className="text-xs font-bold text-brand-900">{app.rating}</span>
        </div>
      </div>

      <p className="text-sm text-charcoal-500 leading-relaxed mb-4 line-clamp-2">
        {translatedDescription}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {app.countries.slice(0, 3).map((country) => (
          <span
            key={country}
            className="text-xs bg-sage-50 text-sage-700 px-2 py-0.5 rounded-full font-medium"
          >
            {getCountryLabel(country)}
          </span>
        ))}
      </div>

      {translatedTags && translatedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {translatedTags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-cream-100 text-charcoal-800 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/apps/${app.slug}`}
        className="flex items-center justify-between text-accent-600 hover:text-accent-700 transition pt-3 border-t border-cream-100"
      >
        <span className="font-semibold text-sm">{t("view_details")}</span>
        <span>{lang === "ar" ? "←" : "→"}</span>
      </Link>
    </div>
  );
}