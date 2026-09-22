import Link from "next/link";
import {
  BUNDLES,
  NETWORK_LABELS,
  perGb,
  bestPerGb,
  type Bundle
} from "@/lib/telecom-data";
import { TelecomCalculator } from "@/components/telecom-calculator";

const fmt = (n: number) => n.toLocaleString("ar-EG");

function BundleRow({ b, best }: { b: Bundle; best: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-3 ${
        best ? "border-sage-300 bg-sage-50" : "border-cream-200 bg-white"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-brand-900">{b.name}</span>
          <span className="text-[11px] text-charcoal-400">{NETWORK_LABELS[b.network]}</span>
          {best && (
            <span className="rounded-full bg-sage-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
              ⭐ أرخص جيجا
            </span>
          )}
        </div>
        {b.extra && <p className="text-xs text-charcoal-500 mt-0.5">{b.extra}</p>}
        {b.sourceNote && <p className="text-[11px] text-charcoal-400">{b.sourceNote}</p>}
      </div>
      <div className="text-end shrink-0">
        <div className="font-extrabold text-brand-900">{fmt(b.priceEgp)} ج</div>
        <div className={`text-xs font-bold ${best ? "text-sage-700" : "text-charcoal-500"}`}>
          {perGb(b).toFixed(2)} ج/جيجا
        </div>
      </div>
    </div>
  );
}

/** محتوى رادار الباقات — بيشتغل كصفحة مستقلة وكتوب جوه مركز الرادارات */
export function TelecomRadarContent() {
  const bestAir = bestPerGb("air");
  const bestMixed = bestPerGb("mixed");
  const airBundles = [...BUNDLES.filter((b) => b.kind === "air")].sort((a, b) => perGb(a) - perGb(b));
  const mobileData = [...BUNDLES.filter((b) => b.kind === "mobile-data")].sort((a, b) => perGb(a) - perGb(b));
  const mixed = [...BUNDLES.filter((b) => b.kind === "mixed")].sort((a, b) => perGb(a) - perGb(b));

  return (
    <div className="space-y-10">
      {/* الرقم الكبير */}
      <div className="grid gap-4 md:grid-cols-3 text-center">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-sm text-charcoal-500 mb-1">أرخص جيجا هوائي</div>
          <div className="text-3xl font-extrabold text-brand-900">{perGb(bestAir).toFixed(2)} ج</div>
          <div className="text-xs text-charcoal-400 mt-1">{bestAir.name} — {fmt(bestAir.priceEgp)} ج</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-sm text-charcoal-500 mb-1">أرخص (نت + مكالمات)</div>
          <div className="text-3xl font-extrabold text-brand-900">{perGb(bestMixed).toFixed(2)} ج</div>
          <div className="text-xs text-charcoal-400 mt-1">{bestMixed.name}</div>
        </div>
        <div className="rounded-3xl border-2 border-accent-300 bg-accent-50 p-6 shadow-soft">
          <div className="text-sm text-accent-700 mb-1">الدرس</div>
          <div className="text-base font-extrabold text-brand-900">الأصغر باقة الأعلى سعرًا</div>
          <div className="text-xs text-charcoal-500 mt-1">فارق الجيجا بين الباقات يوصل ٤ أضعاف</div>
        </div>
      </div>

      {/* الهوائي */}
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-3">
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">🏠 الهوائي (مودم/راوتر) — مرتب بسعر الجيجا</h2>
        <p className="text-sm text-charcoal-500">للبيت والشغل الثقيل — مقارنة مباشرة عبر الشبكات الثلاث.</p>
        <div className="space-y-2">
          {airBundles.map((b) => (
            <BundleRow key={b.id} b={b} best={b.id === bestAir.id} />
          ))}
        </div>
      </section>

      {/* الحاسبة */}
      <TelecomCalculator />

      {/* نت الموبايل */}
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-3">
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">📱 باقات نت الموبايل</h2>
        <p className="text-sm text-charcoal-500">للتصفح اليومي من الموبايل — سوبر ميجابايت بتتخصم مضاعفة في الاستخدام العالي حسب شروط الشركة.</p>
        <div className="space-y-2">
          {mobileData.map((b) => (
            <BundleRow key={b.id} b={b} best={false} />
          ))}
        </div>
      </section>

      {/* المشتركة */}
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-3">
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">🎁 باقات مشتركة (نت + مكالمات)</h2>
        <p className="text-sm text-charcoal-500">
          سعر الجيجا هنا «لو استخدمت الباقة كلها نت» — لو هتكلم كتير فعلًا، الدقائق المضافة بترفع القيمة جدًا.
        </p>
        <div className="space-y-2">
          {mixed.map((b) => (
            <BundleRow key={b.id} b={b} best={b.id === bestMixed.id} />
          ))}
        </div>
      </section>

      {/* صدق الأرقام */}
      <div className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-6 sm:p-8 space-y-2">
        <h2 className="heading-elegant text-2xl text-amber-800">⚠️ ثلاث حقائق قبل ما تشترك</h2>
        <ul className="text-sm text-amber-900 space-y-2">
          <li>• <strong>الأسعار بتتغير مع كل زيادة</strong> — آخر موجة مايو ٢٠٢٦. تأكد من تطبيق شركتك قبل الاشتراك، والجدول ده مرجع للقيمة مش فاتورة.</li>
          <li>• <strong>الفليكس = ١ دقيقة لنفس الشبكة</strong> — لكن الشبكات التانية بـ ٢ فليكس؛ والنت بـ ١ (وسوبر فليكس بيضاعفها). إحنا حسبناها نت خالص صراحة.</li>
          <li>• <strong>عروض الولاء مش هنا</strong> — شركات الاتصالات بتدي ديسكونت شخصي في تطبيقها للخطوط القديمة؛ الأرقام دي هي القوائم المعلنة.</li>
        </ul>
        <p className="text-xs text-amber-700 pt-2">
          <Link href="/disclosure" className="font-bold underline">عقد الأرقام عندنا</Link> · نفس الداتا JSON: <code dir="ltr" className="rounded bg-white px-2 py-0.5">/api/telecom-radar</code>
        </p>
      </div>
    </div>
  );
}
