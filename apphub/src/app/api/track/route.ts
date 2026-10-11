import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

// تسجيل أحداث تجارة — best-effort: مابيفشلش أبدًا وشكل المستخدم
const EVENTS = new Set(["click", "impression", "waitlist", "order"]);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`post:track:${ip}`, 30, 60_000)) {
    return NextResponse.json({ ok: false, error: "محاولات كتير متتالية — جرّب بعد دقيقة" }, { status: 429 });
  }
  try {
    const b = await req.json();
    const event = String(b.event ?? "");
    const target = String(b.target ?? "").slice(0, 120);
    if (!EVENTS.has(event) || !target) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const supabase = createClient();
    await supabase.from("commerce_events").insert({
      event,
      target,
      meta: b.meta ?? null
    });
    return NextResponse.json({ ok: true });
  } catch {
    // أخطاء التتبع متوقعش تكسر حاجة
    return NextResponse.json({ ok: true });
  }
}
