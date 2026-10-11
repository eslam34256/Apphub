import { NextResponse } from "next/server";
import {
  BUNDLES,
  NETWORK_LABELS,
  TELECOM_REVIEW_DATE,
  perGb,
  bestPerGb
} from "@/lib/telecom-data";

// رادار الباقات — بيانات مفتوحة مع الإشارة (مراجعة يدوية بتاريخ معلن)
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({
    reviewDate: TELECOM_REVIEW_DATE,
    currency: "EGP",
    unit: "EGP per GB",
    disclaimer: "قوائم منشورة — الأسعار بتتغير مع الزيادات، تأكد من تطبيق شركتك",
    bestAirPerGb: { bundle: bestPerGb("air").name, egpPerGb: Math.round(perGb(bestPerGb("air")) * 100) / 100 },
    bestMixedPerGb: { bundle: bestPerGb("mixed").name, egpPerGb: Math.round(perGb(bestPerGb("mixed")) * 100) / 100 },
    bundles: BUNDLES.map((b) => ({
      id: b.id,
      network: b.network,
      networkAr: NETWORK_LABELS[b.network],
      kind: b.kind,
      name: b.name,
      priceEgp: b.priceEgp,
      gb: Math.round(b.gb * 100) / 100,
      egpPerGb: Math.round(perGb(b) * 100) / 100,
      extra: b.extra ?? null
    })),
    attribution: "رادار الباقات AppHub — https://apphub.eg/telecom-radar"
  });
}
