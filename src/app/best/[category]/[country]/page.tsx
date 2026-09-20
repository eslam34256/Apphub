import type { Metadata } from "next";
import Link from "next/link";
import { SponsoredSlot } from "@/components/sponsored-slot";
import { notFound } from "next/navigation";

import { getAllAppsMerged } from "@/lib/app-data";
import {
  bestCombos,
  countryFromSlug,
  filterBest,
  localPriceLabel,
  bestVerdicts,
  categoryEmoji,
  categoryName,
  BEST_COUNTRIES,
  type CountryInfo
} from "@/lib/best";
import { comparisons } from "@/data/comparisons";
import { groupAppsBySubcategory } from "@/data/subcategories";

/**
 * 🏆 صفحات «الأفضل في البلد» البرمجية — آلة الترافيك:
 * أي (فئة × دولة) بتولّد صفحة SEO كاملة بالترتيب والأسعار المحلية
 * والمقارنات المتصلة والسكيما. كتابة الكود مرة واحدة = 45 صفحة.
 */

export const revalidate = 3600;
export const dynamicParams = false;

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app"
).replace(/\/$/, "");

const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return bestCombos();
}

type PageProps = { params: { category: string; country: string } };

function validCombo(category: string, countrySlug: string) {
  return bestCombos().some((c) => c.category === category && c.country === countrySlug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = countryFromSlug(params.country);
  if (!country || !validCombo(params.category, params.country)) return {};

  const cat = categoryName(params.category);
  const url = `${SITE_URL}/best/${params.category}/${params.country}`;
  const title = `أفضل تطبيقات ${cat} في ${country.name} ${YEAR} — ترشيحات بالأسعار والتقييم`;
  const description = `ترشيحات AppHub لأفضل تطبيقات ${cat} المتاحة في ${country.name}: مرتّبة بالتقييم الحقيقي مع الأسعار المحلية والمميزات والبدائل الأوفر — محدثة دوريًا.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "ar_EG", siteName: "AppHub" }
  };
}

function faq(catName: string, countryName: string, list: { name: string; rating: number }[], cheapestName?: string, freeCount = 0) {
  const top = list[0];
  return [
    {
      q: `إيه أفضل تطبيق ${catName} في ${countryName}؟`,
      a: `حسب ترتيب AppHub الحالي، ${top?.name} هو الترشيح الأول في فئة ${catName} في ${countryName} بتقييم ${top?.rating} من 5، متبوعًا بـ ${list.slice(1, 3).map((a) => a.name).join(" و") || "—"}.`
    },
    {
      q: `فيه تطبيقات ${catName} مجانية في ${countryName}؟`,
      a: freeCount > 0
        ? `أيوه، فيه ${freeCount} من أصل ${list.length} تطبيق في القائمة بيقدم خدمته مجانًا أو بموديول مجاني. باقي القائمة ما بين اشتراكات رمزية وباقات مدفوعة بالكامل.`
        : `معظم تطبيقات ${catName} في ${countryName} بتشتغل بموديول اشتراك أو خدمة مدفوعة — شوف الأسعار المحلية مكتوبة جنب كل تطبيق في القائمة.`
    },
    {
      q: `إيه أرخص اختيار مدفوع في ${catName} بـ ${countryName}؟`,
      a: cheapestName
        ? `${cheapestName} هو الأقل سعرًا شهريًا بين المدفوعات في الترتيب الحالي — بس خد بالك: الأرخص مش دايمنًا الأنسب، وازن السعر جنب التقييم والمميزات الأساسية اللي محتاجها.`
        : `القائمة الحالية كلها مجانية أو بأسعار متغيّرة حسب الاستخدام — قارن المميزات بدل الاشتراك الثابت.`
    }
  ];
}

export default async function BestCategoryPage({ params }: PageProps) {
  const country = countryFromSlug(params.country);
  if (!country || !validCombo(params.category, params.country)) notFound();

  const cat = categoryName(params.category);
  const emoji = categoryEmoji[params.category] ?? "📱";
  const allApps = await getAllAppsMerged();
  const list = filterBest(allApps, params.category, country.code);
  if (!list.length) notFound();

  const verdicts = bestVerdicts(list, country);
  /** تقسيم بالفئات الفرعية: «ستريمنج» بتتفصل لأفلام/موسيقى بدل ترتيب مُخلط */
  const groups = groupAppsBySubcategory(list);
  const faqItems = faq(cat, country.name, list, verdicts.cheapest?.name, verdicts.freeCount);
  const relatedComparisons = comparisons.filter((c) => c.category === cat);
  const otherCountries = BEST_COUNTRIES.filter((c) => c.code !== country.code);
  const updatedAt = new Date().toISOString().slice(0, 10);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `أفضل تطبيقات ${cat} في ${country.name}`,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: list.length,
      itemListElement: list.slice(0, 20).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.name,
        url: `${SITE_URL}/apps/${a.slug}`
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "الأفضل", item: `${SITE_URL}/best` },
        { "@type": "ListItem", position: 3, name: cat, item: `${SITE_URL}/best/${params.category}/${params.country}` }
      ]
    }
  ];

  return (
    <div className="bg-cream-50 min-h-screen">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* مسار التنقل */}
        <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-sm text-charcoal-500">
          <Link href="/" className="hover:text-accent-600 transition">الرئيسية</Link>
          <span aria-hidden>‹</span>
          <Link href="/best" className="hover:text-accent-600 transition">الأفضل</Link>
          <span aria-hidden>‹</span>
          <span className="font-bold text-brand-900">{cat} في {country.name}</span>
        </nav>

        {/* الهيدر */}
        <header>
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
            <span className="rounded-full bg-accent-100 text-accent-700 px-3 py-1">{emoji} {cat}</span>
            <span className="rounded-full bg-sage-50 border border-sage-200 text-sage-700 px-3 py-1">{country.flag} {country.name}</span>
          </div>
          <h1 className="heading-display mt-4 text-3xl md:text-4xl text-brand-900">
            أفضل تطبيقات {cat} في {country.name} — {YEAR}
          </h1>
          <p className="mt-3 max-w-2xl text-charcoal-500 leading-relaxed">
            رتّبنا لك {list.length} {list.length > 2 ? "تطبيقًا" : "تطبيق"} في فئة {cat} بالتقييم
            الحقيقي مع الأسعار المحلية بالعملة، عشان تختار في دقيقة بدل ساعات بحث.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage-50 border border-sage-200 px-3 py-1 text-xs font-bold text-sage-700">
            🔄 آخر تحديث: {updatedAt}
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            {verdicts.top && (
              <span className="rounded-full bg-white border border-cream-200 px-4 py-1.5 font-bold text-brand-900 shadow-soft">
                🏆 الأعلى تقييمًا: {verdicts.top.name} ⭐{verdicts.top.rating}
              </span>
            )}
            {verdicts.cheapest && (
              <span className="rounded-full bg-white border border-cream-200 px-4 py-1.5 font-bold text-brand-900 shadow-soft">
                💰 الأوفر: {verdicts.cheapest.name} ({localPriceLabel(verdicts.cheapest, country)})
              </span>
            )}
            {verdicts.freeCount > 0 && (
              <span className="rounded-full bg-white border border-cream-200 px-4 py-1.5 font-bold text-brand-900 shadow-soft">
                🆓 {verdicts.freeCount} مجاني
              </span>
            )}
          </div>
        </header>

        {/* خانة إعلان برعاية — بشارة «إعلان» صريحة، والترتيب مش قابل للشراء */}
        <SponsoredSlot placement={`best:${params.category}`} />

        {/* القائمة المرتبة — مقسّمة بالفئات الفرعية لو الفئة فيها أكتر من نوع */}
        {groups.length > 1 ? (
          <div className="space-y-10">
            {groups.map((g) => (
              <section key={g.key} aria-label={g.label}>
                <h2 className="heading-elegant mb-1 text-2xl text-brand-900">
                  {g.icon} أفضل {g.label}
                </h2>
                <p className="mb-4 text-sm text-charcoal-500">
                  {g.apps.length} {g.apps.length > 2 ? "تطبيقات" : "تطبيق"} — مرتبة بالتقييم والسعر المحلي
                </p>
                <ol className="space-y-4">
                  {g.apps.map((app, i) => (
                    <RankedItem key={app.slug} app={app} rank={i} country={country} />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <ol className="space-y-4">
            {list.map((app, i) => (
              <RankedItem key={app.slug} app={app} rank={i} country={country} />
            ))}
          </ol>
        )}

        {/* مقارنات متصلة */}
        {relatedComparisons.length > 0 && (
          <section aria-labelledby="rel" className="card-elegant p-6">
            <h2 id="rel" className="heading-elegant text-xl text-brand-900 mb-4">
              ⚖️ محتار بينهم؟ قارنهم وجهًا لوجه
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedComparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="rounded-full bg-cream-100 px-4 py-2 text-sm font-bold text-brand-900 hover:bg-accent-100 hover:text-accent-700 transition"
                >
                  {c.h1} ←
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section aria-labelledby="faq">
          <h2 id="faq" className="heading-elegant text-2xl text-brand-900 mb-4">🤔 أسئلة شائعة</h2>
          <div className="space-y-3">
            {faqItems.map((f, i) => (
              <details key={i} className="card-elegant group p-5 open:ring-1 open:ring-accent-300">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-brand-900 marker:hidden">
                  {f.q}
                  <span aria-hidden className="shrink-0 text-charcoal-500 transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 leading-8 text-charcoal-500">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* روابط شقيقة: نفس الفئة في دول تانية */}
        <section className="rounded-3xl bg-brand-900 p-6 text-white">
          <p className="font-bold text-white/90">
            {country.flag} بتتفرج من غير {country.name}؟ شوف نفس القائمة هنا:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {otherCountries.map((c) => (
              <Link
                key={c.code}
                href={`/best/${params.category}/${c.slug}`}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20 transition"
              >
                {c.flag} أفضل {cat} في {c.name}
              </Link>
            ))}
            <Link
              href="/best"
              className="rounded-full bg-accent-400 px-4 py-2 text-sm font-black text-brand-900 hover:bg-accent-300 transition"
            >
              كل الترشيحات ←
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

const rankStyle = (i: number) =>
  i === 0 ? "border-accent-400 ring-1 ring-accent-300" : "border-cream-200";

const rankBadge = (i: number) => ["🥇", "🥈", "🥉"][i] ?? `#${i + 1}`;

/** صف تطبيق في القائمة المرتبة — بيستخدمه المقطع الموحد وسكاشن الفئات الفرعية */
function RankedItem({
  app,
  rank,
  country
}: {
  app: ReturnType<typeof filterBest>[number];
  rank: number;
  country: CountryInfo;
}) {
  const localNote = app.pricing.find((p) => p.country === country.code)?.note;
  return (
    <li>
      <div className={`card-elegant flex flex-col sm:flex-row sm:items-center gap-4 p-5 border-r-4 ${rankStyle(rank)}`}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="w-12 shrink-0 text-center font-black text-lg text-charcoal-500">
            {rankBadge(rank)}
          </span>
          <span className="w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center text-4xl shadow-soft shrink-0">
            {app.icon}
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-brand-900 truncate">
              <Link href={`/apps/${app.slug}`} className="hover:text-accent-600 transition">
                {app.name}
              </Link>
            </h3>
            <p className="text-sm text-charcoal-500 truncate">{app.shortDescription}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-amber-600">⭐ {app.rating}</span>
              <span className="rounded-full bg-sage-50 border border-sage-200 text-sage-700 px-2 py-0.5">
                {localPriceLabel(app, country)}
              </span>
              {localNote && (
                <span className="text-charcoal-500 font-normal">💡 {localNote}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col gap-2 shrink-0">
          <Link
            href={`/apps/${app.slug}`}
            className="btn-primary text-center text-sm whitespace-nowrap"
          >
            التفاصيل ←
          </Link>
        </div>
      </div>
    </li>
  );
}

