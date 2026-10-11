import { NextRequest, NextResponse } from "next/server";
import { affiliateLinks, isSafeDestination } from "@/lib/affiliate";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * v44 — نقطة خروج الأفيليات الآمنة:
 * GET /api/affiliate/click/[id]?c=1
 * - الـ id: slug من السجلات الستاتيك أو uuid من جدول affiliate_links
 * - لا تحويل إلا لوجهة مسجلة ومعتمدة (allowlist + https) — صفر open redirect
 * - pending/paused/rejected → 410 صادق (مش 200 مضلل ولا تحويل)
 * - التسجيل (?c=1 بيبعتُه الكلاينت بس لو الموافقة فعّالة) في affiliate_clicks بدون بيانات شخصية
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const consented = req.nextUrl.searchParams.get("c") === "1";

  let destination: string | null = null;
  let status = "unknown";
  let key = id;

  const staticEntry = affiliateLinks[id];
  if (staticEntry) {
    destination = staticEntry.url;
    status = staticEntry.status;
  } else if (/^[0-9a-f-]{36}$/i.test(id)) {
    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ ok: false, error: "الخدمة غير مهيأة" }, { status: 503 });
    const { data } = await admin.from("affiliate_links").select("destination, status, app_slug").eq("id", id).single();
    if (data) {
      destination = data.destination;
      status = data.status;
      key = data.app_slug ?? id;
    }
  }

  if (!destination) return NextResponse.json({ ok: false, error: "رابط غير موجود" }, { status: 404 });
  if (status !== "active") return NextResponse.json({ ok: false, error: "هذا الرابط غير نشط حاليًا" }, { status: 410 });
  if (!isSafeDestination(destination)) return NextResponse.json({ ok: false, error: "وجهة غير مصرح بها" }, { status: 403 });

  if (consented) {
    try {
      const admin = createAdminClient();
      await admin?.from("affiliate_clicks").insert({ app_slug: key, ref: "affiliate-route" });
    } catch { /* التسجيل best-effort — مايوقفش التحويل */ }
  }

  return NextResponse.redirect(destination, 302);
}
