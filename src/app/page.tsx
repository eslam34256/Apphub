"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppCard } from "@/components/app-card";
import { apps as staticApps } from "@/data/apps";
import { deals } from "@/data/deals";
import { getActiveDeals } from "@/lib/deals";
import { NewsletterForm } from "@/components/newsletter-form";
import { createClient } from "@/lib/supabase/client";
import { AppItem } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [dbApps, setDbApps] = useState<AppItem[]>([]);

  useEffect(() => {
    async function loadApps() {
      const supabase = createClient();
      const { data } = await supabase
        .from("managed_apps")
        .select("*")
        .eq("is_active", true);

      const mapped: AppItem[] = (data ?? []).map((app: any) => ({
        id: `db-${app.id}`,
        slug: app.slug,
        name: app.name,
        icon: app.icon,
        category: app.category,
        shortDescription: app.short_description || "",
        description: app.description || "",
        rating: parseFloat(app.rating) || 0,
        pros: Array.isArray(app.pros) ? app.pros : [],
        cons: Array.isArray(app.cons) ? app.cons : [],
        countries: Array.isArray(app.countries) ? app.countries : [],
        pricing: Array.isArray(app.pricing) ? app.pricing : [],
        tags: Array.isArray(app.tags) ? app.tags : [],
        businessUse: Array.isArray(app.business_use) ? app.business_use : []
      }));

      setDbApps(mapped);
    }
    loadApps();
  }, []);

  const dbSlugs = new Set(dbApps.map((a) => a.slug));
  const filteredStatic = staticApps.filter((a) => !dbSlugs.has(a.slug));
  const allApps = [...dbApps, ...filteredStatic];

  const topApps = [...allApps].sort((a, b) => b.rating - a.rating).slice(0, 6);
  // العروض الصالحة فقط — المنتهية مش هتظهر على الرئيسية
  const topDeals = getActiveDeals(deals)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4);

  return (
    <div className="-mx-4 -mt-8">
      {/* HERO SECTION */}
{/* HERO SECTION */}
<section className="relative hero-bg flex flex-col">
  <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-24 md:py-32 text-center text-white animate-fade-in w-full flex-1 flex flex-col justify-center">
    
    {/* Badge */}
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-5 py-2 text-sm mb-8 mx-auto animate-slide-up w-fit">
      <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
      <span className="font-medium tracking-wider">{t("hero_badge")}</span>
    </div>

    {/* Main Heading */}
    <h1 className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 text-shadow-strong animate-slide-up">
      <span className="block mb-3">{t("hero_title_1")}</span>
      <span className="text-accent-400 italic block">{t("hero_title_2")}</span>
    </h1>

    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed text-shadow-soft animate-slide-up px-4">
      {t("hero_description")}
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up px-4 mb-16">
      <Link 
        href="/apps" 
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent-400 text-brand-900 px-8 py-4 rounded-full font-bold hover:bg-accent-500 transition shadow-xl"
      >
        <span>{t("btn_browse_apps")}</span>
        <span>{lang === "ar" ? "←" : "→"}</span>
      </Link>
      <Link 
        href="/compare-hub" 
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition"
      >
        <span>🔍</span>
        <span>{t("btn_smart_compare")}</span>
      </Link>
    </div>
  </div>

  {/* Stats Bar - في النهاية */}
  <div className="stats-bar w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <p className="heading-elegant text-3xl md:text-4xl text-accent-400">+{allApps.length}</p>
          <p className="text-xs text-white/70 uppercase tracking-widest mt-1">{t("stat_apps")}</p>
        </div>
        <div className="text-center">
          <p className="heading-elegant text-3xl md:text-4xl text-accent-400">15</p>
          <p className="text-xs text-white/70 uppercase tracking-widest mt-1">{t("stat_categories")}</p>
        </div>
        <div className="text-center">
          <p className="heading-elegant text-3xl md:text-4xl text-accent-400">3</p>
          <p className="text-xs text-white/70 uppercase tracking-widest mt-1">{t("stat_countries")}</p>
        </div>
        <div className="text-center">
          <p className="heading-elegant text-3xl md:text-4xl text-accent-400">+{getActiveDeals(deals).length}</p>
          <p className="text-xs text-white/70 uppercase tracking-widest mt-1">{t("stat_deals")}</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ═══════════════════════════════════════ */}
      {/* FEATURED APPS SECTION                   */}
      {/* ═══════════════════════════════════════ */}
      <section className="bg-cream-50 section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent-600 text-sm uppercase tracking-[0.3em] mb-3">
              {lang === "ar" ? "الأكثر شعبية" : "Most Popular"}
            </p>
            <h2 className="heading-display text-5xl md:text-6xl text-brand-900 mb-4">
              {lang === "ar" ? "تطبيقات مختارة" : "Featured Apps"}
            </h2>
            <div className="divider-gold"></div>
            <p className="text-charcoal-500 max-w-xl mx-auto">
              {lang === "ar"
                ? "أفضل التطبيقات اللي اختارها المستخدمين بناءً على التقييم والشعبية"
                : "Top apps chosen by users based on ratings and popularity"}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {topApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/apps" className="btn-outline-dark">
              <span>{t("view_all")}</span>
              <span>{lang === "ar" ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* SPLIT SECTION - Discover                */}
      {/* ═══════════════════════════════════════ */}
      <section className="bg-cream-100 section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900 to-charcoal-800">
                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-30">
                  📱
                </div>
                <div className="absolute bottom-6 right-6 left-6 glass-light rounded-2xl p-6">
                  <p className="heading-elegant text-2xl text-brand-900 mb-2">
                    {lang === "ar" ? "163+ تطبيق" : "163+ Apps"}
                  </p>
                  <p className="text-sm text-charcoal-500">
                    {lang === "ar" ? "في 15 فئة مختلفة" : "Across 15 categories"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="divider-gold-left"></div>
              <p className="text-accent-600 text-sm uppercase tracking-[0.3em]">
                {lang === "ar" ? "اكتشف" : "Discover"}
              </p>
              <h2 className="heading-display text-5xl md:text-6xl text-brand-900">
                {lang === "ar" ? "أناقة" : "Elegant"}
                <br />
                <span className="italic text-accent-600">
                  {lang === "ar" ? "في الاختيار" : "Selection"}
                </span>
              </h2>
              <p className="text-lg text-charcoal-500 leading-relaxed">
                {lang === "ar"
                  ? "تصفّح مكتبة ضخمة من التطبيقات المختارة بعناية. قارن الأسعار، اقرا المراجعات، واختار الأفضل لاحتياجاتك."
                  : "Browse a curated library of carefully selected apps. Compare prices, read reviews, and choose what fits your needs."}
              </p>
              <Link href="/apps" className="btn-primary">
                <span>{lang === "ar" ? "ابدأ الاستكشاف" : "Start Exploring"}</span>
                <span>{lang === "ar" ? "←" : "→"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* DEALS SECTION                           */}
      {/* ═══════════════════════════════════════ */}
      {topDeals.length > 0 && (
      <section className="bg-cream-50 section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent-600 text-sm uppercase tracking-[0.3em] mb-3">
              {lang === "ar" ? "عروض حصرية" : "Exclusive Deals"}
            </p>
            <h2 className="heading-display text-5xl md:text-6xl text-brand-900 mb-4">
              {lang === "ar" ? "وفّر أكتر" : "Save More"}
            </h2>
            <div className="divider-gold"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topDeals.map((deal) => (
              <div key={deal.id} className="card-elegant p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs text-accent-600 font-bold uppercase tracking-wider">
                    {deal.brand}
                  </p>
                  <span className="rounded-full bg-brand-900 text-white px-3 py-1 text-xs font-bold">
                    -{deal.discount}%
                  </span>
                </div>

                <h3 className="heading-elegant text-lg text-brand-900 mb-4 line-clamp-2 min-h-[3rem]">
                  {deal.title}
                </h3>

                {deal.code && (
                  <div className="rounded-xl bg-cream-100 px-4 py-3 text-center border border-dashed border-accent-400">
                    <p className="text-xs text-charcoal-500 mb-1">
                      {lang === "ar" ? "كود الخصم" : "Promo Code"}
                    </p>
                    <p className="text-base font-bold text-brand-900 tracking-widest">
                      {deal.code}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200">
                  <span className="text-xs text-charcoal-500">
                    👁️ {deal.views} {lang === "ar" ? "مشاهدة" : "views"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* CTA SECTION                             */}
      {/* ═══════════════════════════════════════ */}
      <section className="bg-brand-900 section-padding">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <div className="divider-gold"></div>
          <h2 className="heading-display text-5xl md:text-6xl mb-6">
            {lang === "ar" ? "جاهز للبدء؟" : "Ready to Start?"}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {lang === "ar"
              ? "انضم لآلاف المستخدمين اللي بيستخدموا AppHub لاختيار أفضل التطبيقات"
              : "Join thousands of users using AppHub to find the best apps"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth" className="btn-gold">
              {lang === "ar" ? "سجّل مجانًا" : "Sign Up Free"}
            </Link>
            <Link href="/apps" className="btn-outline">
              {lang === "ar" ? "تصفّح أولاً" : "Browse First"}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* NEWSLETTER                              */}
      {/* ═══════════════════════════════════════ */}
      <section className="bg-cream-50 section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}