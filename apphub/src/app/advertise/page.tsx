import Link from "next/link";
import { getSiteSettings, getWhatsAppLink } from "@/lib/settings";
import { apps } from "@/data/apps";
import { WaitlistForm } from "@/components/waitlist-form";

// v39: أرقام صادقة محسوبة من الداتا — أرقام الجمهور التفصيلية بتتقدم في الميديا كيت بس
const CATEGORY_COUNT = new Set(apps.map(a => a.category)).size;

export default async function AdvertisePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-10">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-10 text-white">
        <p className="mb-3 text-sm text-white/80">📢 للبراندات وأصحاب البيزنس</p>
        <h1 className="mb-4 text-4xl font-extrabold">
          وصّل لآلاف العملاء يوميًا
        </h1>
        <p className="mb-6 max-w-2xl text-lg text-white/90">
          {settings.site_name} بيشوفه آلاف المصريين كل يوم وهم بيقارنوا التطبيقات والأسعار.
        </p>
        <Link
          href="/auth"
          className="inline-block rounded-2xl bg-white px-8 py-4 font-bold text-brand-600 hover:scale-105 transition"
        >
          ابدأ الإعلان دلوقتي ←
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon="📱" value={`+${apps.length}`} label="تطبيق مُراجع" />
        <Stat icon="📂" value={`${CATEGORY_COUNT}`} label="فئة" />
        <Stat icon="📡" value="4" label="رادارات أسعار يومية" />
        <Stat icon="🌍" value="3" label="دول" />
      </div>
      <p className="-mt-4 text-center text-xs text-slate-500">
        أرقام الجمهور التفصيلية (سيرش + سوشيال) بتتقدم في الميديا كيت عند التعاقد — بنعرض أرقام حقيقية بس.
      </p>

      <section>
        <h2 className="mb-6 text-3xl font-extrabold text-center">
          ليه تعلن على {settings.site_name}؟
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Feature icon="🎯" title="جمهور مستهدف" description="مستخدمين فعلاً بيقارنوا التطبيقات" />
          <Feature icon="📊" title="إحصائيات تفصيلية" description="اعرف بالظبط كام واحد شاف إعلانك" />
          <Feature icon="🇪🇬" title="السوق المصري" description="منصة مصرية 100%" />
          <Feature icon="💰" title="أسعار منافسة" description="ابدأ من 500 ج فقط" />
          <Feature icon="⚡" title="إعلانات تفاعلية" description="عرض أسعارك الخاصة والخصومات" />
          <Feature icon="🏆" title="ظهور مميز" description="في الأماكن الأكثر مشاهدة" />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-3xl font-extrabold text-center">اختار الباقة المناسبة</h2>
        <p className="mb-8 text-center text-slate-500">ابدأ بأي باقة وارفع التانية وقت ما تحب</p>

        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            name="باقة البداية"
            price="500"
            duration="7 أيام"
            description="مثالية للمحلات الصغيرة"
            features={["إعلان واحد", "ظهور 7 أيام", "إحصائيات أساسية", "دعم بالإيميل"]}
            cta="ابدأ بـ 500 ج"
          />
          <PricingCard
            name="Growth — Sponsored"
            price="1,500"
            duration="شهريًا"
            description="الأكثر اختيارًا"
            features={["Featured Listing بشارة Sponsored", "ظهور في الرئيسية", "مقال تعريفي واحد", "إحصائيات تفصيلية", "دعم واتساب"]}
            cta="ابدأ Growth"
            popular
          />
          <PricingCard
            name="Premium — Sponsored"
            price="5,000"
            duration="شهريًا"
            description="للبراندات اللي عايزة تصدر"
            features={["كل مزايا Growth", "الظهور في المقارنات والرادارات", "ذكر في النشرة الأسبوعية", "بوست سوشيال ميديا", "تقرير أداء شهري"]}
            cta="احجز Premium"
          />
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          🤝 <strong>سياسة الثقة:</strong> أي محتوى مدفوع بيتوسم «Sponsored» بوضوح — جمهورنا يعرف دايمًا إيه المدفوع وإيه الترشيح الحقيقي.
          <br />
          <span className="text-xs text-slate-500">الحملات الكاملة (تقرير + مقارنة + نشرة + سوشيال) بأسعار بالاتفاق 10–20 ألف — كلمنا واتساب.</span>
        </p>
      </section>

      <section>
        <h2 className="mb-8 text-3xl font-extrabold text-center">إزاي تبدأ في 3 خطوات؟</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Step number="1" title="سجّل البراند" description="أدخل بياناتك في دقايق" />
          <Step number="2" title="اختار باقة" description="حدد المناسبة وادفع أونلاين" />
          <Step number="3" title="أنشئ إعلانك" description="بسعرك الخاص وعروضك" />
        </div>
      </section>

      {/* CTA Dynamic */}
      <div className="rounded-3xl bg-gradient-to-l from-emerald-500 to-emerald-700 p-10 text-center text-white">
        <h2 className="mb-3 text-3xl font-extrabold">جاهز توصّل لجمهورك؟</h2>
        <p className="mb-6 text-white/90">آلاف العملاء بيدوروا على تطبيقك الآن</p>

        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Link
            href="/auth"
            className="inline-block rounded-2xl bg-white px-8 py-4 font-bold text-emerald-700 hover:scale-105 transition"
          >
            🚀 ابدأ دلوقتي
          </Link>

          {settings.whatsapp_number && (
            <a
              href={getWhatsAppLink(settings.whatsapp_number, "أهلاً، عايز أستفسر عن الإعلانات")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur border border-white/30 px-8 py-4 font-bold text-white hover:bg-white/30 transition"
            >
              <span>💬</span>
              <span>كلمنا على واتساب</span>
            </a>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-md rounded-3xl bg-white/10 backdrop-blur border border-white/20 p-5">
          <p className="mb-3 text-center text-sm font-bold text-white">أو سيب بريدك وهنرجعلك بعرض مفصل 📩</p>
          <WaitlistForm interest="advertiser" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90 mt-6">
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 hover:text-white">
              <span>📧</span>
              <span>{settings.contact_email}</span>
            </a>
          )}
          {settings.phone_number && (
            <a href={`tel:${settings.phone_number}`} className="flex items-center gap-2 hover:text-white">
              <span>📞</span>
              <span>{settings.phone_number}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
      <p className="text-3xl">{icon}</p>
      <p className="mt-2 text-2xl font-extrabold text-brand-600">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="mb-3 text-3xl">{icon}</p>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function PricingCard({
  name, price, duration, description, features, cta, popular, customLink
}: {
  name: string; price: string; duration: string;
  description: string; features: string[]; cta: string;
  popular?: boolean; customLink?: string;
}) {
  const link = customLink || "/auth";
  return (
    <div className={`rounded-3xl border-2 p-6 ${
      popular ? "border-brand-500 bg-brand-50 shadow-xl" : "border-slate-200 bg-white shadow-sm"
    }`}>
      {popular && (
        <span className="mb-3 inline-block rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
          🔥 الأكثر طلبًا
        </span>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="my-6">
        <span className="text-5xl font-extrabold text-brand-600">{price}</span>
        <span className="text-slate-500"> ج / {duration}</span>
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className="text-emerald-500">✓</span>
            <span className="text-slate-700">{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={link}
        target={customLink ? "_blank" : undefined}
        rel={customLink ? "noopener noreferrer" : undefined}
        className={`block w-full rounded-2xl py-3 text-center font-bold transition ${
          popular
            ? "bg-brand-600 text-white hover:bg-brand-500"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
        {number}
      </div>
      <h3 className="mb-2 font-bold">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}