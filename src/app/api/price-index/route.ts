import { NextResponse } from "next/server";
import { computePriceIndex } from "@/lib/price-index";
import { loadPlanSeries } from "@/lib/price-index-data";

// مؤشر AppHub للأسعار — بيانات مفتوحة (استخدمها مع الإشارة)
// نفس الحساب اللي بيظهر على /price-index — متجدد كل ساعة
export const revalidate = 3600;

export async function GET() {
  const { plans, source } = await loadPlanSeries();
  const result = computePriceIndex(plans);

  if (!result) {
    return NextResponse.json(
      {
        status: "collecting",
        message: "المؤشر لسه بيجمع بيانات مؤكدة كافية — ممنوع يطلع برقم مبني على هوا."
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    status: "ready",
    index: {
      current: result.current,
      changePct: result.changePct,
      baseDate: result.baseDate
    },
    coverage: {
      plans: result.plansCount,
      up: result.upCount,
      down: result.downCount,
      unchanged: result.unchangedCount
    },
    biggestMove: result.biggestMove,
    movers: result.movers.slice(0, 10),
    series: result.series,
    source /* "db" = رصد الرادار | "seed" = الداتا الثابتة */,
    methodology: "https://apphub.eg/methodology",
    attribution: "مؤشر AppHub للأسعار — https://apphub.eg/price-index",
    computedAt: result.computedAt
  });
}
