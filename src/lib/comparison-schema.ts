import type { Comparison } from "@/data/comparisons";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app"
).replace(/\/$/, "");
export const SITE_NAME = "AppHub";

/** FAQPage — أسئلة المقارنة تظهر كـ Rich Result في جوجل */
export function faqSchema(c: Comparison) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
}

/** Article — تاريخ التعديل بيقوّي إشارة «المحتوى محدث» */
export function articleSchema(c: Comparison) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.metaTitle,
    description: c.metaDescription,
    inLanguage: "ar",
    datePublished: c.updatedAt,
    dateModified: c.updatedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/compare/${c.slug}`,
    about: c.apps.map((a) => ({
      "@type": "SoftwareApplication",
      name: a.name,
      applicationCategory: c.category,
      operatingSystem: "Android, iOS",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: a.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 1000
      }
    }))
  };
}

/** BreadcrumbList — مسار التنقل في نتايج البحث */
export function breadcrumbSchema(c: Comparison) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "المقارنات", item: `${SITE_URL}/compare` },
      { "@type": "ListItem", position: 3, name: c.h1, item: `${SITE_URL}/compare/${c.slug}` }
    ]
  };
}

export function comparisonSchemas(c: Comparison) {
  return [faqSchema(c), articleSchema(c), breadcrumbSchema(c)];
}
