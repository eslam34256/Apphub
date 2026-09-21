import { NextResponse } from "next/server";
import {
  OFFICIAL_PACKS,
  MARKET_AVERAGE,
  TRUSTED_CHANNELS,
  UC_REVIEW_DATE,
  packTotal,
  pricePer100,
  bestValuePackIndex
} from "@/lib/uc-data";

// رادار شدات ببجي — بيانات مفتوحة مع الإشارة (مراجعة يدوية بتاريخ معلن)
// كاش ساعة الدنيا — الداتا ثابتة هادية لكن الكاش بيخفف التكرار
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({
    reviewDate: UC_REVIEW_DATE,
    currency: "EGP",
    source: "Midasbuy (الشريك الرسمي لببجي) — مراجعة يدوية",
    marketAverageNote: "متوسطات سوق استرشادية — ليست عروض بيع",
    unit: "EGP per 100 UC",
    packs: OFFICIAL_PACKS.map((p, i) => ({
      uc: p.uc,
      bonus: p.bonus,
      totalUc: packTotal(p),
      priceEgp: p.priceEgp,
      pricePer100Uc: Math.round(pricePer100(p) * 100) / 100,
      bestValue: i === bestValuePackIndex()
    })),
    marketAverage: Object.entries(MARKET_AVERAGE).map(([k, v]) => ({
      key: k,
      ucTotal: v.ucTotal,
      avgEgp: v.avgEgp
    })),
    trustedChannels: TRUSTED_CHANNELS.map((c) => ({
      name: c.name,
      url: c.url,
      official: c.official
    })),
    attribution: "رادار شدات AppHub — https://apphub.eg/uc-radar",
    methodology: "https://apphub.eg/methodology"
  });
}
