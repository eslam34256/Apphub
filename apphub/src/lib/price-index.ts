/**
 * 📈 مؤشر AppHub للأسعار — الحساب الصرف (من غير أي عرض)
 *
 * المنهجية (معلنة على /methodology):
 * - كل خطة ليها نقطة أساس = أول سعر مرصود ليها، وقيمتها الحالية = آخر سعر مؤكد
 * - نسبة تغيير الخطة = (الحالي - الأساس) / الأساس × 100
 * - المؤشر = 100 + متوسط حسابي بسيط لنسب التغيير عبر الخطط المرصودة (أوزان متساوية)
 * - السلسلة الشهرية: عند نهاية كل شهر، لكل خطة آخر سعر معروف حتى ذلك التاريخ
 * - خطط بسعر واحد (لم يتغير بعد) مساهمتها 0% — مش تجاهل ولا اختلاق
 * - مفيش أرقام مختلقة: المؤشر بيظهر فقط لو فيه خطة واحدة على الأقل بنقطتين
 */

export type RawPoint = { date: string; price: number };

export type PlanSeries = {
  appSlug: string;
  planName: string;
  country: string;
  currency: string;
  points: RawPoint[]; // غير مرتبة — بنرتبها جوه
};

export type IndexPoint = { date: string; value: number };

export type Mover = {
  label: string;
  from: number;
  to: number;
  pct: number;
  currency: string;
};

export type PriceIndexResult = {
  current: number; // قيمة المؤشر الآن (البداية = 100)
  changePct: number; // نسبة التغيير الكلية
  plansCount: number;
  changedPlans: number;
  upCount: number;
  downCount: number;
  unchangedCount: number;
  biggestMove: Mover | null;
  movers: Mover[];
  series: IndexPoint[];
  baseDate: string;
  computedAt: string;
};

function pctOf(from: number, to: number): number {
  if (!from || from <= 0) return 0;
  return ((to - from) / from) * 100;
}

export function computePriceIndex(plans: PlanSeries[]): PriceIndexResult | null {
  // ترتيب + تنقية
  const clean = plans
    .map((p) => ({
      ...p,
      points: [...p.points]
        .filter((pt) => Number.isFinite(pt.price) && pt.price > 0 && pt.date)
        .sort((a, b) => a.date.localeCompare(b.date))
    }))
    .filter((p) => p.points.length > 0);

  if (clean.length === 0) return null;

  // المؤشر مش بيطلع من غير خطة واحدة على الأقل شافت تغيير حقيقي (نقطتين+)
  const hasAnyChangeWitness = clean.some((p) => p.points.length >= 2);
  if (!hasAnyChangeWitness) return null;

  // نسبة تغيير كل خطة حتى تاريخ معين (آخر سعر معروف ≤ cutoff، وللا = أول سعر)
  function planPctAt(p: PlanSeries, cutoff: string): number {
    const base = p.points[0].price;
    let last = p.points[0].price;
    for (const pt of p.points) {
      if (pt.date <= cutoff) last = pt.price;
      else break;
    }
    return pctOf(base, last);
  }

  // الحالة الحالية
  const latestPcts = clean.map((p) => planPctAt(p, "9999-12-31"));
  const avgPct = latestPcts.reduce((a, b) => a + b, 0) / clean.length;
  const current = Math.round((100 + avgPct) * 10) / 10;
  const changePct = Math.round(avgPct * 10) / 10;

  let up = 0, down = 0, same = 0;
  for (const pct of latestPcts) {
    if (pct > 0.05) up++;
    else if (pct < -0.05) down++;
    else same++;
  }

  // أكبر حركة + قائمة كل التحركات (مرتبة تنازليًا حسب الحجم)
  let biggest: Mover | null = null;
  const movers: Mover[] = [];
  for (const p of clean) {
    if (p.points.length < 2) continue;
    const from = p.points[0];
    const to = p.points[p.points.length - 1];
    const pct = pctOf(from.price, to.price);
    if (Math.abs(pct) < 0.05) continue;
    const m: Mover = {
      label: `${p.appSlug} — ${p.planName} (${p.country})`,
      from: from.price,
      to: to.price,
      pct: Math.round(pct * 10) / 10,
      currency: p.currency
    };
    movers.push(m);
    if (!biggest || Math.abs(m.pct) > Math.abs(biggest.pct)) biggest = m;
  }
  movers.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));

  // السلسلة الشهرية — من أول تاريخ معروف حتى النهارده
  const baseDate = clean
    .map((p) => p.points[0].date)
    .sort((a, b) => a.localeCompare(b))[0];

  const boundaries = monthBoundaries(baseDate);
  const today = new Date().toISOString().slice(0, 10);
  const series: IndexPoint[] = boundaries.map((d) => {
    const pcts = clean.map((p) => planPctAt(p, d));
    const avg = pcts.reduce((a, b) => a + b, 0) / clean.length;
    return { date: d, value: Math.round((100 + avg) * 10) / 10 };
  });
  if (series[series.length - 1]?.date !== today) {
    series.push({ date: today, value: current });
  }

  return {
    current,
    changePct,
    plansCount: clean.length,
    changedPlans: up + down,
    upCount: up,
    downCount: down,
    unchangedCount: same,
    biggestMove: biggest,
    movers,
    series,
    baseDate,
    computedAt: new Date().toISOString()
  };
}

/** نهايات الشهور (YYYY-MM-آخر يوم) من أول شهر فيه داتا حتى الشهر الحالي */
function monthBoundaries(baseDate: string): string[] {
  const [y0, m0] = baseDate.split("-").map(Number);
  const now = new Date();
  const out: string[] = [];
  let y = y0, m = m0;
  while (y < now.getUTCFullYear() || (y === now.getUTCFullYear() && m <= now.getUTCMonth() + 1)) {
    const lastDay = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); // آخر يوم في الشهر
    out.push(lastDay);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return out;
}
