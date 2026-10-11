import { createAdminClient } from "@/lib/supabase/admin";

/**
 * v43 — صندوق الاستعلامات: كل اللي سابوا بريدهم بإهتمام (معلنين/شركات/عام).
 * دي قائمة المتابعة التجارية — بدونها الليدات بتضيع في الداتابيز من غير ما حد يشوفها.
 */
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  advertiser: "📢 معلن محتمل",
  "business-lead": "💼 شركة (Stack)",
  "data-lead": "🧾 بيانات B2B",
  general: "👤 عام"
};

export default async function AdminLeadsPage() {
  const admin = createAdminClient();
  if (!admin) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center text-sm text-amber-700">
        محتاجة SUPABASE_SERVICE_ROLE_KEY عشان تقرا قائمة الانتظار.
      </div>
    );
  }
  const { data } = await admin.from("waitlist").select("email, interest, created_at").order("created_at", { ascending: false }).limit(200);
  const rows = (data ?? []) as { email: string; interest: string; created_at: string }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">🎯 صندوق الاستعلامات</h1>
        <p className="text-sm text-slate-500">{rows.length} استعلام — الأحدث أولًا. دول فلوسك المحتملة: رد خلال يوم شغل.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="p-3">البريد</th>
              <th className="p-3">النوع</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">رد سريع</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.email}-${i}`} className="border-b">
                <td className="p-3 font-bold" dir="ltr">{r.email}</td>
                <td className="p-3">{LABELS[r.interest] ?? `🏷️ ${r.interest}`}</td>
                <td className="p-3 text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString("ar-EG")}</td>
                <td className="p-3">
                  <a
                    href={`mailto:${r.email}?subject=${encodeURIComponent("AppHub — بخصوص استعلامك")}`}
                    className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
                  >
                    📧 رد
                  </a>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-sm text-slate-500">لسه مفيش استعلامات — أول ما حد يسيب بريده هيظهر هنا فورًا.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
