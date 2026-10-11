import { NextResponse } from "next/server";
import { AI_TOOLS, AI_REVIEW_DATE, fetchUsdEgpRate } from "@/lib/ai-radar-data";

// رادار اشتراكات AI — أسعار رسمية بالدولار + تحويل جنيه لايف (نفس مصدر /api/fx)
export const revalidate = 3600;

export async function GET() {
  const { rate, source } = await fetchUsdEgpRate();
  return NextResponse.json({
    reviewDate: AI_REVIEW_DATE,
    baseCurrency: "USD",
    egpRate: rate, // null بصدق لو المصدر غير متاح — ممنوع متوسط مختلق
    egpRateSource: source,
    note: "التحويل استرشادي — البنك بيخصم بسعر لحظة العملية وقد يضيف رسومًا",
    tools: AI_TOOLS.map((t) => ({
      id: t.id,
      name: t.name,
      bestFor: t.bestFor,
      free: t.free,
      tiers: t.tiers.map((tier) => ({
        name: tier.name,
        usd: tier.usd,
        egpApprox: rate != null ? Math.round(tier.usd * rate) : null,
        tag: tier.tag
      }))
    })),
    attribution: "رادار اشتراكات AI — AppHub https://apphub.eg/ai-radar"
  });
}
