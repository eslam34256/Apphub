import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { PressQuoteCard } from "@/components/press-quote-card";

export const metadata: Metadata = buildMeta({
  title: "مركز الصحافة — بيانات واقتباسات جاهزة عن أسعار الاقتصاد الرقمي",
  description:
    "Press Kit AppHub: من إحنا كمصدر بيانات، أرقام جاهزة للاقتباس، عينة تقرير CSV قابلة للتحميل، وقنوات البيانات المفتوحة مع الإشارة — للصحافة والباحثين في أسعار الاقتصاد الرقمي بالمنطقة.",
  url: "https://apphub.eg/press",
  keywords: ["press kit", "مركز صحافة", "بيانات أسعار", "مؤشر أسعار الاشتراكات"]
});

const FACTS = [
  { icon: "📈", num: "مؤشر واحد", label: "أول مؤشر أسعار اشتراكات عربي — أساسه ١٠٠ منذ مايو ٢٠٢٥", href: "/price-index" },
  { icon: "📡", num: "٤ رادارات", label: "اشتراكات · شدات UC · باقات الإنترنت · اشتراكات AI — بمقياس وحدة واحد صادق لكل", href: "/price-radar" },
  { icon: "🎮", num: "10 باقات UC", label: "أسعار Midasbuy الرسمية بالجنيه بسعر الوحدة (ج/١٠٠ شدة)", href: "/uc-radar" },
  { icon: "📶", num: "22 باقة إنترنت", label: "فودافون/أورنج/WE بسعر الجيجا (أرخصها هوائي ٤٠٠: ٣٫١٨ ج)", href: "/telecom-radar" },
  { icon: "🤖", num: "٧ أدوات AI", label: "أسعار بالدولار + تحويل جنيه بسعر صرف حقيقي لايف", href: "/ai-radar" },
  { icon: "🗓️", num: "٧ سنين تاريخ", label: "سلسلة أسعار متصلة لأشهر الاشتراكات في مصر والخليج", href: "/methodology" }
];

const QUOTES = [
  {
    quote: "باقة ٦٦٠ شدة ببجي رسميًا بتكلف ٤١٩٫٩٩ جنيه من Midasbuy الشريك الرسمي — يعني ٦٣٫٦٤ جنيه لكل ١٠٠ شدة، أرخص من متوسط السوق الموازي بحوالي ٢٢٪ على نفس الباقة.",
    source: "رادار شدات AppHub — سبتمبر ٢٠٢٦"
  },
  {
    quote: "أرخص جيجابايت هوائي في مصر حاليًا بتتحاسب بـ ٣٫١٨ جنيه للجيجا في باقة فودافون ٤٠٠ جيجا — بينما نفس الخدمة في أصغر الباقات تصل لـ ٧٫٢٥ جنيه، فارق يفوق الضعفين على نفس الكلمة: «إنترنت».",
    source: "رادار الباقات AppHub — سبتمبر ٢٠٢٦"
  },
  {
    quote: "أرخص اشتراك AI مدفوع رسمي في ٢٠٢٦ هو Google AI Plus بـ ٤٫٩٩ دولار شهريًا، بينما يقف المعيار السوقي عند ٢٠ دولار لدى ChatGPT Plus وClaude Pro وGemini AI Pro بالتطابق التقريبي.",
    source: "رادار اشتراكات AI AppHub — مراجعة سبتمبر ٢٠٢٦"
  },
  {
    quote: "مؤشر AppHub للأسعار مبني على ١٦ خطة مرصودة بتاريخها منذ مايو ٢٠٢٥، وما بينشرش رقمًا قبل أول حركة سعر مؤكدة — لأن أصلنا هو الثقة في الرقم، مش ضجيجه.",
    source: "منهجية مؤشر AppHub للأسعار"
  }
];

const APIS = [
  { name: "مؤشر الأسعار", url: "/api/price-index", desc: "قيمة المؤشر + السلسلة الشهرية + أكبر التحركات" },
  { name: "رادار الشدات", url: "/api/uc-radar", desc: "١٠ باقات رسمية بسعر الوحدة + قنوات موثوقة" },
  { name: "رادار الباقات", url: "/api/telecom-radar", desc: "٢٢ باقة بج/جيجا عبر ٣ شبكات" },
  { name: "اشتراكات AI", url: "/api/ai-radar", desc: "٧ أدوات بالدولار + تحويل جنيه لايف" }
];

