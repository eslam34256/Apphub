import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// تسجيل أحداث تجارة — best-effort: مابيفشلش أبدًا وشكل المستخدم
const EVENTS = new Set(["click", "impression", "waitlist", "order"]);

export async function POST(req: NextRequest) {
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
