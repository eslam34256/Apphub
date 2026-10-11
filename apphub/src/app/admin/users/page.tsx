import { createClient } from "@/lib/supabase/server";
import { UserActions } from "@/components/admin/user-actions";

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">👥 إدارة المستخدمين</h1>
        <p className="text-sm text-slate-500">{users?.length ?? 0} مستخدم</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3">الاسم</th>
              <th className="p-3">الدور</th>
              <th className="p-3">النقاط</th>
              <th className="p-3">تاريخ التسجيل</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((user: any) => (
              <tr key={user.id} className="border-b">
                <td className="p-3 font-bold">{user.full_name || "—"}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    user.role === "admin" ? "bg-purple-100 text-purple-700" :
                    user.role === "advertiser" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {user.role || "user"}
                  </span>
                </td>
                <td className="p-3">🏆 {user.points ?? 0}</td>
                <td className="p-3 text-xs">
                  {new Date(user.created_at).toLocaleDateString("ar-EG")}
                </td>
                <td className="p-3">
                  <UserActions userId={user.id} currentRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