export default function PressPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">📰</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">مركز الصحافة</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          كل اللي تحتاجه تكتب عن أسعار الاقتصاد الرقمي في مصر والمنطقة — أرقام موثقة بتاريخها،
          اقتباسات جاهزة، وبيانات مفتوحة بشرط الإشارة.
        </p>
      </div>

      {/* Fact sheet */}
      <section className="space-y-4">
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">🧾 الأرقام الجاهزة</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map((f) => (
            <Link key={f.num} href={f.href} className="rounded-2xl bg-white p-5 shadow-soft hover:shadow-elegant transition space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>{f.icon}</span>
                <span className="font-extrabold text-brand-900">{f.num}</span>
              </div>
              <p className="text-xs text-charcoal-500 leading-5">{f.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* عينة التقرير */}
      <section className="rounded-3xl border-2 border-accent-300 bg-accent-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
        <div className="text-5xl" aria-hidden>📄</div>
        <div className="flex-1 text-center sm:text-start space-y-1">
          <h2 className="heading-elegant text-2xl text-brand-900">عينة تقرير مجانية — حمّلها وجرّبها</h2>
          <p className="text-sm text-charcoal-600">
            ملف CSV من قلب مؤشر الأسعار: الملخص + أكبر التحركات + السلسلة الشهرية — نفس الداتا بصيغة
            تنفتح في Excel/Google Sheets مباشرة. مع الإشارة لـ AppHub عند النشر.
          </p>
        </div>
        <a
          href="/api/reports/index.csv"
          download
          className="shrink-0 rounded-full bg-brand-900 px-7 py-3 text-sm font-bold text-white hover:bg-brand-800 transition"
        >
          ⬇️ حمّل CSV
        </a>
        <Link
          href="/reports/q3-2026"
          className="shrink-0 rounded-full bg-accent-400 px-7 py-3 text-sm font-bold text-brand-900 hover:bg-accent-500 transition"
        >
          📊 تقرير Q3 2026
        </Link>
      </section>

      {/* اقتباسات جاهزة */}
      <section className="space-y-4">
        <div>
          <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">💬 اقتباسات جاهزة للنشر</h2>
          <p className="text-sm text-charcoal-500 mt-1">كوبي-باست مباشرة — منسوبة بالفعل لمصدرها وتاريخ مراجعتها.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {QUOTES.map((q, i) => (
            <PressQuoteCard key={i} quote={q.quote} source={q.source} />
          ))}
        </div>
      </section>

      {/* البيانات المفتوحة */}
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-4">
        <h2 className="heading-elegant text-2xl text-brand-900">📡 قنوات البيانات المفتوحة</h2>
        <p className="text-sm text-charcoal-500">
          كل رادار له API JSON عمومي — للصحافة والباحثين مجانًا مع الإشارة. للحجم التجاري: <Link href="/data" className="font-bold text-brand-700 underline">باقات API المميزة</Link>.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {APIS.map((a) => (
            <li key={a.url} className="rounded-2xl border border-cream-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-brand-900 text-sm">{a.name}</span>
                <code className="rounded bg-cream-50 px-2 py-0.5 text-[11px]" dir="ltr">{a.url}</code>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">{a.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* تواصل */}
      <section className="rounded-3xl gradient-brand p-8 text-white text-center space-y-3">
        <h2 className="heading-elegant text-2xl">📬 للتواصل الصحفي</h2>
        <p className="text-white/85 text-sm max-w-xl mx-auto">
          عايز رقم محدد، زاوية قصة، أو تعليق خبير على زيادة أسعار؟ ابعتلنا — الرد خلال يوم عمل.
        </p>
        <a
          href="mailto:press@apphub.eg?subject=استفسار صحفي — AppHub"
          className="inline-block rounded-full bg-accent-400 px-8 py-3 text-sm font-bold text-brand-900 hover:bg-accent-500 transition"
        >
          press@apphub.eg
        </a>
      </section>
    </div>
  );
}
