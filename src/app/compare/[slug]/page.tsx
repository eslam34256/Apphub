import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getComparisonBySlug, getComparisonSlugs } from "@/data/comparisons";
import { comparisonSchemas, SITE_URL } from "@/lib/comparison-schema";
import { CompareHero } from "@/components/compare/compare-hero";
import { VerdictCard } from "@/components/compare/verdict-card";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { PricingSection } from "@/components/compare/pricing-section";
import { ProsConsCards } from "@/components/compare/pros-cons-cards";
import { ComparisonFaq } from "@/components/compare/comparison-faq";
import { RelatedComparisons } from "@/components/compare/related-comparisons";

type PageProps = { params: { slug: string } };

/**
 * أي slug مش في الداتا = 404 حقيقي (مش Soft 404 بـ status 200).
 * مقارنات جديدة بتتضاف للداتا وبتدخل في ريبيلد عادي.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getComparisonSlugs().map((slug) => ({ slug }));
}

/* عنوان/وصف/canonical/OG فريد لكل مقارنة */
export function generateMetadata({ params }: PageProps): Metadata {
  const c = getComparisonBySlug(params.slug);
  if (!c) return {};

  const url = `${SITE_URL}/compare/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      type: "article",
      locale: "ar_EG",
      siteName: "AppHub",
      modifiedTime: c.updatedAt
    },
    twitter: { card: "summary_large_image", title: c.metaTitle, description: c.metaDescription }
  };
}

export default function ComparisonPage({ params }: PageProps) {
  const c = getComparisonBySlug(params.slug);
  if (!c) notFound();

  return (
    <div className="bg-cream-50 min-h-screen">
      {comparisonSchemas(c).map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* مسار التنقل */}
        <nav aria-label="مسار التنقل" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-charcoal-500">
          <Link href="/" className="hover:text-accent-600 transition">الرئيسية</Link>
          <span aria-hidden>‹</span>
          <Link href="/compare" className="hover:text-accent-600 transition">المقارنات</Link>
          <span aria-hidden>‹</span>
          <span className="font-bold text-brand-900">{c.h1}</span>
        </nav>

        <CompareHero comparison={c} />
        <VerdictCard comparison={c} />
        <ComparisonTable comparison={c} />
        <PricingSection comparison={c} />
        <ProsConsCards comparison={c} />
        <ComparisonFaq comparison={c} />
        <RelatedComparisons comparison={c} />

        {/* CTA */}
        <section className="mt-12 rounded-3xl bg-brand-900 p-8 text-center text-white">
          <h2 className="heading-elegant text-2xl">لسه محتار؟</h2>
          <p className="mt-2 text-white/80">تصفح التقييمات الكاملة والتفاصيل لكل تطبيق في الدليل</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {c.apps.map((a) => (
              <Link
                key={a.appSlug}
                href={`/apps/${a.appSlug}`}
                className="rounded-2xl bg-white/10 px-5 py-2.5 font-bold transition hover:bg-white/20"
              >
                {a.icon} صفحة {a.name}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
