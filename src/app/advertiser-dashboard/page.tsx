import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdvertiserDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // جيب بيانات البراند
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  // جيب الإعلانات
  const { data: ads } = await supabase
    .from("brand_ads")
    .select("*")
    .eq("brand_id", brand?.id)
    .order("created_at", { ascending: false });

  // الإحصائيات
  const totalViews = (ads ?? []).reduce((sum, ad: any) => sum + (ad.views ?? 0), 0);
  const totalClicks = (ads ?? []).reduce((sum, ad: any) => sum + (ad.clicks ?? 0), 0);
  const totalConversions = (ads ?? []).reduce((sum, ad: any) => sum + (ad.conversions ?? 0), 0);
  const totalRevenue = (ads ?? []).reduce((sum, ad: any) => sum + (ad.revenue ?? 0), 0);
  const activeAds = (ads ?? []).filter((ad: any) => ad.status === "active").length;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0";
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0";

  // أفضل 5 إعلانات للـ Chart
  const topAds = (ads ?? []).slice(0, 5).map((ad: any) => ({
    name: ad.title,
    views: ad.views ?? 0,
    clicks: ad.clicks ?? 0
  }));

  const maxViews = Math.max(1, ...topAds.map(a => a.views));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm text-white/80">📊 لوحة تحكم المعلنين</p>
            <h1 className="text-3xl font-extrabold">
              {brand?.name || "أهلاً بيك في AppHub"}
            </h1>
            {!brand && (
              <p className="mt-2 text-white/90">
                ابدأ بتسجيل البراند بتاعك عشان تنشر إعلانات
              </p>
            )}
          </div>
          <Link
            href="/advertiser-dashboard/new-ad"
            className="rounded-2xl bg-white px-6 py-3 font-bold text-brand-600 hover:scale-105 transition"
          >
            + إعلان جديد
          </Link>
        </div>
      </div>

      {!brand ? (
        <SetupBrand />
      ) : (
        <>
          {/* الإحصائيات الرئيسية */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              icon="👁️"
              label="إجمالي المشاهدات"
              value={totalViews.toLocaleString()}
              change="+12%"
              variant="info"
            />
            <StatCard
              icon="🖱️"
              label="إجمالي النقرات"
              value={totalClicks.toLocaleString()}
              change={`CTR: ${ctr}%`}
              variant="success"
            />
            <StatCard
              icon="✅"
              label="التحويلات"
              value={totalConversions.toLocaleString()}
              change={`معدل: ${conversionRate}%`}
              variant="purple"
            />
            <StatCard
              icon="💰"
              label="الإيرادات"
              value={`${totalRevenue.toLocaleString()} ج`}
              change="+8%"
              variant="warning"
            />
          </div>

          {/* الإعلانات النشطة */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">📈 الإعلانات النشطة</h2>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-extrabold text-emerald-600">{activeAds}</p>
                <div className="text-right text-sm">
                  <p className="text-slate-500">من إجمالي</p>
                  <p className="font-bold">{ads?.length ?? 0} إعلان</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${ads?.length ? (activeAds / ads.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">📦 الباقة الحالية</h2>
              <p className="text-2xl font-extrabold">باقة البداية</p>
              <p className="mt-1 text-sm text-slate-500">باقي 5 أيام</p>
              <Link
                href="/advertise"
                className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white"
              >
                ترقية الباقة ←
              </Link>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold">📊 أداء أفضل 5 إعلانات</h2>

            {topAds.length === 0 ? (
              <p className="text-center text-slate-500 py-8">مفيش إعلانات لسه</p>
            ) : (
              <div className="space-y-4">
                {topAds.map((ad, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-xs">{ad.name}</span>
                      <span className="text-slate-500">
                        👁️ {ad.views} • 🖱️ {ad.clicks}
                      </span>
                    </div>
                    <div className="relative h-8 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="absolute inset-y-0 right-0 bg-gradient-to-l from-brand-500 to-brand-700 rounded-full flex items-center justify-end pr-3 text-white text-xs font-bold"
                        style={{ width: `${(ad.views / maxViews) * 100}%` }}
                      >
                        {ad.views > 0 && `${ad.views}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* الجدول الكامل */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">📋 كل الإعلانات</h2>
              <Link
                href="/advertiser-dashboard/new-ad"
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white"
              >
                + إعلان جديد
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3">الإعلان</th>
                    <th className="p-3">النوع</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">المشاهدات</th>
                    <th className="p-3">النقرات</th>
                    <th className="p-3">CTR</th>
                    <th className="p-3">الإيراد</th>
                    <th className="p-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {(ads ?? []).map((ad: any) => {
                    const ctrAd = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) : "0";
                    return (
                      <tr key={ad.id} className="border-b hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-bold">{ad.title}</p>
                          <p className="text-xs text-slate-500">{ad.app_slug}</p>
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                            {ad.ad_type}
                          </span>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={ad.status} />
                        </td>
                        <td className="p-3">{(ad.views ?? 0).toLocaleString()}</td>
                        <td className="p-3">{(ad.clicks ?? 0).toLocaleString()}</td>
                        <td className="p-3">{ctrAd}%</td>
                        <td className="p-3 font-bold text-emerald-600">
                          {(ad.revenue ?? 0).toLocaleString()} ج
                        </td>
                        <td className="p-3">
                          <a
                            href="mailto:advertising@apphub.eg?subject=طلب تعديل إعلان"
                            className="text-brand-600 hover:underline text-xs"
                          >
                            اطلب تعديل
                          </a>
                        </td>
                      </tr>
                    );
                  })}

                  {(!ads || ads.length === 0) && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        <p className="text-3xl mb-2">📢</p>
                        <p>مفيش إعلانات لسه</p>
                        <Link
                          href="/advertiser-dashboard/new-ad"
                          className="mt-3 inline-block text-brand-600 hover:underline"
                        >
                          أنشئ أول إعلان ←
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, change, variant }: {
  icon: string; label: string; value: string; change: string;
  variant: "info" | "success" | "purple" | "warning";
}) {
  const colors = {
    info: "border-blue-200 bg-blue-50",
    success: "border-emerald-200 bg-emerald-50",
    purple: "border-purple-200 bg-purple-50",
    warning: "border-amber-200 bg-amber-50"
  };

  return (
    <div className={`rounded-2xl border-2 p-5 shadow-sm ${colors[variant]}`}>
      <p className="text-3xl">{icon}</p>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{change}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    active: { label: "نشط", color: "bg-emerald-100 text-emerald-700" },
    pending: { label: "قيد المراجعة", color: "bg-amber-100 text-amber-700" },
    paused: { label: "متوقف", color: "bg-slate-100 text-slate-700" },
    expired: { label: "منتهي", color: "bg-rose-100 text-rose-700" },
    rejected: { label: "مرفوض", color: "bg-red-100 text-red-700" }
  };

  const cfg = config[status] || config.pending;

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function SetupBrand() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-brand-300 bg-brand-50 p-10 text-center">
      <p className="text-5xl mb-4">🏪</p>
      <h2 className="text-2xl font-extrabold mb-2">سجّل البراند بتاعك أولاً</h2>
      <p className="text-slate-600 mb-6">
        قبل ما تنشئ إعلانات لازم تسجل بيانات البراند
      </p>
      <Link
        href="/advertiser-dashboard/setup"
        className="inline-block rounded-2xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-500"
      >
        سجّل البراند دلوقتي ←
      </Link>
    </div>
  );
}
