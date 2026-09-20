import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// حدود العقلانية لكل مقياس — نفس فلسفة الرادار (مفيش أرقام هبلة تدخل)
const BOUNDS: Record<string, [number, number]> = {
  delivery_fee: [0, 500],
  service_fee_pct: [0, 50],
  subscription_price: [0, 3000],
  streaming_price: [0, 3000],
  ride_km_price: [0, 200],
  bnpl_fee_pct: [0, 60]
};

const DOMAINS = new Set(["food", "rides", "streaming", "bnpl"]);

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();

    // مصيدة السبام — الحقل مخفي والبشر مبيملاوهوش
    if (b.website) return NextResponse.json({ ok: true });

    const domain = String(b.domain ?? "");
    const appId = String(b.appId ?? "").slice(0, 50).trim();
    const metric = String(b.metric ?? "");
    const value = Number(b.value);
    const city = typeof b.city === "string" ? b.city.slice(0, 60).trim() : null;
    const note = typeof b.note === "string" ? b.note.slice(0, 200).trim() : null;

    if (!DOMAINS.has(domain) || !appId || !BOUNDS[metric] || !Number.isFinite(value)) {
      return NextResponse.json({ ok: false, error: "بيانات غير مكتملة" }, { status: 400 });
    }
    const [min, max] = BOUNDS[metric];
    if (value < min || value > max) {
      return NextResponse.json(
        { ok: false, error: "القيمة خارج النطاق المنطقي" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("community_reports")
      .insert({ domain, app_id: appId, metric, value, city, note });

    if (error) {
      // غالبًا الجدول لسه متعملش — نقولها بصراحة
      return NextResponse.json(
        { ok: false, error: "خدمة البلاغات لسه بتتجهز — جرب بعدين" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
