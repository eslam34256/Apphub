import Link from "next/link";
import dynamic from "next/dynamic";
import { AppCard } from "@/components/app-card";
import { apps as staticApps } from "@/data/apps";
import { deals } from "@/data/deals";
import { createClient } from "@/lib/supabase/server";
import { AppItem } from "@/lib/types";
import { categoryLabels, categoryIcons } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AppHub — دليل التطبيقات العربي الأول | مقارنة أسعار وعروض",
  description: "اكتشف أفضل 163+ تطبيق عربي في مصر والسعودية والإمارات. قارن الأسعار، اقرا المراجعات الحقيقية، ووفر فلوسك مع أحدث العروض والخصومات اليومية على AppHub.",
  keywords: [
    "تطبيقات",
    "أفضل التطبيقات",
    "مقارنة أسعار",
    "عروض",
    "خصومات",
    "تطبيقات مصرية",
    "تطبيقات عربية",
    "دليل تطبيقات"
  ],
  openGraph: {
    title: "AppHub — دليل التطبيقات العربي",
    description: "اكتشف وقارن أفضل التطبيقات في الدول العربية. أسعار، مراجعات، عروض حصرية.",
    url: "https://apphub.eg",
    siteName: "AppHub",
    locale: "ar_EG",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AppHub — دليل التطبيقات العربي",
    description: "اكتشف وقارن أفضل التطبيقات في الدول العربية"
  },
  alternates: {
    canonical: "https://apphub.eg"
  }
};

// Lazy load NewsletterForm
const NewsletterForm = dynamic(() => 
  import("@/components/newsletter-form").then(mod => ({ default: mod.NewsletterForm })),
  { ssr: true }
);



export const revalidate = 60; // Cache for 60 seconds

