/**
 * 📡 إرسال تنبيهات تيليجرام لقناة «رادار AppHub»
 *
 * التفعيل (خطوات يدوية لمرة واحدة — موثقة في docs/price-radar-automation.md):
 * 1. اعمل بوت من @BotFather → خد الـ TOKEN
 * 2. اعمل قناة عامة (مثلاً @AppHubRadar) وضيف البوت كـ مسؤول نشر
 * 3. متغيرات البيئة على Vercel:
 *    TELEGRAM_BOT_TOKEN=xxxxx            (سيرفر فقط)
 *    TELEGRAM_CHANNEL_ID=@AppHubRadar    (أو ID رقمي مثل -100xxxx)
 *    NEXT_PUBLIC_TELEGRAM_CHANNEL=AppHubRadar   (لعرض زر المتابعة)
 * لو المتغيرات مش موجودة → skipped بدون أي كسر (أساس مبدأ عدم الإسقاط).
 */

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app"
).replace(/\/$/, "");

const TELEGRAM_TIMEOUT_MS = 10000;

export type TelegramSendResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

export async function sendTelegramMessage(
  text: string
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) return { ok: false, skipped: true };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true
      }),
      cache: "no-store"
    });
    clearTimeout(timer);
    const data: any = await res.json().catch(() => ({}));
    return {
      ok: res.ok && data?.ok === true,
      error: data?.description ?? `HTTP ${res.status}`
    };
  } catch (err: any) {
    return { ok: false, error: err.message ?? "telegram fetch failed" };
  }
}

/* ─────────── Composer ─────────── */

const COUNTRY_NAMES: Record<string, string> = {
  EG: "مصر 🇪🇬",
  SA: "السعودية 🇸🇦",
  AE: "الإمارات 🇦🇪"
};

export type PriceAlertInput = {
  appSlug: string;
  planName: string;
  country: string;
  currency: string;
  oldPrice: number;
  newPrice: number;
  appName?: string | null;
  appIcon?: string | null;
  alternative?: {
    name: string;
    icon: string;
    monthly: number;
    currency: string;
  } | null;
};

/**
 * رسالة تغيّر سعر بتنسيق HTML آمن للـ RTL —
 * بنكتب الاتجاه بالكلمات («ارتفع من … لـ …») بدل الأسهم عشان الـ bidi.
 */
export function formatPriceAlert(m: PriceAlertInput): string {
  const up = m.newPrice > m.oldPrice;
  const pct =
    m.oldPrice > 0
      ? Math.abs(Math.round(((m.newPrice - m.oldPrice) / m.oldPrice) * 100))
      : 0;
  const country = COUNTRY_NAMES[m.country] ?? m.country;
  const name = m.appName ?? m.appSlug;
  const icon = m.appIcon ?? "📦";
  const plan = m.planName && m.planName !== "الأساسية" ? ` • ${m.planName}` : "";

  const lines = [
    `📡 <b>رادار AppHub — ${up ? "سعر زاد 📈" : "سعر نزل 📉"}</b>`,
    ``,
    `${icon} <b>${name}</b>${plan} • ${country}`,
    `${up ? "ارتفع" : "نزل"} من <s>${m.oldPrice} ${m.currency}</s> لـ <b>${m.newPrice} ${m.currency}</b> شهريًا${
      pct > 0 ? ` (${up ? "+" : "-"}${pct}%)` : ""
    }`
  ];

  if (alternativeIsCheaper(m.alternative, m.newPrice)) {
    const alt = m.alternative!;
    lines.push(
      ``,
      `💡 بديل أوفر من نفس النوع: ${alt.icon} ${alt.name} (${alt.monthly} ${alt.currency}/ش)`
    );
  }

  lines.push(``, `🔎 التفاصيل وتاريخ السعر: ${SITE_URL}/apps/${m.appSlug}`);
  return lines.join("\n");
}

function alternativeIsCheaper(
  alt: PriceAlertInput["alternative"],
  newPrice: number
): alt is NonNullable<PriceAlertInput["alternative"]> {
  return Boolean(alt && alt.monthly > 0 && alt.monthly < newPrice);
}
