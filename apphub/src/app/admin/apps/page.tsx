import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteAppButton } from "@/components/admin/delete-app-button";

export default async function AdminAppsPage() {
  const supabase = createClient();
  const { data: apps } = await supabase
    .from("managed_apps")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">📱 إدارة التطبيقات</h1>
          <p className="text-sm text-slate-500">{apps?.length ?? 0} تطبيق</p>
        </div>
        <Link
          href="/admin/apps/new"
          className="rounded-2xl bg-brand-600 px-5 py-2 font-bold text-white"
        >
          + إضافة تطبيق
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3">الأيقونة</th>
              <th className="p-3">الاسم</th>
              <th className="p-3">الفئة</th>
              <th className="p-3">التقييم</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(apps ?? []).map((app: any) => (
              <tr key={app.id} className="border-b hover:bg-slate-50">
                <td className="p-3 text-2xl">{app.icon}</td>
                <td className="p-3">
                  <p className="font-bold">{app.name}</p>
                  <p className="text-xs text-slate-500">{app.slug}</p>
                </td>
                <td className="p-3">{app.category}</td>
                <td className="p-3">⭐ {app.rating}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    app.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {app.is_active ? "نشط" : "متوقف"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/apps/${app.id}/edit`}
                      className="rounded-lg bg-blue-100 px-3 py-1 text-xs text-blue-700"
                    >
                      تعديل
                    </Link>
                    <DeleteAppButton appId={app.id} appName={app.name} />
                  </div>
                </td>
              </tr>
            ))}

            {(!apps || apps.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  <p className="text-3xl mb-2">📱</p>
                  <p>مفيش تطبيقات لسه — أضف أول تطبيق</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
