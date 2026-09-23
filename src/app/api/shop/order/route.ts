import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * طلب تنفيذ موثوق (حلقة الوصل): يتسجّل في shop_orders بحالة pending.
 * التنفيذ يدوي لحد بوابة الدفع — من غير وعد سعر نهائي ولا تحصيل.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`post:order:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: "محاولات كتير متتالية — جرّب بعد دقيقة" }, { status: 429 });
  }
  try {
    const b = await req.json();
    const email = String(b.email ?? "").trim().toLowerCase();
    const productSlug = String(b.productSlug ?? "").trim().slice(0, 80);
    const playerRef = String(b.playerRef ?? "").trim().slice(0, 80) || null;
    const notes = String(b.notes ?? "").trim().slice(0, 300) || null;

    if (!EMAIL_RE.test(email) || !productSlug) {
      return NextResponse.json({ ok: false, error: "البريد والمنتج مطلوبين" }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("shop_orders")
      .insert({
        email,
        product_slug: productSlug,
        player_ref: playerRef,
        notes,
        channel: "concierge",
        status: "pending"
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: "الطلبات بتتجهز — الترحيل لسه ما تمش (migration 003+005)" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: String(data.id).slice(0, 8),
      nextStep: "هنتواصل معاك على بريدك لتأكيد السعر الرسمي اللحظي والرسوم والدفع — قبل أي خصم."
    });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
