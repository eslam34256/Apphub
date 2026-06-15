import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الكوكيز — AppHub"
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-6xl mb-3">🍪</div>
        <h1 className="text-4xl font-extrabold">سياسة الكوكيز</h1>
      </div>

      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-soft space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">ما هي الكوكيز؟</h2>
          <p className="text-slate-600 leading-relaxed">
            الكوكيز ملفات صغيرة تُحفظ على جهازك عند زيارة المواقع. تساعدنا في تذكر
            تفضيلاتك وتحسين تجربتك على AppHub.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">أنواع الكوكيز التي نستخدمها</h2>
          <div className="space-y-4">
            {[
              { name: "ضرورية", desc: "لتشغيل الموقع بشكل صحيح (التسجيل، الجلسة)" },
              { name: "تحليلية", desc: "لفهم كيف تستخدم المنصة وتحسينها" },
              { name: "تفضيلية", desc: "لتذكر إعداداتك (اللغة، البلد)" },
              { name: "إعلانية", desc: "لعرض إعلانات مناسبة لاهتماماتك" }
            ].map((cookie) => (
              <div key={cookie.name} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-bold mb-1">🍪 {cookie.name}</h3>
                <p className="text-sm text-slate-600">{cookie.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-brand-700 mb-3">إدارة الكوكيز</h2>
          <p className="text-slate-600 leading-relaxed">
            يمكنك التحكم في الكوكيز من إعدادات المتصفح. لاحظ أن تعطيلها قد يؤثر على بعض ميزات الموقع.
          </p>
        </div>
      </div>
    </div>
  );
}