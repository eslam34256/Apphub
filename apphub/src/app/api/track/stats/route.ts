import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * v38 — لوحة أرقام التجارة لصاحب المشروع فقط:
 * GET /api/track/stats?days=30  (هيدر Authorization: Bearer <CRON_SECRET>)
 * بيرجع عدّاد الكليكات مجمّعة حسب الهدف — عشان تعرف أي رابط بيجيب فلوس.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  }
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "envs ناقصة" }, { status: 503 });

  const days = Math.min(parseInt(req.nextUrl.searchParams.get("days") ?? "30", 10) || 30, 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [events, clicks] = await Promise.all([
    admin
      .from("commerce_events")
      .select("event, target")
      .gte("created_at", since)
      .limit(5000),
    admin
      .from("affiliate_clicks")
      .select("app_slug")
      .gte("created_at", since)
      .limit(5000)
  ]);

  const count = (rows: { key: string }[] | null) => {
    const m: Record<string, number> = {};
    for (const r of rows ?? []) m[r.key] = (m[r.key] ?? 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };

  return NextResponse.json({
    ok: true,
    days,
    commerce_events: count((events.data ?? []).map(r => ({ key: `${r.event} → ${r.target}` }))),
    affiliate_clicks: count((clicks.data ?? []).map(r => ({ key: r.app_slug })))
  });
}
