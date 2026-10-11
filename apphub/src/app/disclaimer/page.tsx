import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إخلاء المسؤولية — AppHub"
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-6xl mb-3">⚠️</div>
        <h1 className="text-4xl font-extrabold">إخلاء المسؤولية</h1>
      </div>

      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-soft space-y-6 text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">دقة المعلومات</h2>
          <p>
            نبذل قصارى جهدنا لتقديم معلومات دقيقة ومحدّثة، لكن لا نضمن أن جميع المعلومات
            دقيقة أو كاملة 100% في جميع الأوقات.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">الأسعار والعروض</h2>
          <p>
            الأسعار المعروضة تقديرية وقد تختلف عن الأسعار الفعلية. يُرجى التحقق من السعر
            النهائي على التطبيق الأصلي قبل الشراء.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">الروابط الخارجية</h2>
          <p>
            قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لا نتحمل مسؤولية محتوى أو سياسات
            هذه المواقع.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">المراجعات والآراء</h2>
          <p>
            المراجعات والتعليقات المنشورة هي آراء شخصية لأصحابها ولا تعبر بالضرورة عن رأي AppHub.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">الإعلانات</h2>
          <p>
            الإعلانات على المنصة لا تعني توصية من AppHub بالمنتج أو الخدمة. اتخاذ قرار الشراء
            مسؤوليتك الشخصية.
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-5 border border-amber-200">
          <p className="font-bold text-amber-900">
            💡 نصيحة: تحقق دائمًا من المعلومات من المصدر الأصلي قبل اتخاذ أي قرار مالي.
          </p>
        </div>
      </div>
    </div>
  );
}