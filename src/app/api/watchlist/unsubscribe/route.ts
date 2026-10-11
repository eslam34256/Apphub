import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

/**
 * v42 — إلغاء تنبيه السعر برابط GET حقيقي من الإيميل.
 * ?id=<uuid>&token=<hmac32>
 * - توكن غلط/ناقص → 403/400 (مفيش تسريب وجود السجل)
 * - سجل مش موجود أو ملغي قبل كده → 200 idempotent («مش مشترك»)
 * - مفيش أسرار في البيئة → 503 موثق بدل ما نلغي بدون تحقق
 */
const html = (msg: string, ok: boolean) =>
  new NextResponse(
    `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AppHub — تنبيهات الأسعار</title><body style="font-family:system-ui;display:grid;place-items:center;min-height:90vh;background:#faf8f5;color:#1a2942"><main style="text-align:center;padding:2rem"><div style="font-size:3rem">${ok ? "✅" : "⚠️"}</div><h1 style="font-size:1.2rem">${msg}</h1><p style="color:#666">AppHub — تنبيهات الأسعار</p></main>`,
    { status: ok ? 200 : 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const token = req.nextUrl.searchParams.get("token") ?? "";

  if (!/^[0-9a-f-]{36}$/i.test(id)) return html("رابط الإلغاء غير صالح.", false);
  if (!token) return html("الرابط ناقص — استخدم الرابط الكامل من الإيميل.", false);
  if (!verifyUnsubscribeToken(id, token)) return html("الرابط منتهي أو غير صحيح — كلمنا من صفحة التواصل.", false);

  try {
    const supabase = createClient();
    const { error } = await supabase.from("price_watchlist").update({ active: false }).eq("id", id);
    if (error) {
      return new NextResponse("قاعدة البيانات مش متاحة حاليًا — جرّب لاحقًا.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    return html("تم إلغاء تنبيه السعر بنجاح — مش هتوصلك إشعارات تانية.", true);
  } catch {
    return new NextResponse("خدمة الداتابيز مش متاحة حاليًا — جرّب لاحقًا.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
