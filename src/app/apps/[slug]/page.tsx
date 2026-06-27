import { notFound } from "next/navigation";
import { apps as staticApps } from "@/data/apps";
import { countryLabels, categoryLabels } from "@/lib/constants";
import { formatMoney, getCheapestCountry } from "@/lib/helpers";
import { ReviewsSection } from "@/components/reviews-section";
import { AppStoreButtons } from "@/components/app-store-buttons";
import { CommentsSection } from "@/components/comments-section";
import { createClient } from "@/lib/supabase/server";
import { AppItem } from "@/lib/types";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export const revalidate = 0;

async function getApp(slug: string): Promise<AppItem | null> {
  const supabase = createClient();
  const { data: dbApp } = await supabase
    .from("managed_apps")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (dbApp) {
    return {
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
    };
  }

  return staticApps.find((a) => a.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = await getApp(params.slug);
  if (!app) {
    return {
      title: "التطبيق غير موجود",
      description: "التطبيق المطلوب غير موجود"
    };
  }

  const title = `${app.name} — مراجعة وأسعار ومقارنة`;
  const description = `${app.shortDescription}. اعرف الأسعار في مصر والسعودية والإمارات، المميزات والعيوب، ومراجعات المستخدمين.`;

  return {
    title,
    description,
    keywords: [
      app.name,
      ...app.tags,
      categoryLabels[app.category],
      "مراجعة",
      "أسعار",
      "تحميل"
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://apphub.eg/apps/${app.slug}`,
      images: [
        {
          url: `/api/og?app=${app.slug}`,
          width: 1200,
          height: 630,
          alt: app.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?app=${app.slug}`]
    },
    alternates: {
      canonical: `https://apphub.eg/apps/${app.slug}`
    }
  };
}

export default async function AppDetailsPage({ params }: Props) {
  const app = await getApp(params.slug);
  if (!app) return notFound();

  const cheapest = getCheapestCountry(app);

  // JSON-LD Schema للتطبيق
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    applicationCategory: categoryLabels[app.category],
    operatingSystem: "Android, iOS",
    inLanguage: "ar",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: app.rating,
      bestRating: "5",
      worstRating: "1",
      ratingCount: 100
    },
    offers: app.pricing.length > 0 ? {
      "@type": "Offer",
      price: app.pricing[0]?.monthly || "0",
      priceCurrency: app.pricing[0]?.currency || "EGP",
      availability: "https://schema.org/InStock"
    } : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8 animate-fade-in">
        {/* Hero */}
        <section className="rounded-3xl bg-white p-6 md:p-8 shadow-soft border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-5xl md:text-6xl shadow-md shrink-0">
              {app.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-bold">
                  {categoryLabels[app.category]}
                </span>
                <span className="rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <span>⭐</span>
                  <span>{app.rating}</span>
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{app.name}</h1>
              <p className="text-slate-600 mb-4">{app.shortDescription}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {app.countries.map((country) => (
                  <span
                    key={country}
                    className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-bold"
                  >
                    🌍 {countryLabels[country]}
                  </span>
                ))}
              </div>

              <AppStoreButtons
                  googlePlay={app.googlePlay}
                  appStore={app.appStore}
                  website={app.website}
                  appName={app.name}
                  />
            </div>
          </div>

          <p className="mt-6 text-slate-700 leading-relaxed border-t pt-6">
            {app.description}
          </p>

          {app.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Pros & Cons */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-emerald-100">
            <h2 className="mb-4 text-xl font-extrabold flex items-center gap-2">
              <span>✅</span>
              <span>المميزات</span>
            </h2>
            <ul className="space-y-2">
              {app.pros.map((item) => (
                <li
                  key={item}
                  className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800 flex items-start gap-2"
                >
                  <span className="shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft border border-rose-100">
            <h2 className="mb-4 text-xl font-extrabold flex items-center gap-2">
              <span>❌</span>
              <span>العيوب</span>
            </h2>
            <ul className="space-y-2">
              {app.cons.map((item) => (
                <li
                  key={item}
                  className="rounded-xl bg-rose-50 px-4 py-3 text-rose-800 flex items-start gap-2"
                >
                  <span className="shrink-0">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        {app.pricing.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <span>💰</span>
                <span>مقارنة الأسعار</span>
              </h2>
              {cheapest && (
                <span className="rounded-full bg-amber-100 text-amber-800 px-4 py-2 text-sm font-bold">
                  🏆 الأرخص: {countryLabels[cheapest.country]}
                </span>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {app.pricing.map((price) => (
                <div
                  key={price.country}
                  className="rounded-2xl border-2 border-slate-100 p-5 hover:border-brand-300 transition"
                >
                  <p className="font-bold text-lg mb-3">
                    🌍 {countryLabels[price.country]}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">شهري:</span>
                      <span className="font-bold">
                        {formatMoney(price.monthly, price.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">سنوي:</span>
                      <span className="font-bold">
                        {formatMoney(price.yearly, price.currency)}
                      </span>
                    </div>
                  </div>
                  {price.note && (
                    <p className="mt-3 text-xs text-slate-500 border-t pt-2">
                      💡 {price.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <ReviewsSection appSlug={app.slug} />
        <CommentsSection appSlug={app.slug} />
      </div>
    </>
  );
}