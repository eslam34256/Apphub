import { NextResponse } from "next/server";

// سعر الصرف الحقيقي — مصدر مجاني بلا مفتاح، كاش 6 ساعات (ممنوع نختلق أرقام)
export const revalidate = 21600; // 6 ساعات

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 21600 }
    });
    if (!res.ok) throw new Error("fx fetch failed");
    const j = await res.json();
    const usd = {
      EGP: j?.rates?.EGP ?? null,
      SAR: j?.rates?.SAR ?? null,
      AED: j?.rates?.AED ?? null
    };
    if (!usd.EGP && !usd.SAR && !usd.AED) throw new Error("no rates");
    return NextResponse.json({
      usd,
      source: "ExchangeRate-API",
      updatedAt: j?.time_last_update_utc ?? null
    });
  } catch {
    return NextResponse.json({ usd: null, source: null }, { status: 502 });
  }
}
