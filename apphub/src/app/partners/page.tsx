import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { BrandUpdateForm } from "@/components/brand-update-form";

export const metadata: Metadata = buildMeta({
  title: "بوابة الشركاء — حدّث سعرك الرسمي في رادارات AppHub",
  description:
    "قناة التحديث الرسمي للشركات: أرسل تغيير الأسعار بدليل رسمي فنتحقق ونظهره في رادارات الأسعار والباقات والـ AI بشارة «من المصدر الرسمي» — مجانًا وبدون صفقات ترتيب.",
  url: "https://apphub.eg/partners",
  keywords: ["شركاء", "تحديث سعر رسمي", "علامة موثوقة"]
});

const VALUES = [
  { icon: "📡", title: "قناة رسمية للجمهور", text: "بدل ما خبر السعر يتسرّب مشوّه في المنتديات — قوله بنفسك على منصة الناس بتثق فيها، وبرابطك الرسمي." },
  { icon: "✅", title: "شارة «من المصدر الرسمي»", text: "بعد التحقق اليدوي، التحديث بيظهر موسومًا صريحًا — حضور أقوى من أي إعلان لأنه معلومة موثقة." },
  { icon: "📊", title: "ظهور في مؤشر الأسعار", text: "تغييرك الموثّق بينعكس في مؤشر الاقتصاد الرقمي — الصحافة بتراقبه، يعني خبرك بيوصل بالإطار الصح." },
  { icon: "🧾", title: "سجل تاريخي عام", text: "تاريخ زياداتك الصادق معلن — اللي بينزّل سعره أو بيثبّته للعميل بياخد فضل السجل الحسن ده" }
];

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">🤝</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">بوابة الشركاء</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          قناة التحديث الرسمي: ابعتلنا تغيير الأسعار بدليله الرسمي — نتحقق ونظهره
          في الرادارات بشارة «من المصدر الرسمي». مجانًا تمامًا.
        </p>
      </div>

      {/* القيمة للشركات */}
      <div className="grid gap-4 sm:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-2xl bg-white p-6 shadow-soft space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>{v.icon}</span>
              <h2 className="font-extrabold text-brand-900">{v.title}</h2>
            </div>
            <p className="text-sm text-charcoal-600 leading-6">{v.text}</p>
          </div>
        ))}
      </div>

      {/* الميثاق الصريح */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 space-y-2">
        <p className="font-bold">📜 العقد مع الشركات (نفس عقدنا مع الجمهور):</p>
        <ul className="space-y-1">
          <li>• الظهور الرسمي <strong>مجاني</strong> — مفيش «ظهور مميز بالفلوس». الإعلانات عندها خاناتها الموسومة في <Link href="/advertise" className="underline font-bold">صفحة الإعلان</Link>.</li>
          <li>• <strong>الترتيب مش للبيع</strong>: باقتك لو أغلى من المنافس هتفضل أغلى في جدولنا — قيمتك عندنا إن رقمك يكون موثّق وصريح، مش أجمل.</li>
          <li>• كل تحديث بيتتحقق يدويًا من الرابط الرسمي المرفق — التحديثات المجهولة المصدر بتترفض بهدوء.</li>
        </ul>
      </div>

      {/* الاستمارة */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-4">
        <div>
          <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">📨 قدّم تحديثك الرسمي</h2>
          <p className="text-sm text-charcoal-500 mt-1">
            لازم رابط إعلان رسمي (موقعك، صفحتك الموثقة، بيان صحفي) — الرد على بريدك خلال ٢٤-٤٨ ساعة.
          </p>
        </div>
        <BrandUpdateForm />
      </div>

      {/* للبيانات التجارية */}
      <div className="rounded-2xl bg-brand-50 p-5 text-sm text-charcoal-600 text-center">
        محتاج وصول API لداتا السوق بالكامل؟ <Link href="/data" className="font-bold underline">باقات الأبحاث المميزة</Link> ·
        للصحافة؟ <Link href="/press" className="font-bold underline">مركز الصحافة</Link>
      </div>
    </div>
  );
}
