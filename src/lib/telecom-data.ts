/**
 * رادار الباقات 📶 — أسعار الإنترنت (والباقات المشتركة) في مصر.
 * أرقام منشورة من مصادر صحفية/رسمية (مايو–سبتمبر ٢٠٢٦) — الأسعار بنتغير
 * كتير مع الزيادات، فالقاعدة: مراجعة بتاريخ معلن + «تأكد من تطبيق شركتك قبل الاشتراك».
 * وحدة المقارنة: جنيه لكل جيجابايت (زي سعر اللتر في البنزين).
 */

export const TELECOM_REVIEW_DATE = "2026-09-21";
export const TELECOM_REVIEW_DATE_AR = "سبتمبر ٢٠٢٦";

export type Network = "vodafone" | "orange" | "we";

export const NETWORK_LABELS: Record<Network, string> = {
  vodafone: "فودافون",
  orange: "أورنج",
  we: "WE وي"
};

export type Bundle = {
  id: string;
  network: Network;
  name: string;
  /** هوائي (مودم/راوتر) أو باقة نت موبايل أو مشتركة (مكالمات + نت) */
  kind: "air" | "mobile-data" | "mixed";
  priceEgp: number;
  gb: number;
  /** قيمة مضافة معلنة (دقائق مثلًا) — بتظهر كملاحظة، مش بتدخل في سعر الجيجا */
  extra?: string;
  sourceNote?: string;
};

/** ج/جيجا — وحدة الرادار الصادقة */
export const perGb = (b: Bundle) => b.priceEgp / b.gb;

