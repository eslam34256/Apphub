import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const email = String(b.email ?? "").trim().toLowerCase();
    const interest = String(b.interest ?? "general").slice(0, 60);
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "البريد مش صحيح" }, { status: 400 });
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("waitlist")
      .upsert({ email, interest }, { onConflict: "email,interest" });
    if (error) {
      return NextResponse.json(
        { ok: false, error: "قائمة الانتظار لسه بتتجهز — جرب لاحقًا" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
