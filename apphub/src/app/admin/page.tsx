import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminHomePage() {
  const supabase = createClient();

  // جيب الإحصائيات
  const [
    { count: appsCount },
    { count: usersCount },
    { count: adsCount },
    { count: brandsCount },
    { count: commentsCount },
    { count: pendingAds }
  ] = await Promise.all([
    supabase.from("managed_apps").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("brand_ads").select("*", { count: "exact", head: true }),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    supabase.from("brand_ads").select("*", { count: "exact", head: true }).eq("status", "pending")
  ]);

  // آخر النشاطات
  const { data: recentLogs } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-8 text-white">
        <p className="text-sm text-white/80">لوحة تحكم AppHub</p>
        <h1 className="mt-2 text-3xl font-extrabold">أهلًا بيك يا أدمن 👋</h1>
        <p className="mt-2 text-white/90">إدارة كاملة لمنصة AppHub من مكان واحد</p>
      </div>

      {/* الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard icon="📱" label="التطبيقات" value={appsCount ?? 0} href="/admin/apps" color="blue" />
        <StatCard icon="👥" label="المستخدمين" value={usersCount ?? 0} href="/admin/users" color="emerald" />
        <StatCard icon="📢" label="الإعلانات" value={adsCount ?? 0} href="/admin/ads" color="purple" />
        <StatCard icon="🏪" label="البراندات" value={brandsCount ?? 0} href="/admin/brands" color="orange" />
        <StatCard icon="💬" label="التعليقات" value={commentsCount ?? 0} href="/admin/comments" color="pink" />
        <StatCard icon="⏳" label="قيد المراجعة" value={pendingAds ?? 0} href="/admin/ads" color="amber" />
      </div>

      {/* الإجراءات السريعة */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">⚡ إجراءات سريعة</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <QuickAction href="/admin/apps/new" icon="➕" label="إضافة تطبيق" />
          <QuickAction href="/admin/deals/new" icon="💰" label="إضافة عرض" />
          <QuickAction href="/admin/ads?status=pending" icon="✅" label="مراجعة إعلانات" />
          <QuickAction href="/admin/blog/new" icon="📝" label="مقال جديد" />
        </div>
      </div>

      {/* آخر النشاطات */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">📋 آخر النشاطات</h2>
        {recentLogs && recentLogs.length > 0 ? (
          <div className="space-y-2">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between border-b py-2 text-sm">
                <span>{log.action}</span>
                <span className="text-xs text-slate-500">
                  {new Date(log.created_at).toLocaleString("ar-EG")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-4">مفيش نشاطات لسه</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, href, color }: {
  icon: string; label: string; value: number; href: string;
  color: "blue" | "emerald" | "purple" | "orange" | "pink" | "amber";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200"
  };

  return (
    <Link
      href={href}
      className={`rounded-2xl border-2 p-4 transition hover:scale-105 ${colors[color]}`}
    >
      <p className="text-2xl">{icon}</p>
      <p className="mt-2 text-sm opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </Link>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 hover:bg-brand-50 transition"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-bold">{label}</span>
    </Link>
  );
}
