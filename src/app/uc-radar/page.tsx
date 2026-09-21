import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import {
  OFFICIAL_PACKS,
  MARKET_AVERAGE,
  TRUSTED_CHANNELS,
  UC_REVIEW_DATE_AR,
  packTotal,
  pricePer100,
  bestValuePackIndex
} from "@/lib/uc-data";
import { UcCalculator } from "@/components/uc-calculator";

export const metadata: Metadata = buildMeta({
  title: "رادار شدات ببجي — سعر UC في مصر بالجنيه (رسمي vs سوق)",
  description:
    "جدول أسعار شدات ببجي UC في مصر من Midasbuy الرسمي + سعر الوحدة لكل باقة + حاسبة أرخص تشكيلة شحن — مراجعة بتاريخ معلن، مفيش أرقام مختلقة.",
  url: "https://apphub.eg/uc-radar",
  keywords: ["سعر شدات ببجي", "UC price Egypt", "شدات ببجي بالجنيه", "Midasbuy", "شحن UC"]
});

const fmt = (n: number) => n.toLocaleString("ar-EG");

export default function UcRadarPage() {
  const bestIdx = bestValuePackIndex();
  const p660 = OFFICIAL_PACKS.find((p) => p.uc === 600)!;
  const market660 = MARKET_AVERAGE.p660;
  const officialPer100 = pricePer100(p660);
  const marketPer100 = (market660.avgEgp / market660.ucTotal) * 100;
  const savePct = Math.round((1 - officialPer100 / marketPer100) * 100);

  return (
    <div className="mx-auto max-w-6xl space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">🎮</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">رادار شدات ببجي</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          سعر UC في مصر <strong>بسعر الوحدة</strong> (جنيه لكل 100 شدة) — عشان تعرف أي باقة أرخص فعلًا،
          وأي «عرض» في السوق بيوفّر فلوس ولا مجرد شكل.
        </p>
        <p className="mt-3 text-xs text-white/60">
          المراجعة: {UC_REVIEW_DATE_AR} · المصدر الرسمي: Midasbuy (الشريك الرسمي لببجي)
        </p>
      </div>

      {/* الرقم الكبير */}
      <div className="grid gap-4 md:grid-cols-3 text-center">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-sm text-charcoal-500 mb-1">باقة 660 UC رسمي</div>
          <div className="text-3xl font-extrabold text-brand-900">{fmt(p660.priceEgp)} ج</div>
          <div className="text-xs text-charcoal-400 mt-1">{officialPer100.toFixed(2)} ج / 100 UC</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-sm text-charcoal-500 mb-1">متوسط السوق (استرشادي)</div>
          <div className="text-3xl font-extrabold text-charcoal-700">{fmt(market660.avgEgp)} ج</div>
          <div className="text-xs text-charcoal-400 mt-1">{marketPer100.toFixed(2)} ج / 100 UC</div>
        </div>
        <div className="rounded-3xl border-2 border-sage-300 bg-sage-50 p-6 shadow-soft">
          <div className="text-sm text-sage-700 mb-1">التوفير من الرسمي</div>
          <div className="text-3xl font-extrabold text-sage-700">≈ {fmt(savePct)}%</div>
          <div className="text-xs text-sage-600 mt-1">على نفس الـ 660 شدة</div>
        </div>
      </div>

      {/* جدول سعر الوحدة */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft">
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900 mb-1">
          📊 جدول الأسعار الرسمية — مين أرخص وحدة؟
        </h2>
        <p className="text-sm text-charcoal-500 mb-5">
          الترتيب بالسعر لكل 100 UC — كل ما الرقم أقل، الباقة أحسن في قيمة الفلوس.
        </p>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b-2 border-cream-200 text-charcoal-500">
                <th className="py-3 text-start font-bold">الباقة</th>
                <th className="py-3 text-start font-bold">الإجمالي</th>
                <th className="py-3 text-start font-bold">السعر الرسمي</th>
                <th className="py-3 text-start font-bold">ج / 100 UC</th>
                <th className="py-3 text-start font-bold">تقييم القيمة</th>
              </tr>
            </thead>
            <tbody>
              {OFFICIAL_PACKS.map((p, i) => {
                const per = pricePer100(p);
                const isBest = i === bestIdx;
                return (
                  <tr
                    key={p.uc}
                    className={`border-b border-cream-100 ${isBest ? "bg-sage-50" : ""}`}
                  >
                    <td className="py-3 font-bold text-brand-900">
                      {fmt(p.uc)} UC
                      {p.bonus > 0 && (
                        <span className="text-sage-600 font-semibold"> +{fmt(p.bonus)} هدية</span>
                      )}
                    </td>
                    <td className="py-3 text-charcoal-600">{fmt(packTotal(p))}</td>
                    <td className="py-3 font-bold">{fmt(p.priceEgp)} ج</td>
                    <td className="py-3">
                      <span className={`font-extrabold ${isBest ? "text-sage-700" : "text-charcoal-700"}`}>
                        {per.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3">
                      {isBest ? (
                        <span className="rounded-full bg-sage-500 px-3 py-1 text-xs font-bold text-white">
                          ⭐ أحسن قيمة
                        </span>
                      ) : per < 70 ? (
                        <span className="text-xs text-sage-600 font-semibold">قيمة كويسة</span>
                      ) : (
                        <span className="text-xs text-charcoal-400">أعلى من المتوسط</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 rounded-xl bg-brand-50 p-3 text-xs text-charcoal-600 border-r-4 border-accent-400">
          💡 الدرس الجدول بيقوله: الباقات الصغيرة وحدة السعر فيها أغلى ~٢٠٪ من الكبيرة — الطالب اللي بيشحن 60 كل أسبوع
          بيدفع أزيد من اللي جمع وشحن باقة كبيرة في الإجمالي.
        </p>
      </div>

      {/* حاسبة الشدات */}
      <UcCalculator />

      {/* مقارنة السوق */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft">
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900 mb-1">⚖️ الرسمي vs متوسط السوق</h2>
        <p className="text-sm text-charcoal-500 mb-5">
          متوسط الأسعار المعروضة في السوق المصري (بائعين تالت طرف) — <strong>استرشادي مش عرض بيع</strong>،
          وبيشمل مكونين خطر معروفين: تأخير الشحن على حسابك بدل كود رسمي، أو مصادر غير موثقة.
        </p>
        <div className="space-y-3">
          {[
            { label: "60 UC", pack: OFFICIAL_PACKS[1], market: MARKET_AVERAGE.p60 },
            { label: "325 UC", pack: OFFICIAL_PACKS[2], market: MARKET_AVERAGE.p325 },
            { label: "660 UC", pack: p660, market: MARKET_AVERAGE.p660 },
            { label: "1800 UC", pack: OFFICIAL_PACKS[4], market: MARKET_AVERAGE.p1800 },
            { label: "8100 UC", pack: OFFICIAL_PACKS[6], market: MARKET_AVERAGE.p8100 }
          ].map(({ label, pack, market }) => {
            const off = pack.priceEgp;
            const mkt = market.avgEgp;
            const pctOff = Math.min(100, (off / Math.max(mkt, off)) * 100);
            const pctMkt = Math.min(100, (mkt / Math.max(mkt, off)) * 100);
            const cheaper = off < mkt;
            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm font-bold text-brand-900">
                  <span>{label}</span>
                  <span>
                    {cheaper
                      ? `الرسمي أرخص بـ ${fmt(Math.round(mkt - off))} ج`
                      : `السوق أرخص بـ ${fmt(Math.round(off - mkt))} ج`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-charcoal-500">رسمي {fmt(off)}ج</span>
                  <div className="flex-1 h-2.5 rounded-full bg-cream-100 overflow-hidden">
                    <div className="h-full rounded-full bg-accent-400" style={{ width: `${pctOff}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-charcoal-500">السوق {fmt(mkt)}ج</span>
                  <div className="flex-1 h-2.5 rounded-full bg-cream-100 overflow-hidden">
                    <div className="h-full rounded-full bg-charcoal-300" style={{ width: `${pctMkt}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* قنوات موثوقة + أمان */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft">
          <h2 className="heading-elegant text-2xl text-brand-900 mb-4">🛡️ قنوات شحن موثوقة</h2>
          <ul className="space-y-3">
            {TRUSTED_CHANNELS.map((c) => (
              <li key={c.name} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg" aria-hidden>{c.official ? "✅" : "🟢"}</span>
                <div className="flex-1">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="nofollow noopener"
                    className="font-bold text-brand-700 hover:underline"
                  >
                    {c.name} ↗
                  </a>
                  <p className="text-xs text-charcoal-500">{c.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-6 sm:p-8">
          <h2 className="heading-elegant text-2xl text-red-800 mb-4">⚠️ حذار من دي</h2>
          <ul className="space-y-2 text-sm text-red-900">
            <li>• «سعر أقل من الرسمي بكتير» — الشدات الرسمية تكلفتها معروفة؛ الخصم الكبير غالبًا سرقة كروت أو تلاعب برد فأموال.</li>
            <li>• طلب الـ Player ID <strong>مع الباسورد</strong> — الشحن الرسمي يحتاج الـ ID بس.</li>
            <li>• صفحات تعمل شحن «عبر بنظام الرّد» تأخذ الفلوس وبعدين الببجي بيسحب الشدات لما تتسرّق المدفوعات.</li>
            <li>• مطالبة بـ OTP أو لقطة شاشة لحسابك — ده فتح لسرقة الحساب مش شحن.</li>
          </ul>
          <p className="mt-4 text-xs text-red-700">
            دليل كامل: <Link href="/disclosure" className="font-bold underline">فلسفة الأرقام عندنا</Link> ·
            <Link href="/apps" className="font-bold underline"> تطبيقات شحن وبطاقات ثانية 🔋</Link>
          </p>
        </div>
      </div>

      {/* بيانات مفتوحة */}
      <div className="rounded-2xl bg-brand-50 p-5 text-sm text-charcoal-600 text-center">
        📡 نفس الجدول متاح JSON للصحافة والباحثين:{" "}
        <code className="rounded bg-white px-2 py-0.5 text-xs" dir="ltr">/api/uc-radar</code>
        {" — "}بشرط الإشارة لـ AppHub كمصدر.
      </div>
    </div>
  );
}
