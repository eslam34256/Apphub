"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apps as staticApps } from "@/data/apps";
import { createClient } from "@/lib/supabase/client";
import { AppItem } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";
import { useTranslatedText, useTranslatedArray } from "@/hooks/use-translated-text";
import { formatMoney, getCheapestCountry } from "@/lib/helpers";
import { ReviewsSection } from "@/components/reviews-section";
import { AppStoreButtons } from "@/components/app-store-buttons";
import { CommentsSection } from "@/components/comments-section";

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

export default function AppDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { lang, t } = useLanguage();
  const [app, setApp] = useState<AppItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApp() {
      const supabase = createClient();
      const { data: dbApp } = await supabase
        .from("managed_apps")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (dbApp) {
        setApp({
          id: `db-${dbApp.id}`,
          slug: dbApp.slug,
          name: dbApp.name,
          icon: dbApp.icon,
          category: dbApp.category,
          shortDescription: dbApp.short_description || "",
          description: dbApp.description || "",
          rating: parseFloat(dbApp.rating) || 0,
          pros: Array.isArray(dbApp.pros) ? dbApp.pros : [],
          cons: Array.isArray(dbApp.cons) ? dbApp.cons : [],
          countries: Array.isArray(dbApp.countries) ? dbApp.countries : [],
          pricing: Array.isArray(dbApp.pricing) ? dbApp.pricing : [],
          tags: Array.isArray(dbApp.tags) ? dbApp.tags : [],
          businessUse: Array.isArray(dbApp.business_use) ? dbApp.business_use : []
        });
      } else {
        const found = staticApps.find((a) => a.slug === slug);
        if (found) setApp(found);
      }
      setLoading(false);
    }
    loadApp();
  }, [slug]);

  // Translations
  const translatedDescription = useTranslatedText(app?.description || "");
  const translatedShortDesc = useTranslatedText(app?.shortDescription || "");
  const translatedPros = useTranslatedArray(app?.pros || []);
  const translatedCons = useTranslatedArray(app?.cons || []);
  const translatedTags = useTranslatedArray(app?.tags || []);

  if (loading) {
    return (
      <div className="bg-cream-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-400 border-t-transparent mb-4"></div>
          <p className="text-charcoal-500">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="bg-cream-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <p className="heading-elegant text-3xl text-brand-900 mb-4">
            {lang === "ar" ? "التطبيق غير موجود" : "App not found"}
          </p>
          <Link href="/apps" className="btn-primary">
            {lang === "ar" ? "تصفّح التطبيقات" : "Browse Apps"}
          </Link>
        </div>
      </div>
    );
  }

  const cheapest = getCheapestCountry(app);

  function getCategoryLabel(cat: string) {
    return categoryTranslations[cat]?.[lang] || cat;
  }

  function getCountryLabel(country: string) {
    return countryTranslations[country]?.[lang] || country;
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
        {/* Back Button */}
        <Link
          href="/apps"
          className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 transition"
        >
          <span>{lang === "ar" ? "←" : "→"}</span>
          <span>{lang === "ar" ? "العودة للتطبيقات" : "Back to Apps"}</span>
        </Link>

        {/* Hero */}
        <section className="card-elegant p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-cream-100 flex items-center justify-center text-6xl md:text-7xl shrink-0 shadow-soft">
              {app.icon}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-accent-100 text-accent-700 px-3 py-1 text-xs font-bold">
                  {getCategoryLabel(app.category)}
                </span>
                <span className="rounded-full bg-accent-100 text-accent-700 px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <span>⭐</span>
                  <span>{app.rating}</span>
                </span>
              </div>

              <h1 className="heading-display text-4xl md:text-5xl text-brand-900 mb-3">
                {app.name}
              </h1>

              <p className="text-charcoal-500 leading-relaxed mb-4">
                {translatedShortDesc}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {app.countries.map((country) => (
                  <span
                    key={country}
                    className="rounded-full bg-sage-50 text-sage-700 px-3 py-1 text-xs font-bold border border-sage-200"
                  >
                    🌍 {getCountryLabel(country)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Open App Buttons */}
          <div className="mt-6">
            <AppStoreButtons
              googlePlay={app.googlePlay}
              appStore={app.appStore}
              website={app.website}
              appName={app.name}
            />
          </div>

          {/* Description */}
          {translatedDescription && (
            <div className="mt-6 pt-6 border-t border-cream-200">
              <h2 className="heading-elegant text-xl text-brand-900 mb-3">
                {lang === "ar" ? "نبذة عن التطبيق" : "About the App"}
              </h2>
              <p className="text-charcoal-800 leading-relaxed">
                {translatedDescription}
              </p>
            </div>
          )}

          {/* Tags */}
          {translatedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {translatedTags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-md bg-cream-100 px-3 py-1 text-xs text-charcoal-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Pros & Cons */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Pros */}
          <div className="card-elegant p-6">
            <h2 className="heading-elegant text-2xl text-brand-900 mb-4 flex items-center gap-2">
              <span className="text-sage-500">✓</span>
              <span>{lang === "ar" ? "المميزات" : "Pros"}</span>
            </h2>
            <ul className="space-y-2">
              {translatedPros.map((item, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-sage-50 border border-sage-200 px-4 py-3 text-charcoal-800 flex items-start gap-2"
                >
                  <span className="text-sage-600 shrink-0">✓</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="card-elegant p-6">
            <h2 className="heading-elegant text-2xl text-brand-900 mb-4 flex items-center gap-2">
              <span className="text-red-500">✗</span>
              <span>{lang === "ar" ? "العيوب" : "Cons"}</span>
            </h2>
            <ul className="space-y-2">
              {translatedCons.map((item, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-charcoal-800 flex items-start gap-2"
                >
                  <span className="text-red-600 shrink-0">✗</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        {app.pricing.length > 0 && (
          <section className="card-elegant p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="heading-elegant text-2xl text-brand-900 flex items-center gap-2">
                <span>💰</span>
                <span>{lang === "ar" ? "مقارنة الأسعار" : "Pricing Comparison"}</span>
              </h2>
              {cheapest && (
                <span className="rounded-full bg-accent-100 text-accent-800 px-4 py-2 text-sm font-bold">
                  🏆 {lang === "ar" ? "الأرخص" : "Cheapest"}: {getCountryLabel(cheapest.country)}
                </span>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {app.pricing.map((price) => (
                <div
                  key={price.country}
                  className="rounded-2xl border-2 border-cream-200 p-5 hover:border-accent-300 transition bg-white"
                >
                  <p className="font-bold text-lg mb-3 text-brand-900">
                    🌍 {getCountryLabel(price.country)}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-500">
                        {lang === "ar" ? "شهري:" : "Monthly:"}
                      </span>
                      <span className="font-bold text-brand-900">
                        {price.monthly === 0
                          ? lang === "ar" ? "مجاني" : "Free"
                          : formatMoney(price.monthly, price.currency)}
                      </span>
                    </div>
                    {price.yearly !== undefined && price.yearly > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-500">
                          {lang === "ar" ? "سنوي:" : "Yearly:"}
                        </span>
                        <span className="font-bold text-brand-900">
                          {formatMoney(price.yearly, price.currency)}
                        </span>
                      </div>
                    )}
                  </div>
                  {price.note && (
                    <p className="mt-3 text-xs text-accent-600 border-t border-cream-100 pt-2">
                      💡 {price.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <ReviewsSection appSlug={app.slug} />

        {/* Comments */}
        <CommentsSection appSlug={app.slug} />
      </div>
    </div>
  );
}