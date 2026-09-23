import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/.+\..+/i;

/**
 * تحديث سعر رسمي من شركة/علامة — يتسجّل pending للتحقق اليدوي.
 * بعد المراجعة بيظهر في الرادارات بشارة «من المصدر الرسمي» — الظهور مش للبيع (ميثاق الإفصاح)،
 * فيدل الشركات هو الوضوح الرسمي مش شراء الترتيب.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`post:brand-update:${ip}`, 3, 60_000)) {
    return NextResponse.json({ ok: false, error: "محاولات كتير متتالية — جرّب بعد دقيقة" }, { status: 429 });
  }
  try {
    const b = await req.json();
    const company = String(b.company ?? "").trim().slice(0, 120);
    const contactEmail = String(b.contactEmail ?? "").trim().toLowerCase();
    const planName = String(b.planName ?? "").trim().slice(0, 120);
    const oldPrice = b.oldPrice != null ? Number(b.oldPrice) : null;
    const newPrice = Number(b.newPrice);
    const currency = ["EGP", "SAR", "AED", "USD"].includes(b.currency) ? b.currency : "EGP";
    const evidenceUrl = String(b.evidenceUrl ?? "").trim().slice(0, 400);
    const note = String(b.note ?? "").trim().slice(0, 300) || null;

    if (!company || !EMAIL_RE.test(contactEmail) || !planName ||
        !Number.isFinite(newPrice) || newPrice <= 0 || !URL_RE.test(evidenceUrl)) {
      return NextResponse.json({ ok: false, error: "بيانات ناقصة أو غير صحيحة" }, { status: 400 });
    }
    if (oldPrice != null && (!Number.isFinite(oldPrice) || oldPrice <= 0)) {
      return NextResponse.json({ ok: false, error: "السعر القديم غير صحيح" }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase.from("brand_updates").insert({
      company,
      contact_email: contactEmail,
      plan_name: planName,
      old_price: oldPrice,
      new_price: newPrice,
      currency,
      evidence_url: evidenceUrl,
      note
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "بوابة الشركات بتتجهز — الترحيل لسه (migration 005)" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "وصل طلب التحديث — هنراجع المصدر الرسمي ونرد على بريدك خلال ٢٤-٤٨ ساعة"
    });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
