import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractPrice, isSanePrice, hasRealChange } from "@/lib/price-extract";
import { sendTelegramMessage, formatPriceAlert } from "@/lib/telegram";
import { apps } from "@/data/apps";
import { subcategoryOf } from "@/data/subcategories";
import { AppItem } from "@/lib/types";

/**
 * 🚨 محرك رادار الأسعار — فحص يومي عبر Vercel Cron.
 *
 * مبادئ الحذر (المصداقية قبل الأتمتة):
 * 1. المحرك لا يغيّر «أي» سعر إلا لو الريجيكس لقط رقم واحد بثقة.
 * 2. فحص المنطقية: السعر الجديد لازم يكون في نطاق 0.3x – 3x من القديم.
 *    أي حاجة مريبة → العنصر بيتحط `needs_review` بدل ما ينشر سعر غلط.
 * 3. التاريخ يتسجّل «فقط عند التغيّر» — الجدول يفضل نظيف ودقيق.
 * 4. 3 فشلات متتالية في الاستخراج → العنصر يتحول لمراجعة يدوية تلقائيًا.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FETCH_TIMEOUT_MS = 15000;
const MAX_FAILS_BEFORE_REVIEW = 3;

type WatchRow = {
  id: string;
  app_slug: string;
  plan_name: string;
  country: string;
  currency: string;
  current_price: number;
  source_url: string | null;
  price_regex: string | null;
  check_mode: "auto" | "manual";
  needs_review: boolean;
  fail_count: number;
};

export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: watches, error: loadError } = await supabaseAdmin
    .from("price_watch")
    .select("*")
    .eq("is_active", true)
    .eq("check_mode", "auto")
    .eq("needs_review", false);

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 });
  }

  const summary = {
    checked: 0,
    changed: [] as string[],
    flagged: [] as string[],
    failed: [] as string[],
    telegramSent: 0,
    telegramSkipped: false,
    telegramErrors: [] as string[]
  };

  for (const w of (watches ?? []) as WatchRow[]) {
    const label = `${w.app_slug}/${w.plan_name} (${w.country})`;
    try {
      if (!w.source_url || !w.price_regex) {
        await markFailure(supabaseAdmin, w, label, summary);
        continue;
      }

      // جلب الصفحة الرسمية بمهلة محددة
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(w.source_url, {
        signal: controller.signal,
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; AppHubRadar/1.0; +https://apphub-eight.vercel.app/price-radar)",
          accept: "text/html,application/xhtml+xml"
        },
        cache: "no-store"
      });
      clearTimeout(timer);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const extracted = extractPrice(html, w.price_regex);

      if (extracted === null) throw new Error("price not found in page");

      summary.checked++;

      if (!hasRealChange(w.current_price, extracted)) {
        // مفيش تغيّر — حدّث وقت الفحص بس
        await supabaseAdmin
          .from("price_watch")
          .update({
            last_checked_at: new Date().toISOString(),
            fail_count: 0
          })
          .eq("id", w.id);
        continue;
      }

      if (!isSanePrice(w.current_price, extracted)) {
        // تغيّر مش منطقي — مش هننشره، للمراجعة
        await supabaseAdmin
          .from("price_watch")
          .update({ needs_review: true, fail_count: w.fail_count + 1 })
          .eq("id", w.id);
        summary.flagged.push(`${label}: ${w.current_price} ← ${extracted} (مش منطقي)`);
        continue;
      }

      // ✅ تغيّر حقيقي ومنطقي — طبّق وسجّل في التاريخ
      await supabaseAdmin
        .from("price_watch")
        .update({
          current_price: extracted,
          last_checked_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          fail_count: 0
        })
        .eq("id", w.id);

      await supabaseAdmin.from("price_history").insert({
        watch_id: w.id,
        price: extracted,
        source: "cron"
      });

      summary.changed.push(`${label}: ${w.current_price} ← ${extracted}`);

      // 📡 بث تيليجرام: لو القناة مش متفعلة أو فشلت — الكرون يكمّل عادي
      try {
        const alt = cheaperAlternative(w.app_slug, w.country, extracted);
        const hit = apps.find((a) => a.slug === w.app_slug);
        const sent = await sendTelegramMessage(
          formatPriceAlert({
            appSlug: w.app_slug,
            planName: w.plan_name,
            country: w.country,
            currency: w.currency,
            oldPrice: w.current_price,
            newPrice: extracted,
            appName: hit?.name ?? null,
            appIcon: hit?.icon ?? null,
            alternative: alt
              ? {
                  name: alt.app.name,
                  icon: alt.app.icon,
                  monthly: alt.monthly,
                  currency: alt.currency
                }
              : null
          })
        );
        if (sent.ok) summary.telegramSent++;
        else if (sent.skipped) summary.telegramSkipped = true;
        else summary.telegramErrors.push(`${label}: ${sent.error}`);
      } catch {
        // ممنوع يوقف الكرون بسبب القناة
      }
    } catch (err: any) {
      await markFailure(supabaseAdmin, w, `${label} — ${err.message}`, summary);
    }
  }

  return NextResponse.json({ success: true, ...summary });
}

async function markFailure(
  supabase: any, // SupabaseAdmin client — نفس نمط باقي مسارات الـ API في المشروع
  w: WatchRow,
  label: string,
  summary: { failed: string[] }
) {
  const fails = w.fail_count + 1;
  await supabase
    .from("price_watch")
    .update({
      fail_count: fails,
      last_checked_at: new Date().toISOString(),
      needs_review: fails >= MAX_FAILS_BEFORE_REVIEW
    })
    .eq("id", w.id);
  summary.failed.push(label);
}

/**
 * بديل أوفر «من نفس النوع» لرسالة التنبيه (القاعدة الذهبية من v5):
 * تطبيق بنفس الفئة الفرعية ونفس الدولة وسعره الشهري أقل من الجديد،
 * الأعلى تقييمًا أولًا — وبيرجع null لو مفيش (ممنوع اقتراح تخميني).
 */
function cheaperAlternative(
  appSlug: string,
  country: string,
  newPrice: number
): { app: AppItem; monthly: number; currency: string } | null {
  const target = apps.find((a) => a.slug === appSlug);
  if (!target) return null;
  const targetSub = subcategoryOf(target);

  const candidates = apps
    .map((app) => {
      const p = app.pricing.find(
        (x) => x.country === country && x.monthly !== undefined && (x.monthly as number) > 0
      );
      return p && p.monthly !== undefined
        ? { app, monthly: p.monthly, currency: p.currency }
        : null;
    })
    .filter(Boolean) as { app: AppItem; monthly: number; currency: string }[];

  return (
    candidates
      .filter(
        (c) =>
          c.app.slug !== appSlug &&
          subcategoryOf(c.app) === targetSub &&
          c.monthly < newPrice
      )
      .sort((x, y) => y.app.rating - x.app.rating || x.monthly - y.monthly)[0] ??
    null
  );
}
