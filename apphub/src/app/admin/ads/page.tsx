import { createClient } from "@/lib/supabase/server";
import { AdActions } from "@/components/admin/ad-actions";

export default async function AdminAdsPage() {
  const supabase = createClient();
  const { data: ads } = await supabase
    .from("brand_ads")
    .select("*, brands(name, owner_id)")
    .order("created_at", { ascending: false });

  const stats = {
    total: ads?.length ?? 0,
    pending: ads?.filter((a: any) => a.status === "pending").length ?? 0,
    active: ads?.filter((a: any) => a.status === "active").length ?? 0,
    rejected: ads?.filter((a: any) => a.status === "rejected").length ?? 0
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">📢 إدارة الإعلانات</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <StatBox label="الإجمالي" value={stats.total} color="blue" />
        <StatBox label="قيد المراجعة" value={stats.pending} color="amber" />
        <StatBox label="نشط" value={stats.active} color="emerald" />
        <StatBox label="مرفوض" value={stats.rejected} color="rose" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3">الإعلان</th>
              <th className="p-3">البراند</th>
              <th className="p-3">النوع</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">المشاهدات</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(ads ?? []).map((ad: any) => (
              <tr key={ad.id} className="border-b">
                <td className="p-3">
                  <p className="font-bold">{ad.title}</p>
                  <p className="text-xs text-slate-500">{ad.app_slug}</p>
                </td>
                <td className="p-3">{ad.brands?.name || "—"}</td>
                <td className="p-3">{ad.ad_type}</td>
                <td className="p-3">
                  <StatusBadge status={ad.status} />
                </td>
                <td className="p-3">{ad.views ?? 0}</td>
                <td className="p-3">
                  <AdActions adId={ad.id} currentStatus={ad.status} />
                </td>
              </tr>
            ))}
            {(!ads || ads.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  مفيش إعلانات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700"
  };
  return (
    <div className={`rounded-2xl p-5 ${colors[color]}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
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