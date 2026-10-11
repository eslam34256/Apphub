import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSafeDestination, ALLOWED_AFFILIATE_HOSTS } from "@/lib/affiliate";

/**
 * v44 — إدارة روابط الأفيليات (أدمن فقط):
 *   GET  → كل الروابط + عدّاد الكليكس
 *   POST → إنشاء { provider, appSlug, destination, countries, campaign, sourceUrl } (status=pending)
 *   PATCH → { id, status } تفعيل/إيقاف/رفض
 * كل الكتابة عبر service_role — مفيش أسرار على الكلاينت، والوجهات بتتفحص بالـ allowlist.
 */
export const dynamic = "force-dynamic";

async function assertAdmin() {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  if (!user) return null;
  const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (prof?.role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "الخدمة غير مهيأة", rows: [] }, { status: 503 });
  const { data } = await admin.from("affiliate_links").select("*").order("created_at", { ascending: false }).limit(100);
  const { data: clicks } = await admin.from("affiliate_clicks").select("app_slug").limit(1000);
  const clickCounts: Record<string, number> = {};
  (clicks ?? []).forEach((c: any) => { clickCounts[c.app_slug] = (clickCounts[c.app_slug] ?? 0) + 1; });
  return NextResponse.json({ ok: true, rows: data ?? [], clickCounts });
}

export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "الخدمة غير مهيأة" }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body || !body.provider || !body.destination) {
    return NextResponse.json({ ok: false, error: "provider و destination مطلوبين" }, { status: 400 });
  }
  if (!isSafeDestination(body.destination)) {
    return NextResponse.json({ ok: false, error: `الوجهة لازم تكون https ومن الدومينات المسموحة: ${ALLOWED_AFFILIATE_HOSTS.join(", ")}` }, { status: 400 });
  }
  const { data, error } = await admin.from("affiliate_links").insert({
    provider: String(body.provider).slice(0, 80),
    app_slug: body.appSlug ? String(body.appSlug).slice(0, 60) : null,
    destination: body.destination,
    status: "pending",
    countries: Array.isArray(body.countries) ? body.countries : [],
    campaign: body.campaign ? String(body.campaign).slice(0, 120) : null,
    source_url: body.sourceUrl ? String(body.sourceUrl).slice(0, 500) : null
  }).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  await admin.from("admin_logs").insert({ admin_id: user.id, action: "affiliate:create", entity_type: "affiliate_link", entity_id: data.id, details: { provider: data.provider } });
  return NextResponse.json({ ok: true, row: data });
}

export async function PATCH(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "الخدمة غير مهيأة" }, { status: 503 });
  const body = await req.json().catch(() => null);
  const valid = ["pending", "active", "paused", "rejected"];
  if (!body || !body.id || !valid.includes(body.status)) {
    return NextResponse.json({ ok: false, error: "id و status صالح مطلوبين" }, { status: 400 });
  }
  const { data, error } = await admin.from("affiliate_links").update({
    status: body.status,
    verified_at: body.status === "active" ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString()
  }).eq("id", body.id).select().single();
  if (error || !data) return NextResponse.json({ ok: false, error: error?.message ?? "غير موجود" }, { status: 400 });
  await admin.from("admin_logs").insert({ admin_id: user.id, action: `affiliate:status:${body.status}`, entity_type: "affiliate_link", entity_id: body.id, details: {} });
  return NextResponse.json({ ok: true, row: data });
}
