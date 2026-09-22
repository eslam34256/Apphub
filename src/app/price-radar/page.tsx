import type { Metadata } from "next";
import Link from "next/link";
import { getRadarEntries } from "@/lib/price-radar-db";
import {
  entryChange,
  formatPrice,
  currencySymbols,
  priceChange,
  latestPrice
} from "@/lib/price-radar";
import { PriceSparkline } from "@/components/price-radar/sparkline";
import { PriceAlertForm } from "@/components/price-radar/alert-form";
import { TelegramCard } from "@/components/price-radar/telegram-card";
import { RadarHub } from "@/components/radar-hub";
import { UcRadarContent } from "@/components/radars/uc-content";
import { TelecomRadarContent } from "@/components/radars/telecom-content";
import { AiRadarContent } from "@/components/radars/ai-content";
import { fetchUsdEgpRate } from "@/lib/ai-radar-data";
import { CountryCode } from "@/lib/types";

/**
 * 📡 مركز الرادارات — كل مستوايات التوفير في صفحة واحدة:
 * الاشتراكات (تاريخ الأسعار) + الشدات + الباقات + اشتراكات AI.
 * المحتوى الأصلي للرادار محفوظ بالكامل؛ التوبات تضيف الفرتيكالز الجديدة.
 * الصفحات المستقلة (/uc-radar, /telecom-radar, /ai-radar) لسه شغالة للـ SEO.
 */

// الصفحة بتتجدد كل ساعة من الكاش (البيانات بتتغير يوميًا بحد أقصى)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "مركز الرادارات — اشتراكاتك وشداتك وباقتك وأدوات AI في مكان واحد",
  description:
    "رادار الأسعار الأصلي (تاريخ اشتراكات التطبيقات) + رادار شدات ببجي بسعر الوحدة + رادار الباقات بسعر الجيجا + رادار اشتراكات AI بتحويل جنيه لايف — كلهم في صفحة واحدة منظمة.",
  alternates: { canonical: "https://apphub-eight.vercel.app/price-radar" }
};

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app"
).replace(/\/$/, "");

const countryNames: Record<CountryCode, string> = {
  EG: "🇪🇬 مصر",
  SA: "🇸🇦 السعودية",
  AE: "🇦🇪 الإمارات"
};

const dirStyles: Record<string, { badge: string; label: (pct: number) => string }> = {
  up: { badge: "bg-red-100 text-red-700", label: (p) => `▲ +${p}%` },
  down: { badge: "bg-emerald-100 text-emerald-700", label: (p) => `▼ -${p}%` },
  same: { badge: "bg-slate-100 text-slate-500", label: () => "مستقر" },
  new: { badge: "bg-accent-100 text-accent-700", label: () => "تحت الرصد 🔍" }
};

