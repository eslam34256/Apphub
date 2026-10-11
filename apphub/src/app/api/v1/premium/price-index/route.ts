import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { computePriceIndex } from "@/lib/price-index";
import { loadPlanSeries } from "@/lib/price-index-data";

/**
 * API مدفوعة لبيانات مؤشر AppHub للأسعار.
 * الوصول برأس x-api-key صالح من جدول api_keys (وصول خدمي فقط — service role).
 * الاستخدام بيتسجل في api_usage.
 */
function admin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "x-api-key header required" },
      { status: 401 }
    );
  }

  let tier = "pro";
  let keyId: string | null = null;
  let valid = false;

  try {
    const { data: keyRow } = await admin()
      .from("api_keys")
      .select("id, tier, active")
      .eq("key", apiKey)
      .single();

    if (keyRow?.active) {
      valid = true;
      keyId = keyRow.id;
      tier = keyRow.tier ?? "pro";
    }
  } catch { /* service role غير مهيأ */ }

  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "Invalid or inactive API key" },
      { status: 403 }
    );
  }

  try {
    const { plans, source } = await loadPlanSeries();
    const result = computePriceIndex(plans);
    if (!result) {
      return NextResponse.json(
        { ok: false, error: "collecting", message: "المؤشر لسه بيجمع بيانات" },
        { status: 200 }
      );
    }

    // سجّل الاستخدام (لا يمنع الرد لو فشل)
    void admin()
      .from("api_usage")
      .insert({ key_id: keyId, endpoint: "/api/v1/premium/price-index" })
      .then(() => {}, () => {});

    return NextResponse.json({
      meta: {
        tier,
        source, /* "db" = رصد الرادار | "seed" = الداتا الثابتة */
        attribution: "مؤشر AppHub للأسعار — إشارة إلزامية في أي استخدام تجاري",
        methodology: "https://apphub.eg/methodology"
      },
      index: {
        current: result.current,
        changePct: result.changePct,
        baseDate: result.baseDate,
        computedAt: result.computedAt
      },
      coverage: {
        plans: result.plansCount,
        up: result.upCount,
        down: result.downCount,
        unchanged: result.unchangedCount
      },
      movers: result.movers,
      series: result.series
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "فشل جلب البيانات" },
      { status: 500 }
    );
  }
}
