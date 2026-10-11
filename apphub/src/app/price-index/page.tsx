import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { computePriceIndex, IndexPoint, PriceIndexResult } from "@/lib/price-index";
import { loadPlanSeries } from "@/lib/price-index-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMeta({
  title: "مؤشر AppHub للأسعار — نبض الاشتراكات في المنطقة",
  description:
    "مؤشر أسبوعي محسوب من رادار الأسعار: الخطط المرصودة غليت ولا رخصت وقد إيه؟ بيانات مفتوحة للاستخدام مع الإشارة — أول مؤشر أسعار اشتراكات عربي.",
  url: "https://apphub.eg/price-index",
  keywords: ["مؤشر الأسعار", "تضخم الاشتراكات", "أسعار الاشتراكات", "بيانات مفتوحة"]
});

function Sparkline({ series }: { series: IndexPoint[] }) {
  const W = 640, H = 190, PAD = 34;
  const vals = series.map((s) => s.value);
  const min = Math.min(...vals, 100) - 1;
  const max = Math.max(...vals, 100) + 1;
  const span = Math.max(max - min, 0.1);
  const count = series.length;
  const x = (i: number) => PAD + 4 + (i * (W - 2 * (PAD + 4))) / Math.max(count - 1, 1);
  const y = (v: number) => H - PAD - ((v - min) / span) * (H - 2 * PAD);
  const pts = series.map((s, i) => `${x(i)},${y(s.value)}`).join(" ");
  const baselineY = y(100);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="رسم بياني للمؤشر عبر الزمن">
      <line x1={PAD} x2={W - PAD} y1={baselineY} y2={baselineY} stroke="#c9a227" strokeDasharray="5 5" strokeWidth="1.5" />
      <text x={PAD - 6} y={baselineY + 5} textAnchor="end" fontSize="12" fill="#8fa2bd">100</text>
      <polyline points={pts} fill="none" stroke="#0f1b2d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {series.map((s, i) => (
        <circle key={s.date} cx={x(i)} cy={y(s.value)} r="4.5" fill="#c9a227" stroke="#0f1b2d" strokeWidth="2" />
      ))}
      <text x={x(0)} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">{series[0]?.date}</text>
      <text x={x(count - 1)} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">{series[count - 1]?.date}</text>
    </svg>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "up" | "down" }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft text-center">
      <p className={`heading-elegant text-3xl ${tone === "up" ? "text-red-600" : tone === "down" ? "text-sage-600" : "text-brand-900"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-charcoal-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-charcoal-400">{sub}</p>}
    </div>
  );
}

export default async function PriceIndexPage() {
  const { plans, source } = await loadPlanSeries();
  const result: PriceIndexResult | null = computePriceIndex(plans);

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-5xl mb-3">📈</div>
        <h1 className="text-4xl font-extrabold mb-2">مؤشر AppHub للأسعار</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          نبض أسعار الاشتراكات في المنطقة — رقم واحد يقول لك: الاشتراكات غليت ولا رخصت وقد إيه.
        </p>
      </div>

      {!result ? (
        <div className="rounded-3xl bg-white p-10 shadow-soft text-center space-y-3">
          <p className="text-2xl font-bold text-brand-900">المؤشر بيتجمع دلوقتي 🛰️</p>
          <p className="text-charcoal-500 max-w-xl mx-auto leading-relaxed">
            الرادار بدأ رصد فعلًا — والمؤشر ملتزم بقاعدة المشروع: ممنوع نعرض رقم مبني على أقل من حركة سعر مؤكدة واحدة.
            أول ما أول تغيير مؤكد يوصل، المؤشر هيطلع هنا لوحده.
          </p>
          <Link href="/price-radar" className="btn-primary inline-block mt-2">شوف رصد الرادار الحالي</Link>
        </div>
      ) : (
        <>
          {/* الرقم الكبير */}
          <div className="rounded-3xl bg-white p-8 shadow-soft text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-charcoal-500 mb-2">المؤشر الآن</p>
            <p className="heading-display text-7xl md:text-8xl text-brand-900">
              {result.current.toFixed(1)}
            </p>
            <p className={`mt-2 text-xl font-extrabold ${result.changePct >= 0 ? "text-red-600" : "text-sage-600"}`}>
              {result.changePct >= 0 ? "▲" : "▼"} {Math.abs(result.changePct)}% منذ {result.baseDate}
              <span className="text-charcoal-400 text-sm font-normal"> — يعني {result.changePct >= 0 ? "غليان" : "رخاص"} بهالمقدار في المتوسط</span>
            </p>
            <p className="mt-3 text-xs text-charcoal-400">
              مصدر البيانات: {source === "db" ? "رصد الرادار الحي (سجل الأسعار المؤكد)" : "الداتا الثابتة الموثّقة"} — محسوب {new Date(result.computedAt).toLocaleDateString("ar-EG")}
            </p>
          </div>

          {/* الأرقام */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="خطة مرصودة" value={String(result.plansCount)} sub="سعر متتبع بحتّة مؤكد" />
            <Stat label="غلي" value={String(result.upCount)} tone="up" sub="خطط زاد سعرها" />
            <Stat label="رخص" value={String(result.downCount)} tone="down" sub="خطط نزل سعرها" />
            <Stat label="ثابت" value={String(result.unchangedCount)} sub="من غير تغيير مؤكد" />
          </div>

          {/* الرسم */}
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-extrabold text-brand-900 mb-4">📊 مسار المؤشر</h2>
            <Sparkline series={result.series} />
            <p className="mt-2 text-xs text-charcoal-400 text-center">
              الخط المتقطع = نقطة البداية (100) · كل نقطة = نهاية شهر
            </p>
          </div>

          {/* التحركات */}
          {result.movers.length > 0 && (
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="font-extrabold text-brand-900 mb-4">🔥 أكبر التحركات المرصودة</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-cream-200 text-charcoal-500">
                      <th className="p-2">الخطة</th>
                      <th className="p-2">من</th>
                      <th className="p-2">لـ</th>
                      <th className="p-2">التغيير</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.movers.slice(0, 8).map((m) => (
                      <tr key={m.label} className="border-b border-cream-100">
                        <td className="p-2 font-bold text-brand-900">{m.label}</td>
                        <td className="p-2">{m.from} {m.currency === "EGP" ? "ج" : m.currency}</td>
                        <td className="p-2">{m.to} {m.currency === "EGP" ? "ج" : m.currency}</td>
                        <td className={`p-2 font-bold ${m.pct > 0 ? "text-red-600" : "text-sage-600"}`}>
                          {m.pct > 0 ? "+" : ""}{m.pct}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* كتلة الصحافة والبيانات المفتوحة */}
          <div className="rounded-3xl border border-accent-200 bg-accent-50 p-6 space-y-3">
            <h2 className="font-extrabold text-brand-900">🗞️ لصحافة والبيانات المفتوحة</h2>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              المؤشر بيتحدّث تلقائيًا من رادار AppHub وبياناته مفتوحة للاستخدام مع الإشارة.
              جاهز كـ JSON برمجيًا: <Link href="/api/price-index" className="text-brand-600 font-bold hover:underline" target="_blank">/api/price-index</Link>
            </p>
            <blockquote className="rounded-xl bg-white p-4 text-sm text-charcoal-700 border-r-4 border-accent-400">
              «وفق مؤشر AppHub لأسعار الاشتراكات، اتغيّر متوسط أسعار الخطط المرصودة
              {result.changePct >= 0 ? " بالزيادة" : " بالخفض"} بنسبة {Math.abs(result.changePct)}%
              منذ {result.baseDate}، من إجمالي {result.plansCount} خطة مرصودة في مصر والخليج.»
              <span className="block mt-2 text-xs text-charcoal-400">— اقتباس جاهز للنشر مع ذكر المصدر ورابط المؤشر</span>
            </blockquote>
          </div>

          {/* المنهجية */}
          <div className="rounded-3xl bg-white p-6 shadow-soft space-y-3">
            <h2 className="font-extrabold text-brand-900">🧭 إزاي بنحسبه؟ (باختصار)</h2>
            <ul className="space-y-2 mr-5 list-disc text-sm text-charcoal-700 leading-relaxed">
              <li>كل خطة ليها سعر أساس (أول سعر مرصود) وسعر حالي (آخر سعر مؤكد — مش أي قراءة).</li>
              <li>المؤشر = 100 + متوسط نسب تغيير الخطط المرصودة بأوزان متساوية.</li>
              <li>نستخدم التغييرات المؤكدة بس — نفس قواعد أمان الرادار (نطاق العقلانية 30%—300% + مراجعة يدوية).</li>
              <li>خطط لم يتغير سعرها مساهمتها 0% — ومحدش بيختلق تاريخ.</li>
            </ul>
            <Link href="/methodology" className="inline-block text-sm font-bold text-brand-600 hover:underline">
              التفاصيل الكاملة في صفحة المنهجية ←
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
