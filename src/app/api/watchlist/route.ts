import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COUNTRIES = new Set(["EG", "SA", "AE"]);

/**
 * الاشتراك في تنبيه نزول السعر.
 * POST  {email, appSlug, country?, targetPrice?} → upsert هادئ
 * DELETE {id} → تعطيل (معرف الـ UUID بيشتغل كرمز ملكية — بييجي في لينك الإيميل)
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`post:watchlist:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: "محاولات كتير متتالية — جرّب بعد دقيقة" }, { status: 429 });
  }
  try {
    const b = await req.json();
    const email = String(b.email ?? "").trim().toLowerCase();
    const appSlug = String(b.appSlug ?? "").trim().slice(0, 80);
    const country = COUNTRIES.has(b.country) ? b.country : "EG";
    const targetPrice = b.targetPrice != null ? Number(b.targetPrice) : null;

    if (!EMAIL_RE.test(email) || !appSlug) {
      return NextResponse.json({ ok: false, error: "بيانات ناقصة أو غير صحيحة" }, { status: 400 });
    }
    if (targetPrice != null && (!Number.isFinite(targetPrice) || targetPrice <= 0)) {
      return NextResponse.json({ ok: false, error: "السعر المستهدف غير صحيح" }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("price_watchlist")
      .upsert(
        { email, app_slug: appSlug, country, target_price: targetPrice, active: true },
        { onConflict: "email,app_slug,country" }
      );

    if (error) {
      return NextResponse.json(
        { ok: false, error: "التنبيهات بتتجهز — قاعدة البيانات لسه بتتفعّل" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const b = await req.json();
    const id = String(b.id ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ ok: false, error: "رابط إلغاء غير صالح" }, { status: 400 });
    }
    const supabase = createClient();
    await supabase.from("price_watchlist").update({ active: false }).eq("id", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