export default async function PriceRadarPage({
  searchParams
}: {
  searchParams: { country?: string };
}) {
  const country = (["EG", "SA", "AE"] as CountryCode[]).includes(
    searchParams.country as CountryCode
  )
    ? (searchParams.country as CountryCode)
    : undefined;

  const allEntries = await getRadarEntries();
  const entries = country ? allEntries.filter((e) => e.country === country) : allEntries;
  const trackedPlans = allEntries.reduce((n, e) => n + e.plans.length, 0);
  const changedRecently = allEntries
    .flatMap((e) => e.plans.map(priceChange))
    .filter((c) => c.dir === "up" || c.dir === "down").length;

  // سعر الصرف لايف لتوب اشتراكات AI
  const { rate, source } = await fetchUsdEgpRate();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "مركز الرادارات", item: `${SITE_URL}/price-radar` }
    ]
  };

  const subsContent = (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* الهيدر */}
      <header className="text-center">
        <span className="rounded-full bg-red-100 text-red-700 px-4 py-1.5 text-sm font-bold">
          🚨 الميزة الأقوى تنافسيًا
        </span>
        <h2 className="heading-display mt-4 text-3xl md:text-4xl text-brand-900">
          رادار الأسعار الرسمية
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-charcoal-500 leading-relaxed">
          الاشتراكات بتزيد أسعارها من غير ما تقول لحد. إحنا بنرصد سعر كل باقة
          بالتاريخ — نقطة بنقطة — عشان تعرف بالظبط مين زوّد وامتى، وتقرر على أساس بيانات.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <span className="rounded-full bg-white border border-cream-200 px-4 py-1.5 font-bold text-brand-900 shadow-soft">
            🔍 {allEntries.length} اشتراك تحت الرصد
          </span>
          <span className="rounded-full bg-white border border-cream-200 px-4 py-1.5 font-bold text-brand-900 shadow-soft">
            📊 {trackedPlans} باقة متتبعة
          </span>
          <span className="rounded-full bg-white border border-cream-200 px-4 py-1.5 font-bold text-brand-900 shadow-soft">
            📈 {changedRecently} تغيّر مرصود
          </span>
        </div>
      </header>

      {/* قناة التنبيهات الفورية */}
      <TelegramCard />

      {/* فورم التنبيهات */}
      <PriceAlertForm />

      {/* فلتر الدول */}
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href="/price-radar"
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            !country
              ? "bg-brand-900 text-white"
              : "bg-white border border-cream-200 text-charcoal-500 hover:border-accent-300"
          }`}
        >
          🌍 كل الدول
        </Link>
        {(Object.keys(countryNames) as CountryCode[]).map((c) => (
          <Link
            key={c}
            href={`/price-radar?country=${c}`}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              country === c
                ? "bg-brand-900 text-white"
                : "bg-white border border-cream-200 text-charcoal-500 hover:border-accent-300"
            }`}
          >
            {countryNames[c]}
          </Link>
        ))}
      </div>

      {/* كروت الاشتراكات */}
      <div className="grid gap-5 md:grid-cols-2">
        {entries.map((entry, ei) => {
          const change = entryChange(entry);
          const style = dirStyles[change.dir];
          return (
            <article key={`${entry.appSlug}-${entry.country}-${ei}`} className="card-elegant p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center text-3xl shadow-soft">
                    {entry.icon}
                  </span>
                  <div>
                    <h2 className="font-bold text-lg text-brand-900">
                      <Link href={`/apps/${entry.appSlug}`} className="hover:text-accent-600 transition">
                        {entry.name}
                      </Link>
                    </h2>
                    <p className="text-xs font-bold text-charcoal-500">
                      {countryNames[entry.country]}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${style.badge}`}>
                  {style.label(change.pct)}
                </span>
              </div>

              <ul className="mt-5 space-y-3">
                {entry.plans.map((plan, pi) => {
                  const latest = latestPrice(plan);
                  const ch = priceChange(plan);
                  if (!latest) return null;
                  return (
                    <li
                      key={pi}
                      className="flex items-center justify-between gap-3 rounded-xl bg-cream-50 border border-cream-200 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-charcoal-800 truncate">
                          {plan.name}
                          {plan.note && (
                            <span className="mr-2 font-normal text-xs text-charcoal-500">
                              {plan.note}
                            </span>
                          )}
                        </p>
                        <p className="text-lg font-black text-brand-900" dir="ltr">
                          {formatPrice(latest.price, entry.currency)}{" "}
                          <span className="text-xs font-bold text-charcoal-500">
                            {currencySymbols[entry.currency]} / ش
                          </span>
                        </p>
                        {ch.dir === "same" && ch.oldDate && (
                          <p className="text-xs text-slate-400">
                            ثابت منذ {ch.oldDate}
                          </p>
                        )}
                        {(ch.dir === "up" || ch.dir === "down") && (
                          <p className={`text-xs font-bold ${ch.dir === "up" ? "text-red-600" : "text-emerald-600"}`}>
                            {ch.dir === "up" ? "▲" : "▼"} {ch.pct}% منذ {ch.oldDate}
                          </p>
                        )}
                      </div>
                      <PriceSparkline points={plan.points} trend={ch.dir} />
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 text-xs text-charcoal-500 flex items-center justify-between">
                <span>🔄 آخر مراجعة: {entry.updatedAt}</span>
                <Link
                  href={`/apps/${entry.appSlug}`}
                  className="font-bold text-accent-600 hover:text-accent-700"
                >
                  صفحة التطبيق ←
                </Link>
              </p>
            </article>
          );
        })}
      </div>

      {/* المنهجية — الثقة */}
      <section className="card-elegant p-6 border-r-4 border-r-accent-400">
        <h2 className="heading-elegant text-xl text-brand-900">📜 إزاي بنرصد الأسعار؟</h2>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-charcoal-800">
          <li className="flex gap-2"><span aria-hidden>•</span> مراجعة دورية للأسعار الرسمية المنشورة من كل منصة، وتوثيق كل تغيّر بتاريخه.</li>
          <li className="flex gap-2"><span aria-hidden>•</span> الأسعار لا تشمل ضريبة القيمة المضافة وقد تختلف حسب وسيلة الدفع (تطبيق/ويب/فاتورة محمول).</li>
          <li className="flex gap-2"><span aria-hidden>•</span> أول ما سعر يتحرك، التنبيه بيوصل للمشتركين في رادار الأسعار فورًا.</li>
        </ul>
      </section>
    </div>
  );

  return (
    <RadarHub
      subs={subsContent}
      uc={<UcRadarContent />}
      telecom={<TelecomRadarContent />}
      ai={<AiRadarContent rate={rate} source={source} />}
    />
  );
}
