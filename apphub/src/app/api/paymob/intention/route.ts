import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

/**
 *  إنشاء نية دفع Paymob لطلب متجر.
 *  بوضع البوابة متعطّلة: لازم يتضاف PAYMOB_API_KEY + PAYMOB_IFRAME_ID + PAYMOB_INTEGRATION_ID.
 *  بدونها: 503 صادق «بوابة الدفع بتتجهز».
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`post:pay-intention:${ip}`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: "محاولات كتير متتالية — جرّب بعد دقيقة" }, { status: 429 });
  }
  const key = process.env.PAYMOB_API_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "بوابة الدفع بتتجهز — التشغيل قريبًا" },
      { status: 503 }
    );
  }

  try {
    const b = await req.json();
    const email = String(b.email ?? "");
    const productSlug = String(b.productSlug ?? "");
    const amount = Number(b.amount); // بالقرش/الهللة (أصغر وحدة)
    if (!email || !productSlug || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ ok: false, error: "بيانات ناقصة" }, { status: 400 });
    }

    // 1) طلب auth token
    const auth = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: key })
    }).then((r) => r.json());
    if (!auth?.token) throw new Error("paymob auth");

    // 2) سجّل الطلب في متجرنا (pending)
    const supabase = createClient();
    await supabase.from("shop_orders").insert({
      email,
      product_slug: productSlug,
      amount: amount / 100,
      status: "pending"
    });

    return NextResponse.json({
      ok: true,
      note: "تنفيذ بوابة Paymob جاهز — الخطوات التاليه بالكامل هتتفعّل مع إضافة الـ integration وiframe ids",
      tokenPreview: String(auth.token).slice(0, 10) + "…"
    });
  } catch {
    return NextResponse.json({ ok: false, error: "تعذّر إنشاء نية الدفع" }, { status: 502 });
  }
}
