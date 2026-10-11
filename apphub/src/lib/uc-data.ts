/**
 * رادار شدات ببجي (UC) — داتا مُراجعة يدويًا بتاريخ معلن.
 * القاعدة: ممنوع رقم بلا مصدر — الرسمي من Midasbuy (الشريك الرسمي لببجي)،
 * ومتوسط السوق موسوم صراحة «استرشادي». الأسعار لحظية التغيّر — بنحدّث التاريخ مع كل مراجعة.
 */

export const UC_REVIEW_DATE = "2026-09-21";
export const UC_REVIEW_DATE_AR = "سبتمبر ٢٠٢٦";

export type UcPack = {
  uc: number;        // الشدات الأساسية
  bonus: number;     // الهدية ضمن الباقة
  priceEgp: number;  // السعر الرسمي Midasbuy بالجنيه
};

/** جدول Midasbuy الرسمي (الشريك الرسمي لببجي) — مصر */
export const OFFICIAL_PACKS: UcPack[] = [
  { uc: 30, bonus: 0, priceEgp: 20.99 },
  { uc: 60, bonus: 0, priceEgp: 41.99 },
  { uc: 300, bonus: 25, priceEgp: 209.99 },
  { uc: 600, bonus: 60, priceEgp: 419.99 },
  { uc: 1500, bonus: 300, priceEgp: 1049.99 },
  { uc: 3000, bonus: 850, priceEgp: 2099.99 },
  { uc: 6000, bonus: 2100, priceEgp: 4199.99 },
  { uc: 12000, bonus: 4200, priceEgp: 8399.99 },
  { uc: 18000, bonus: 6300, priceEgp: 12599.99 },
  { uc: 24000, bonus: 0, priceEgp: 16799.99 }
];

/** متوسطات سوق استرشادية (رصد يدوي — مش عرض بيع)، بالجنيه للباقات الشهيرة */
export const MARKET_AVERAGE: Record<string, { ucTotal: number; avgEgp: number }> = {
  p60: { ucTotal: 60, avgEgp: 55 },
  p325: { ucTotal: 325, avgEgp: 280 },
  p660: { ucTotal: 660, avgEgp: 540 },
  p1800: { ucTotal: 1800, avgEgp: 1380 },
  p8100: { ucTotal: 8100, avgEgp: 5500 }
};

/** قنوات موثوقة (بناءً على توفرها الرسمي في مصر) */
export const TRUSTED_CHANNELS = [
  {
    name: "Midasbuy",
    note: "الشريك الرسمي لببجي — أسعاره هي المرجع هنا",
    url: "https://www.midasbuy.com",
    official: true
  },
  {
    name: "Codashop مصر",
    note: "شحن رسمي بوسائل دفع محلية",
    url: "https://www.codashop.com/ar-eg",
    official: false
  },
  {
    name: "Carry1st Shop",
    note: "موزّع رسمي في أفريقيا والشرق الأوسط",
    url: "https://carry1st.com",
    official: false
  },
  {
    name: "UniPin مصر",
    note: "شحن ألعاب معروف إقليميًا",
    url: "https://www.unipin.com/eg",
    official: false
  }
];

export const packTotal = (p: UcPack) => p.uc + p.bonus;

/** سعر الوحدة: جنيه لكل 100 UC — وحدة المقارنة الذكية بين الباقات */
export const pricePer100 = (p: UcPack) => (p.priceEgp / packTotal(p)) * 100;

export function bestValuePackIndex(): number {
  let best = 0;
  OFFICIAL_PACKS.forEach((p, i) => {
    if (pricePer100(p) < pricePer100(OFFICIAL_PACKS[best])) best = i;
  });
  return best;
}

export type UcComboResult = {
  target: number;
  totalUc: number;
  totalPrice: number;
  items: { pack: UcPack; count: number }[];
  exact: boolean;
};

/**
 * أرخص تشكيلة رسمية توصّلك على الأقل للهدف — DP على المبالغ.
 * الهدف المتقبّل: 1..30000 UC — فوق كده نرفض بلطف.
 */
export function cheaperCombo(target: number): UcComboResult | null {
  if (!Number.isFinite(target) || target <= 0 || target > 30000) return null;
  const t = Math.ceil(target);
  // DP[a] = أرخص تكلفة توصّل a UC بالظبط (a حتى t..t+آخر باقة)
  const maxPack = Math.max(...OFFICIAL_PACKS.map(packTotal));
  const N = t + maxPack;
  const dp: number[] = new Array(N + 1).fill(Infinity);
  const from: { a: number; pi: number }[] = new Array(N + 1);
  dp[0] = 0;
  for (let a = 0; a <= N; a++) {
    if (!Number.isFinite(dp[a])) continue;
    OFFICIAL_PACKS.forEach((p, pi) => {
      const na = a + packTotal(p);
      const nc = dp[a] + p.priceEgp;
      if (na <= N && nc < dp[na] - 1e-9) {
        dp[na] = nc;
        from[na] = { a, pi };
      }
    });
  }
  // أرخص a >= t
  let bestA = -1;
  for (let a = t; a <= N; a++) {
    if (Number.isFinite(dp[a]) && (bestA === -1 || dp[a] < dp[bestA])) bestA = a;
  }
  if (bestA === -1) return null;

  // فك المسار
  const counts = new Map<number, number>();
  let a = bestA;
  while (a > 0 && from[a]) {
    const pi = from[a].pi;
    counts.set(pi, (counts.get(pi) ?? 0) + 1);
    a = from[a].a;
  }
  const items = [...counts.entries()]
    .sort((x, y) => packTotal(OFFICIAL_PACKS[y[0]]) - packTotal(OFFICIAL_PACKS[x[0]]))
    .map(([pi, count]) => ({ pack: OFFICIAL_PACKS[pi], count }));

  return {
    target: t,
    totalUc: bestA,
    totalPrice: Math.round(dp[bestA] * 100) / 100,
    items,
    exact: bestA === t
  };
}
