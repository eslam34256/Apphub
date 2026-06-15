import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وظائف — AppHub"
};

export default function CareersPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl gradient-brand p-12 text-white text-center">
        <div className="text-6xl mb-4">💼</div>
        <h1 className="text-4xl font-extrabold mb-3">انضم لفريقنا</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          نبحث عن مواهب عربية مبدعة لتشكيل مستقبل التطبيقات في المنطقة
        </p>
      </section>

      <section className="rounded-3xl bg-white p-10 shadow-soft text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-3xl font-extrabold mb-3">قريبًا...</h2>
        <p className="text-slate-600 mb-6 max-w-xl mx-auto">
          نحن نبني فريقنا حاليًا. إذا كنت مهتمًا بالانضمام إلينا، تواصل معنا وأرسل سيرتك الذاتية.
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-2xl gradient-brand px-8 py-4 font-bold text-white shadow-xl hover:scale-105 transition"
        >
          📧 ابعت لينا سيرتك
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold mb-6 text-center">ليه تشتغل معانا؟</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: "🌟", title: "مشروع طموح", desc: "كن جزءًا من بناء منصة عربية رائدة" },
            { icon: "🏠", title: "عمل مرن", desc: "Remote work وساعات مرنة" },
            { icon: "📈", title: "نمو مهني", desc: "فرص حقيقية للتعلم والترقي" },
            { icon: "💰", title: "رواتب تنافسية", desc: "حوافز ومكافآت متميزة" },
            { icon: "🎯", title: "بيئة مبدعة", desc: "فريق شاب وأفكار جديدة" },
            { icon: "🌍", title: "تأثير كبير", desc: "اعمل لخدمة ملايين العرب" }
          ].map((perk) => (
            <div key={perk.title} className="rounded-2xl bg-white p-6 shadow-soft">
              <div className="text-4xl mb-3">{perk.icon}</div>
              <h3 className="font-bold mb-2">{perk.title}</h3>
              <p className="text-sm text-slate-600">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}