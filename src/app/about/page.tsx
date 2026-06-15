import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن — AppHub",
  description: "تعرّف على AppHub، المنصة العربية الرائدة لاكتشاف التطبيقات ومقارنة الأسعار"
};

export default function AboutPage() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-brand p-12 text-white text-center">
        <div className="relative">
          <div className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1 text-sm mb-4">
            🌟 قصتنا
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            نحن AppHub
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            منصة عربية رائدة تساعدك تكتشف وتختار أفضل التطبيقات بسهولة
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <div className="inline-block bg-brand-100 text-brand-700 rounded-full px-3 py-1 text-xs font-bold mb-3">
            🎯 رسالتنا
          </div>
          <h2 className="text-3xl font-extrabold mb-4">
            نخلي اختيار التطبيق سهل
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            في عالم فيه آلاف التطبيقات، أصبح من الصعب على المستخدم العربي إنه يلاقي
            التطبيق المناسب لاحتياجاته بدون ما يقضي ساعات في البحث والمقارنة.
          </p>
          <p className="text-slate-600 leading-relaxed">
            <strong className="text-brand-600">AppHub</strong> جه عشان يحل المشكلة دي.
            بنوفّر لك معلومات دقيقة، مقارنات شفافة، ومراجعات حقيقية لكل التطبيقات
            في المنطقة العربية.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "📱", value: "163+", label: "تطبيق" },
            { icon: "🌍", value: "3", label: "دول" },
            { icon: "📂", value: "15", label: "فئة" },
            { icon: "💬", value: "1000+", label: "مراجعة" }
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-soft text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-brand-600">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-brand-50 p-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-accent-100 text-accent-700 rounded-full px-3 py-1 text-xs font-bold mb-3">
            🚀 رؤيتنا
          </div>
          <h2 className="text-3xl font-extrabold mb-4">
            نكون الوجهة الأولى للعرب
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            نطمح أن نكون المنصة العربية الأولى اللي بيلجأ ليها كل مستخدم عربي قبل ما
            يحمّل أي تطبيق جديد. نحلم بمستخدم عربي واعي يقدر يختار صح ويوفر فلوسه.
          </p>
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold mb-2">قيمنا 💎</h2>
          <p className="text-slate-500">المبادئ اللي بنشتغل بيها</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "🎯",
              title: "الدقة",
              desc: "معلومات محدّثة باستمرار من مصادر موثوقة"
            },
            {
              icon: "💎",
              title: "الشفافية",
              desc: "مراجعات حقيقية بدون انحياز لأي تطبيق"
            },
            {
              icon: "🚀",
              title: "الابتكار",
              desc: "نطوّر أدوات جديدة باستمرار لخدمة المستخدم"
            },
            {
              icon: "🤝",
              title: "المجتمع",
              desc: "نبني مجتمع تفاعلي يتشارك التجارب والآراء"
            },
            {
              icon: "🌍",
              title: "الانتشار",
              desc: "نخدم العرب في مصر والخليج وكل المنطقة"
            },
            {
              icon: "💰",
              title: "التوفير",
              desc: "نساعدك توفر فلوسك من خلال المقارنات الذكية"
            }
          ].map((value) => (
            <div key={value.title} className="card-hover rounded-2xl bg-white p-6 shadow-soft text-center">
              <div className="text-5xl mb-3">{value.icon}</div>
              <h3 className="font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-slate-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="rounded-3xl bg-white p-10 shadow-soft">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-bold mb-3">
            📖 قصتنا
          </div>
          <h2 className="text-3xl font-extrabold mb-6">كيف بدأنا</h2>

          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              بدأت فكرة <strong>AppHub</strong> من معاناة شخصية. كل واحد فينا بيضيع وقت
              كتير في البحث عن أفضل تطبيق لتوصيل الأكل، أو أرخص اشتراك Netflix، أو
              أحسن تطبيق بنك.
            </p>
            <p>
              المعلومات مبعثرة، المقارنات مش متاحة بالعربي، والمراجعات الحقيقية
              صعب تلاقيها. قلنا ليه ما نعملش منصة واحدة تجمع كل ده؟
            </p>
            <p>
              من هنا ولدت <strong className="text-brand-600">AppHub</strong> — منصة
              عربية بالكامل، مصرية المنشأ، عالمية الطموح.
            </p>
            <p className="text-lg font-bold text-brand-600">
              🇪🇬 صُنع في مصر، لخدمة كل عربي.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl gradient-brand p-10 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-3">
          عايز تكون جزء من قصتنا؟ 🚀
        </h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          انضم لآلاف المستخدمين العرب اللي بيستخدموا AppHub يوميًا
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/auth"
            className="rounded-2xl bg-white px-6 py-3 font-bold text-brand-700 hover:scale-105 transition shadow-xl"
          >
            سجّل مجانًا
          </Link>
          <Link
            href="/contact"
            className="rounded-2xl bg-white/10 backdrop-blur border border-white/30 px-6 py-3 font-bold hover:bg-white/20 transition"
          >
            تواصل معانا
          </Link>
        </div>
      </section>
    </div>
  );
}