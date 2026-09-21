import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * كرون يومي: يفحص المتابعات النشطة ويبعت إيميل لو السعر وصل أو اتجاوز الهدف.
 * - حماية: Authorization Bearer CRON_SECRET (Vercel Cron بيبعته أوتوماتيك لو الـ env موجود)
 * - الإرسال: مقفول على RESEND_API_KEY — بدونه يرجّع emailEnabled:false بصدق بدل ما يكذب
 *   إنه بعّت. كله بيتسجّل في email_events لو القاعدة متاحة.
 */

const FROM = "AppHub Radar <radar@apphub.eg>";

function admin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false } }
  );
}

function emailHtml(params: {
  appName: string;
  oldPrice: number | null;
  newPrice: number;
  currency: string;
  target: number | null;
  unsubscribeUrl: string;
}) {
  const { appName, oldPrice, newPrice, currency, target, unsubscribeUrl } = params;
  const rows = [
    oldPrice != null ? `<tr><td style="color:#666">كان</td><td>${oldPrice} ${currency}</td></tr>` : "",
    `<tr><td style="color:#666">بقى</td><td style="font-size:20px;font-weight:bold;color:#1a2942">${newPrice} ${currency}</td></tr>`,
    target != null ? `<tr><td style="color:#666">هدفك</td><td>${target} ${currency} ✅</td></tr>` : ""
  ].join("");
  return `
  <div dir="rtl" style="font-family:Tahoma,Arial;max-width:520px;margin:auto;background:#faf8f5;padding:24px;border-radius:16px">
    <h2 style="color:#1a2942;margin-top:0">📉 نزلة سعر — ${appName}</h2>
    <p style="color:#444">رادار AppHub لاحظ إن السعر وصل لمستوى هدفك:</p>
    <table style="width:100%;background:white;border-radius:12px;padding:16px;border-collapse:collapse">${rows}</table>
    <p style="margin-top:16px">
      <a href="https://apphub.eg/price-radar" style="background:#c9a876;color:#1a2942;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:bold">شوف الرادار كامل ↗</a>
    </p>
    <p style="font-size:12px;color:#999;margin-top:24px">
      وصلك الإيميل لأنك فعّلت تنبيه ${appName} على AppHub.
      <a href="${unsubscribeUrl}" style="color:#999">إلغاء التنبيه</a>
    </p>
  </div>`;
}

async function sendResend(apiKey: string, to: string, subject: string, html: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html })
  });
  return r.ok;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  const qSecret = req.nextUrl.searchParams.get("secret") ?? "";

  if (!secret || (auth !== `Bearer ${secret}` && qSecret !== secret)) {
    return NextResponse.json({ ok: false, error: "غير مصرّح" }, { status: 401 });
  }

  let matched = 0;
  const sent: string[] = [];
  const errors: string[] = [];

  try {
    const db = admin();

    const { data: watches, error } = await db
      .from("price_watchlist")
      .select("id, email, app_slug, country, target_price")
      .eq("active", true)
      .limit(500);

    if (error) throw new Error(error.message);
    if (!watches?.length) {
      return NextResponse.json({ ok: true, watches: 0, matched: 0, sent: 0, emailEnabled: !!process.env.RESEND_API_KEY });
    }

    // أسعار الرادار الحالية
    const slugs = [...new Set(watches.map((w) => w.app_slug))];
    const { data: prices } = await db
      .from("price_watch")
      .select("app_slug, country, current_price")
      .in("app_slug", slugs);

    const priceMap = new Map((prices ?? []).map((p) => [`${p.app_slug}|${p.country}`, p.current_price as number]));

    for (const w of watches) {
      const current = priceMap.get(`${w.app_slug}|${w.country}`) ?? priceMap.get(`${w.app_slug}|EG`);
      if (current == null) continue;
      const hit = w.target_price != null ? current <= Number(w.target_price) : false;
      if (!hit) continue;
      matched++;

      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          const ok = await sendResend(
            resendKey,
            w.email,
            `📉 نزلة سعر: ${w.app_slug}`,
            emailHtml({
              appName: w.app_slug,
              oldPrice: w.target_price,
              newPrice: current,
              currency: w.country === "EG" ? "جنيه" : w.country === "SA" ? "ريال" : "درهم",
              target: w.target_price,
              unsubscribeUrl: `https://apphub.eg/api/watchlist?id=${w.id}`
            })
          );
          if (ok) {
            sent.push(w.id);
            await db.from("price_watchlist").update({ last_notified_at: new Date().toISOString() }).eq("id", w.id);
          }
        } catch (e) {
          errors.push(String(e));
        }
      }

      // سجل الحدث مهما كانت حالة الإرسال (صدق العمليات)
      await db
        .from("email_events")
        .insert({
          kind: "price-drop",
          email: w.email,
          app_slug: w.app_slug,
          payload: { current, target: w.target_price, delivered: !!process.env.RESEND_API_KEY && !errors.length }
        })
        .then(() => {}, () => {});
    }

    return NextResponse.json({
      ok: true,
      watches: watches.length,
      matched,
      sent: sent.length,
      emailEnabled: !!process.env.RESEND_API_KEY,
      ...(errors.length ? { errors } : {})
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "الفحص اتعطّل", detail: e instanceof Error ? e.message : "" },
      { status: 503 }
    );
  }
}
