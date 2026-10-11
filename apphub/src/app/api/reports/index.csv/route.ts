import { NextResponse } from "next/server";
import { computePriceIndex } from "@/lib/price-index";
import { loadPlanSeries } from "@/lib/price-index-data";

// عينة تقرير مؤشر AppHub للأسعار — CSV مجاني للصحافة والباحثين مع الإشارة
// نفس الحساب اللي بيشغّل /price-index و /api/price-index (مصدر واحد للحقيقة)
export const revalidate = 3600;

function csvEscape(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET() {
  const { plans, source } = await loadPlanSeries();
  const result = computePriceIndex(plans);

  const lines: string[] = [
    "# تقرير مؤشر AppHub للأسعار — عينة مجانية للصحافة والبحث",
    `# مؤشر AppHub للأسعار | https://apphub.eg/price-index | الإشارة إلزامية عند الاستخدام`,
    `# مصدر البيانات: ${source === "db" ? "رصد الرادار (قاعدة البيانات)" : "الداتا الثابتة"} | التوليد: ${new Date().toISOString()}`,
    ""
  ];

  if (!result) {
    lines.push("الحالة,collecting — المؤشر لسه بيجمع بيانات مؤكدة");
  } else {
    lines.push("# ملخص الرقم");
    lines.push("الحقل,القيمة");
    lines.push(`القيمة الحالية,${result.current}`);
    lines.push(`نسبة التغيير %,${result.changePct}`);
    lines.push(`تاريخ الأساس,${result.baseDate}`);
    lines.push(`عدد الخطط,${result.plansCount}`);
    lines.push(`زادت,${result.upCount}`);
    lines.push(`نقصت,${result.downCount}`);
    lines.push(`ثابتة,${result.unchangedCount}`);
    lines.push("");
    lines.push("# أكبر التحركات (خطة — نسبة التغيير %)");
    lines.push("الخطة,التغيير %,من,إلى,العملة");
    for (const m of result.movers.slice(0, 20)) {
      lines.push([csvEscape(m.label), m.pct, m.from, m.to, m.currency].join(","));
    }
    lines.push("");
    lines.push("# السلسلة الشهرية (تاريخ — قيمة المؤشر)");
    lines.push("الشهر,قيمة المؤشر");
    for (const p of result.series) {
      lines.push(`${p.date},${p.value}`);
    }
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="apphub-price-index.csv"`
    }
  });
}
