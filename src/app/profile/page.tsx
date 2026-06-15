import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOutAction } from "@/app/api/auth/actions";
import { ProfileActions } from "@/components/profile-actions";
import { PointsDisplay } from "@/components/points-display";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const isAdvertiser = profile?.role === "advertiser" || isAdmin;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-8 text-white">
        <h1 className="mb-2 text-3xl font-extrabold">
          أهلًا {profile?.full_name || user.email?.split("@")[0]} 👋
        </h1>
        <p className="text-white/80">{user.email}</p>
        {isAdmin && (
          <span className="mt-3 inline-block rounded-full bg-purple-500 px-3 py-1 text-xs font-bold">
            👑 أدمن
          </span>
        )}
        {isAdvertiser && !isAdmin && (
          <span className="mt-3 inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-bold">
            📢 معلن
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">النقاط</p>
          <p className="mt-2 text-2xl font-extrabold">🏆 {profile?.points ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">الدور</p>
          <p className="mt-2 text-2xl font-extrabold">{profile?.role ?? "user"}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">تاريخ التسجيل</p>
          <p className="mt-2 text-lg font-bold">
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("ar-EG")
              : "—"}
          </p>
        </div>
      </div>

      {/* روابط سريعة */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">روابط سريعة</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4 hover:bg-purple-100 transition"
            >
              <span className="text-2xl">👑</span>
              <div>
                <p className="font-bold">لوحة الأدمن</p>
                <p className="text-xs text-slate-500">إدارة كل شيء</p>
              </div>
            </Link>
          )}

          {isAdvertiser && (
            <Link
              href="/advertiser-dashboard"
              className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4 hover:bg-blue-100 transition"
            >
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-bold">داشبورد المعلنين</p>
                <p className="text-xs text-slate-500">إدارة إعلاناتك</p>
              </div>
            </Link>
          )}

          <Link
            href="/subscriptions"
            className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 hover:bg-emerald-100 transition"
          >
            <span className="text-2xl">💳</span>
            <div>
              <p className="font-bold">اشتراكاتي</p>
              <p className="text-xs text-slate-500">تابع مصاريفك</p>
            </div>
          </Link>

          <Link
            href="/compare-hub"
            className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4 hover:bg-orange-100 transition"
          >
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-bold">المقارنات</p>
              <p className="text-xs text-slate-500">قارن قبل ما تختار</p>
            </div>
          </Link>
        </div>
      </div>

      <ProfileActions signOutAction={signOutAction} />
    </div>
  );
}