export const BUNDLES: Bundle[] = [
  // ─── الهوائي (مودم 4G/راوتر) — مصدر: مصراوي بعد زيادة مايو ٢٠٢٦ ───
  { id: "vf-air-90", network: "vodafone", name: "هوائي ٩٠ جيجا", kind: "air", priceEgp: 390, gb: 90 },
  { id: "vf-air-140", network: "vodafone", name: "هوائي ١٤٠ جيجا", kind: "air", priceEgp: 520, gb: 140 },
  { id: "vf-air-225", network: "vodafone", name: "هوائي ٢٢٥ جيجا", kind: "air", priceEgp: 750, gb: 225 },
  { id: "vf-air-400", network: "vodafone", name: "هوائي ٤٠٠ جيجا", kind: "air", priceEgp: 1270, gb: 400, extra: "أرخص جيجا في السوق حاليًا" },
  { id: "we-air-40", network: "we", name: "WE Air ٢٩٠", kind: "air", priceEgp: 290, gb: 40 },
  { id: "we-air-105", network: "we", name: "WE Air ٤٦٠", kind: "air", priceEgp: 460, gb: 105 },
  { id: "we-air-200", network: "we", name: "WE Air ٦٩٠", kind: "air", priceEgp: 690, gb: 200 },
  { id: "org-air-40", network: "orange", name: "هوائي أورنج ٤٠ جيجا", kind: "air", priceEgp: 290, gb: 40 },

  // ─── باقات نت الموبايل (سوبر ميجابايت) — مصدر: قوائم منشورة ديسمبر ٢٠٢٥ ───
  { id: "org-go-35", network: "orange", name: "Go Super ٣٥", kind: "mobile-data", priceEgp: 35, gb: 4500 / 1024, sourceNote: "٤٥٠٠ سوبر ميجابايت" },
  { id: "org-go-50", network: "orange", name: "Go Super ٥٠", kind: "mobile-data", priceEgp: 50, gb: 7000 / 1024, sourceNote: "٧٠٠٠ سوبر ميجابايت" },
  { id: "org-go-70", network: "orange", name: "Go Super ٧٠", kind: "mobile-data", priceEgp: 70, gb: 10500 / 1024, sourceNote: "١٠٥٠٠ سوبر ميجابايت" },
  { id: "org-go-120", network: "orange", name: "Go Super ١٢٠", kind: "mobile-data", priceEgp: 120, gb: 20000 / 1024, sourceNote: "٢٠٠٠٠ سوبر ميجابايت" },

  // ─── مشتركة (مكالمات + نت) — المكالمات قيمة مضافة مش بتتحسب في سعر الجيجا ───
  // فليكس فودافون — آخر قوائم منشورة بداية ٢٠٢٦ — ١ فليكس = ١ ميجا (لو استخدمته نت بس)
  { id: "vf-flex-30", network: "vodafone", name: "فليكس ٣٠", kind: "mixed", priceEgp: 40, gb: 1000 / 1024, extra: "١٠٠٠ فليكس: دقائق ورسائل وميجا", sourceNote: "١ فليكس = ١ ميجا قبل سوبر فليكس" },
  { id: "vf-flex-45", network: "vodafone", name: "فليكس ٤٥", kind: "mixed", priceEgp: 60, gb: 2000 / 1024, extra: "٢٠٠٠ فليكس: تكفي نت↔مكالمات", sourceNote: "١ فليكس = ١ ميجا قبل سوبر فليكس" },
  { id: "vf-flex-70", network: "vodafone", name: "فليكس ٧٠", kind: "mixed", priceEgp: 90, gb: 3000 / 1024, extra: "٣٠٠٠ فليكس", sourceNote: "١ فليكس = ١ ميجا قبل سوبر فليكس" },
  { id: "vf-flex-100", network: "vodafone", name: "فليكس ١٠٠", kind: "mixed", priceEgp: 130, gb: 5500 / 1024, extra: "٥٥٠٠ فليكس", sourceNote: "١ فليكس = ١ ميجا قبل سوبر فليكس" },
  { id: "vf-flex-260", network: "vodafone", name: "فليكس ٢٦٠", kind: "mixed", priceEgp: 371.4, gb: 13000 / 1024, extra: "١٣٠٠٠ فليكس", sourceNote: "١ فليكس = ١ ميجا قبل سوبر فليكس" },
  // أورنج بريميوم — منشور ديسمبر ٢٠٢٥
  { id: "org-prem-250", network: "orange", name: "أورنج بريميوم ٢٥٠", kind: "mixed", priceEgp: 40, gb: 12, extra: "+٢٥٠٠ دقيقة لكل الشبكات" },
  { id: "org-prem-350", network: "orange", name: "أورنج بريميوم ٣٥٠", kind: "mixed", priceEgp: 80, gb: 16, extra: "+٣٥٠٠ دقيقة" },
  { id: "org-prem-500", network: "orange", name: "أورنج بريميوم ٥٠٠", kind: "mixed", priceEgp: 120, gb: 25, extra: "+٥٠٠٠ دقيقة" },
  { id: "org-prem-700", network: "orange", name: "أورنج بريميوم ٧٠٠", kind: "mixed", priceEgp: 200, gb: 40, extra: "+٧٠٠٠ دقيقة" },
  { id: "org-prem-1000", network: "orange", name: "أورنج بريميوم ١٠٠٠", kind: "mixed", priceEgp: 250, gb: 70, extra: "+١٠٠٠٠ دقيقة" }
];

export function bestPerGb(kind?: Bundle["kind"]): Bundle {
  const pool = kind ? BUNDLES.filter((b) => b.kind === kind) : BUNDLES;
  return pool.reduce((a, b) => (perGb(b) < perGb(a) ? b : a));
}

/** أرخص باقة من النوع المطلوب تغطّي استهلاك معين بالجيجا */
export function cheapestForUsage(usageGb: number, kind: Bundle["kind"] = "air"): Bundle | null {
  if (!Number.isFinite(usageGb) || usageGb <= 0) return null;
  const pool = BUNDLES.filter((b) => b.kind === kind && b.gb >= usageGb).sort((a, b) => a.priceEgp - b.priceEgp);
  return pool[0] ?? null;
}
