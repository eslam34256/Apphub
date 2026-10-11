import { computePriceIndex, type PriceIndexResult } from "./price-index";
import { loadPlanSeries } from "./price-index-data";
import { OFFICIAL_PACKS, MARKET_AVERAGE, pricePer100, packTotal, UC_REVIEW_DATE_AR } from "./uc-data";
import { BUNDLES, bestPerGb } from "./telecom-data";
import { AI_TOOLS, AI_REVIEW_DATE_AR } from "./ai-radar-data";
import { TELECOM_REVIEW_DATE_AR } from "./telecom-data";

/**
 * التقرير الربع سنوي التلقائي — كل رقم محسوب في اللحظة من نفس
 * مصادر الرادارات الأربعة + مؤشر الأسعار (صفر أرقام مكتوبة بإيد).
 * مادة v24/v28: منتج B2B بتصدير تلقائي (CSV في /api/reports/index.csv هو أخوه).
 */

export type UcGapRow = {
  pack: string;          // اسم الباك
  officialPer100: number;
  marketPer100: number;
  gapPct: number;        // سالب = الرسمي أرخص
};

export type QuarterlyReport = {
  id: string;
  titleAr: string;
  periodAr: string;
  generatedAt: string;          // ISO
  reviewDatesAr: string;        // تواريخ مراجعة كل قطاع
  index: PriceIndexResult;
  ucGaps: UcGapRow[];
  bestOfficialUcPer100: number;
  bestTelecom: { label: string; perGb: number; priceEgp: number; gb: number };
  cheapestAi: { name: string; usd: number };
  aiAt20Count: number;
  aiToolsCount: number;
  bundlesCount: number;
  ucPacksCount: number;
};

export async function buildQuarterlyReport(id: string, titleAr: string, periodAr: string): Promise<QuarterlyReport | null> {
  const { plans } = await loadPlanSeries();
  const index = computePriceIndex(plans);
  if (!index) return null;

  // فجوة UC: الرسمي مقابل متوسط السوق الموثّق سعره الفعلي — كل باك (المفتاح p60/p325...)
  const ucGaps: UcGapRow[] = OFFICIAL_PACKS.map((p) => {
    const m = MARKET_AVERAGE[`p${p.uc}`];
    if (!m) return null;
    const officialPer100 = Math.round(pricePer100(p) * 100) / 100;
    const marketPer100 = Math.round((m.avgEgp / (m.ucTotal / 100)) * 100) / 100;
    const gapPct = Math.round(((officialPer100 - marketPer100) / marketPer100) * 1000) / 10;
    return { pack: `${packTotal(p)} UC`, officialPer100, marketPer100, gapPct };
  }).filter((x): x is UcGapRow => x !== null);

  const bestOfficialUcPer100 = Math.min(...OFFICIAL_PACKS.map((p) => pricePer100(p)));

  const bt = bestPerGb();
  const bestTelecom = {
    label: `${bt.name} — ${bt.priceEgp} ج / ${bt.gb} جيجا`,
    perGb: Math.round((bt.priceEgp / bt.gb) * 100) / 100,
    priceEgp: bt.priceEgp,
    gb: bt.gb
  };

  const allTiers = AI_TOOLS.flatMap((t) => t.tiers.map((tier) => ({ name: t.name, usd: tier.usd })));
  const cheapestAi = allTiers.reduce((min, t) => (t.usd < min.usd ? t : min), allTiers[0]);
  const aiAt20Count = allTiers.filter((t) => t.usd === 20).length;

  return {
    id,
    titleAr,
    periodAr,
    generatedAt: new Date().toISOString(),
    reviewDatesAr: `ألعاب: ${UC_REVIEW_DATE_AR} · تيليك: ${TELECOM_REVIEW_DATE_AR} · AI: ${AI_REVIEW_DATE_AR}`,
    index,
    ucGaps,
    bestOfficialUcPer100: Math.round(bestOfficialUcPer100 * 100) / 100,
    bestTelecom,
    cheapestAi,
    aiAt20Count,
    aiToolsCount: AI_TOOLS.length,
    bundlesCount: BUNDLES.length,
    ucPacksCount: OFFICIAL_PACKS.length
  };
}

/** تقارير المنشورة — يضاف واحد كل ربع */
export const PUBLISHED_REPORTS = [
  { id: "q3-2026", titleAr: "مؤشر الاقتصاد الرقمي المصري — Q3 2026", periodAr: "يوليو – سبتمبر ٢٠٢٦" }
];

export async function getReport(id: string): Promise<QuarterlyReport | null> {
  const meta = PUBLISHED_REPORTS.find((r) => r.id === id);
  if (!meta) return null;
  return buildQuarterlyReport(meta.id, meta.titleAr, meta.periodAr);
}
