/**
 * رادار اشتراكات AI 🤖 — الأسعار الرسمية العالمية بالدولار (مراجعة موثّقة)،
 * وتحويلها للجنيه بسعر صرف **حقيقي لايف** (نفس مصدر /api/fx) — ولما المصدر غير متاح
 * نعرض الدولار بس بدون متوسط مُختلق.
 */

export const AI_REVIEW_DATE = "2026-09-21";
export const AI_REVIEW_DATE_AR = "سبتمبر ٢٠٢٦";

export type AiTier = {
  name: string;       // اسم الخطة
  usd: number;        // شهريًا بالدولار
  tag: string;        // سبب اختيارها
};

export type AiTool = {
  id: string;
  name: string;
  icon: string;
  color: string;      // لون علامة مميز في الجدول
  free: string;       // وصف الباقة المجانية
  tiers: AiTier[];
  bestFor: string;    // أقوى استخدام
};

/** أسعار رسمية منشورة — متقاطعة من ٥ مصادر (يونيو–سبتمبر ٢٠٢٦) */
export const AI_TOOLS: AiTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "🤖",
    color: "bg-emerald-50 text-emerald-800",
    free: "مجاني (بإعلانات في بعض المناطق)",
    tiers: [
      { name: "Go", usd: 8, tag: "أرخص دخول رسمي" },
      { name: "Plus", usd: 20, tag: "الأوسع استخدامًا — المرجع المعياري" },
      { name: "Pro", usd: 100, tag: "استخدام تقيل بلا حدود تقريبًا" },
      { name: "Pro+", usd: 200, tag: "أقصى الأولويات والموديلات" }
    ],
    bestFor: "الأداة الواحدة لكل حاجة: كتابة وصور وصوت ومنظومة إضافات"
  },
  {
    id: "claude",
    name: "Claude",
    icon: "🧠",
    color: "bg-orange-50 text-orange-800",
    free: "مجاني بحدود يومية",
    tiers: [
      { name: "Pro", usd: 20, tag: "نقطة الحلوة — أقوى قيمة عند $20" },
      { name: "Max 5x", usd: 100, tag: "خمس أضعاف الاستخدام" },
      { name: "Max 20x", usd: 200, tag: "عشرين ضعفًا + أولوية" }
    ],
    bestFor: "مستندات طويلة وبرمجة (يشمل Claude Code)"
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    icon: "✨",
    color: "bg-sky-50 text-sky-800",
    free: "مجاني سخي + اندماج جوجل",
    tiers: [
      { name: "AI Plus", usd: 4.99, tag: "أرخص اشتراك AI مدفوع في القايمة" },
      { name: "AI Pro", usd: 19.99, tag: "١ مليون توكن + سعة ٢ تيرا" },
      { name: "AI Ultra", usd: 99.99, tag: "أعلى الحدود وأولوية الوصول" }
    ],
    bestFor: "أهل Gmail وDocs: اندماج عميق في شغلك اليومي"
  },
  {
    id: "copilot",
    name: "Copilot (Microsoft)",
    icon: "🪟",
    color: "bg-blue-50 text-blue-800",
    free: "مجاني داخل ويندوز وBing",
    tiers: [
      { name: "Pro", usd: 20, tag: "أولوية GPT-5 داخل التطبيقات" },
      { name: "M365 Personal", usd: 19.99, tag: "أوفيس كامل + Copilot" }
    ],
    bestFor: "لو شغلك كله Word وExcel وOutlook"
  },
  {
    id: "grok",
    name: "Grok (xAI)",
    icon: "⚡",
    color: "bg-stone-100 text-stone-800",
    free: "محدود عبر X",
    tiers: [
      { name: "SuperGrok Lite", usd: 10, tag: "دخول اقتصادي" },
      { name: "SuperGrok", usd: 30, tag: "داتا X اللحظية كاملة" },
      { name: "Heavy", usd: 300, tag: "أقصى الاستخدام البحثي" }
    ],
    bestFor: "متابعة أخبار X لحظة بلحظة والنغمة الحرة"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: "🔎",
    color: "bg-teal-50 text-teal-800",
    free: "بحث مجاني يوميًا",
    tiers: [
      { name: "Pro", usd: 20, tag: "٣٠٠ بحث Pro يوميًا + Deep Research" }
    ],
    bestFor: "البحث بمصادر وإحالات — بديل جوجل الموجّه"
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: "🐳",
    color: "bg-indigo-50 text-indigo-800",
    free: "محادثة الويب مجانية بالكامل",
    tiers: [],
    bestFor: "أقوى خيار ببلاش نهائيًا — الدفع للـ API بس"
  }
];

/** جلب سعر الدولار حقيقي من نفس مصدر /api/fx (كاش ٦ ساعات في السيرفر) */
export async function fetchUsdEgpRate(): Promise<{ rate: number | null; source: string | null }> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 21600 }
    });
    if (!res.ok) throw new Error("fx failed");
    const j = await res.json();
    const rate = j?.rates?.EGP;
    if (typeof rate !== "number" || rate <= 0) throw new Error("bad rate");
    return { rate, source: "ExchangeRate-API" };
  } catch {
    return { rate: null, source: null };
  }
}

export const egp = (usd: number, rate: number | null) => (rate ? Math.round(usd * rate) : null);
