import type { Metadata } from "next";
import { CalculatorClient } from "@/components/calculator/calculator-client";
import { apps as allApps } from "@/data/apps";
import { monthlyOf, currencyOf, calcTotals } from "@/lib/spend";
import { formatMoney } from "@/lib/helpers";
import { CountryCode } from "@/lib/types";

/**
 * /calculator — حاسبة المصروف الرقمي.
 * عند المشاركة (?apps=...&country=...) الوصف نفسه بيولّد ديناميكيًا
 * من الاختيارات — يعني لينك واتساب يقول «مشترك في كذا بكذا جنيه»
 * قبل ما حد يفتح الرابط.
 */

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app"
).replace(/\/$/, "");

function parseCountry(raw?: string): CountryCode {
  return raw === "SA" || raw === "AE" ? raw : "EG";
}

export function generateMetadata({
  searchParams
}: {
  searchParams: { apps?: string; country?: string };
}): Metadata {
  const country = parseCountry(searchParams.country);
  const base = {
    title: "حاسبة المصروف الرقمي — كام بتدفع في اشتراكاتك؟",
    description:
      "احسب إجمالي اشتراكاتك الشهرية والسنوية في ثواني، واكتشف بدائل أوفر بنفس الجودة — بتشتغل في مصر والسعودية والإمارات.",
    alternates: { canonical: `${SITE_URL}/calculator` }
  };

  if (!searchParams.apps) return base;

  const slugs = searchParams.apps.split(",").filter(Boolean);
  const chosen = allApps.filter(
    (a) => slugs.includes(a.slug) && monthlyOf(a, country) > 0
  );
  if (!chosen.length) return base;

  const { monthly } = calcTotals(chosen, country);
  const names = chosen.slice(0, 4).map((a) => a.name).join(" + ");
  const currency = currencyOf(country);

  return {
    title: `اشتراكاتي: ${formatMoney(monthly, currency)} شهريًا`,
    description: `${names}${chosen.length > 4 ? " وأكثر" : ""} — بيكلفوني ${formatMoney(
      monthly,
      currency
    )} في الشهر و${formatMoney(monthly * 12, currency)} في السنة 😳 احسب مصروفك إنت كمان على AppHub.`,
    alternates: { canonical: `${SITE_URL}/calculator` }
  };
}

export default function CalculatorPage({
  searchParams
}: {
  searchParams: { apps?: string; country?: string };
}) {
  const country = parseCountry(searchParams.country);
  const initialApps = searchParams.apps?.split(",").filter(Boolean) ?? [];

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <header className="text-center">
          <span className="rounded-full bg-accent-100 text-accent-700 px-4 py-1.5 text-sm font-bold">
            🧮 أداة جديدة
          </span>
          <h1 className="heading-display mt-4 text-4xl md:text-5xl text-brand-900">
            حاسبة المصروف الرقمي
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-charcoal-500 leading-relaxed">
            اشتراكاتك بتدفع من جيبك كل شهر من غير ما تحس. جمعها هنا في رقم واحد —
            واكتشف نفس الجودة بسعر أقل في ثواني.
          </p>
        </header>

        <CalculatorClient initialApps={initialApps} initialCountry={country} />
      </div>
    </div>
  );
}
