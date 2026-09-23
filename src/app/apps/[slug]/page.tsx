import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAppBySlug } from "@/lib/app-data";
import { AppDetailsView } from "@/components/app-details-view";
import { safeJsonLd } from "@/lib/json-ld";

/**
 * صفحة تفاصيل التطبيق — Server Component بالكامل.
 *
 * قبل كده كانت Client Component ومحتواها كله بيتحمل بـ useEffect،
 * يعني جوجل كان بيشوف صفحة فاضية فيها «جاري التحميل...» بس.
 * دلوقتي: الـ HTML كامل من السيرفر + عنوان ووصف فريد + JSON-LD لكل تطبيق.
 */

/**
 * صفحة تفاصيل التطبيق — Server Component بالكامل.
 *
 * قبل كده كانت Client Component ومحتواها كله بيتحمل بـ useEffect،
 * يعني جوجل كان بيشوف صفحة فاضية فيها «جاري التحميل...» بس.
 * دلوقتي: الـ HTML كامل من السيرفر + عنوان ووصف فريد + JSON-LD لكل تطبيق.
 */

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app"
).replace(/\/$/, "");

const categoryLabels: Record<string, string> = {
  food: "أكل وتوصيل",
  streaming: "ستريمنج",
  shopping: "تسوق",
  health: "صحة",
  transport: "مواصلات",
  education: "تعليم",
  finance: "فلوس وبنوك",
  "real-estate": "عقارات",
  travel: "سفر",
  gaming: "ألعاب",
  kids: "أطفال",
  tools: "أدوات",
  religious: "ديني",
  government: "حكومي",
  freelance: "فريلانس"
};

type PageProps = { params: { slug: string } };

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const app = await getAppBySlug(params.slug);
  // notFound() هنا — قبل ما الـ streaming يبدأ — بيضمن status 404 حقيقي مش Soft 404
  if (!app) notFound();

  const url = `${SITE_URL}/apps/${app.slug}`;
  const category = categoryLabels[app.category] || app.category;
  const title = `${app.name} — تقييم وأسعار ومميزات وعيوب`;
  const description = `${app.shortDescription}. تقييم ${app.rating}⭐ في فئة ${category} — اعرف الأسعار والمميزات والعيوب قبل ما تحمّل.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | AppHub`,
      description,
      url,
      type: "website",
      locale: "ar_EG",
      siteName: "AppHub"
    },
    twitter: {
      card: "summary",
      title: `${title} | AppHub`,
      description
    }
  };
}

export default async function AppDetailsPage({ params }: PageProps) {
  const app = await getAppBySlug(params.slug);
  if (!app) notFound();

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: app.name,
      description: app.shortDescription,
      applicationCategory: categoryLabels[app.category] || app.category,
      operatingSystem: "Android, iOS",
      inLanguage: "ar",
      url: `${SITE_URL}/apps/${app.slug}`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: app.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 1000
      },
      offers: app.pricing.length
        ? {
            "@type": "Offer",
            price: app.pricing[0].monthly ?? 0,
            priceCurrency: app.pricing[0].currency
          }
        : undefined
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "التطبيقات",
          item: `${SITE_URL}/apps`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: app.name,
          item: `${SITE_URL}/apps/${app.slug}`
        }
      ]
    }
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(s) }}
        />
      ))}
      <AppDetailsView app={app} />
    </>
  );
}