export default async function HomePage() {
  const supabase = createClient();

  const { data: dbApps } = await supabase
    .from("managed_apps")
    .select("*")
    .eq("is_active", true);

  const dbAppsMapped: AppItem[] = (dbApps ?? []).map((app: any) => ({
    id: `db-${app.id}`,
    slug: app.slug,
    name: app.name,
    icon: app.icon,
    category: app.category,
    shortDescription: app.short_description || "",
    description: app.description || "",
    rating: parseFloat(app.rating) || 0,
    pros: Array.isArray(app.pros) ? app.pros : [],
    cons: Array.isArray(app.cons) ? app.cons : [],
    countries: Array.isArray(app.countries) ? app.countries : [],
    pricing: Array.isArray(app.pricing) ? app.pricing : [],
    tags: Array.isArray(app.tags) ? app.tags : [],
    businessUse: Array.isArray(app.business_use) ? app.business_use : []
  }));

  const dbSlugs = new Set(dbAppsMapped.map((a) => a.slug));
  const filteredStatic = staticApps.filter((a) => !dbSlugs.has(a.slug));
  const allApps = [...dbAppsMapped, ...filteredStatic];

  const topApps = [...allApps].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const topDeals = [...deals].sort((a, b) => b.discount - a.discount).slice(0, 4);

  // عد التطبيقات في كل فئة
  const categoriesStats = Object.entries(categoryLabels).map(([slug, label]) => ({
    slug,
    label,
    icon: categoryIcons[slug as keyof typeof categoryIcons] || "📱",
    count: allApps.filter((a) => a.category === slug).length
  })).filter((c) => c.count > 0);

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
<section className="relative overflow-hidden rounded-2xl md:rounded-3xl">
  <div className="absolute inset-0 gradient-brand"></div>

  <div className="relative px-5 py-10 sm:px-8 sm:py-16 md:px-12 md:py-24 text-white">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs sm:text-sm mb-4 sm:mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>منصة عربية رائدة</span>
      </div>

      <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold mb-3 sm:mb-6 leading-snug sm:leading-tight">
        اكتشف أفضل التطبيقات
        <br />
        <span className="bg-gradient-to-l from-accent-300 to-amber-300 bg-clip-text text-transparent block mt-1 sm:mt-2">
          وقارن الأسعار بسهولة
        </span>
      </h1>

      <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-5 sm:mb-8 max-w-2xl leading-relaxed">
        منصة عربية تساعدك تختار التطبيق المناسب حسب بلدك وميزانيتك واحتياجك.
        <span className="text-amber-300 font-bold"> {allApps.length}+ تطبيق</span> في انتظارك.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link
          href="/apps"
          className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-white px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold text-brand-700 hover:scale-105 transition shadow-xl"
        >
          <span>تصفح التطبيقات</span>
          <span>←</span>
        </Link>
        <Link
          href="/compare-hub"
          className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur border border-white/30 px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold text-white hover:bg-white/20 transition"
        >
          <span>🔍</span>
          <span>المقارنات الذكية</span>
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* Stats Section */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "تطبيق", value: allApps.length, icon: "📱", color: "from-brand-500 to-brand-700" },
          { label: "فئة", value: 15, icon: "📂", color: "from-emerald-500 to-emerald-700" },
          { label: "عرض نشط", value: deals.length, icon: "🔥", color: "from-amber-500 to-orange-600" },
          { label: "دولة", value: 3, icon: "🌍", color: "from-accent-500 to-pink-600" }
        ].map((stat) => (
          <div key={stat.label} className="card-hover rounded-3xl bg-white p-6 shadow-soft">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-3 shadow-md`}>
              {stat.icon}
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900">{stat.value}+</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Compare Hub CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-emerald-500 to-teal-600 p-8 md:p-12 text-white">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-bold mb-3">
              🆕 ميزة حصرية
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              قارن قبل ما تختار 🎯
            </h2>
            <p className="text-white/90 max-w-xl">
              مقارنات ذكية للمشاوير، توصيل الأكل، الستريمنج، والتقسيط — كله في مكان واحد.
            </p>
          </div>
          <Link
            href="/compare-hub"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-emerald-700 hover:scale-105 transition shadow-xl whitespace-nowrap"
          >
            <span>ابدأ المقارنة</span>
            <span>←</span>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold">تصفح حسب الفئة 📂</h2>
            <p className="text-slate-500 mt-1">اختار اللي يهمك من 15 فئة مختلفة</p>
          </div>
          <Link href="/apps" className="text-brand-600 font-bold hover:underline hidden md:block">
            عرض الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoriesStats.slice(0, 15).map((cat) => (
            <Link
              key={cat.slug}
              href={`/apps?category=${cat.slug}`}
              className="card-hover group rounded-2xl bg-white p-4 shadow-soft text-center"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition inline-block">
                {cat.icon}
              </div>
              <p className="font-bold text-sm">{cat.label}</p>
              <p className="text-xs text-slate-500 mt-1">{cat.count} تطبيق</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Apps */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold">⭐ الأكثر شعبية</h2>
            <p className="text-slate-500 mt-1">التطبيقات اللي اختارها المستخدمين</p>
          </div>
          <Link href="/apps" className="text-brand-600 font-bold hover:underline hidden md:block">
            شوف كل التطبيقات ←
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Top Deals */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold">🔥 عروض حصرية</h2>
            <p className="text-slate-500 mt-1">وفّر فلوسك مع أحدث العروض</p>
          </div>
          <Link href="/deals" className="text-brand-600 font-bold hover:underline hidden md:block">
            كل العروض ←
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topDeals.map((deal) => (
            <div
              key={deal.id}
              className="card-hover rounded-2xl bg-white p-5 shadow-soft border border-slate-100"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  خصم {deal.discount}%
                </span>
                <span className="text-xs text-slate-400">{deal.views} مشاهدة</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{deal.brand}</p>
              <h3 className="font-bold mb-3 line-clamp-2">{deal.title}</h3>
              {deal.code && (
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                  <p className="text-xs text-slate-500 mb-1">كود الخصم</p>
                  <p className="font-mono font-bold text-brand-600">{deal.code}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-brand-900 p-8 md:p-12 text-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            ليه AppHub؟ 🎯
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            منصة شاملة بكل اللي تحتاجه عشان تختار صح وتوفر فلوسك
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "🤖", title: "ترشيحات ذكية", desc: "AI يرشحلك التطبيق المناسب ليك بناءً على احتياجاتك" },
            { icon: "💰", title: "مقارنة أسعار", desc: "قارن أسعار التطبيقات في مصر والسعودية والإمارات" },
            { icon: "💎", title: "محتوى عربي", desc: "كل المعلومات بالعربي ومحدّثة باستمرار" },
            { icon: "🔍", title: "بحث متقدم", desc: "ابحث بسهولة وفلتر حسب البلد والفئة والميزانية" },
            { icon: "👥", title: "مجتمع تفاعلي", desc: "اقرا تجارب المستخدمين الحقيقية وشارك تجربتك" },
            { icon: "📊", title: "بيانات دقيقة", desc: "أسعار وميزات محدثة من مصادر موثوقة" }
          ].map((feature) => (
            <div key={feature.title} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterForm />
    </div>
  );
}