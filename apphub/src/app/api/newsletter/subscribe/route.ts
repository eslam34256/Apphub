import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

/**
 * v42 (Master Audit P1): تسجيل النشرة بقى server-side —
 * validation + rate limiting هنا، والكلاينت مبيعتمدش على نفسه.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`post:newsletter:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: "محاولات كتير متتالية — جرّب بعد دقيقة" }, { status: 429 });
  }
  try {
    const b = await req.json();
    const email = String(b.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "اكتب بريد إلكتروني صحيح" }, { status: 400 });
    }
    const supabase = createClient();
    const { error } = await supabase.from("newsletter").insert({ email });
    if (error) {
      if (error.code === "23505") return NextResponse.json({ ok: true, already: true });
      return NextResponse.json({ ok: false, error: "النشرة لسه بتتجهز — جرّب لاحقًا" }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
