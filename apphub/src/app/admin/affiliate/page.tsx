import { requireAdmin } from "@/lib/admin-check";
import { affiliateLinks, type AffiliateLink } from "@/lib/affiliate";
import { createAdminClient } from "@/lib/supabase/admin";
import { AffiliateActions } from "@/components/admin/affiliate-actions";
import { AffiliateForm } from "@/components/admin/affiliate-form";

export const dynamic = "force-dynamic";

export default async function AdminAffiliatePage() {
  await requireAdmin();

  const admin = createAdminClient();
  let rows: any[] = [];
  let clickCounts: Record<string, number> = {};
  let dbReady = false;
  if (admin) {
    const { data } = await admin.from("affiliate_links").select("*").order("created_at", { ascending: false }).limit(100);
    if (data) { rows = data; dbReady = true; }
    const { data: clicks } = await admin.from("affiliate_clicks").select("app_slug").limit(1000);
    (clicks ?? []).forEach((c: any) => { clickCounts[c.app_slug] = (clickCounts[c.app_slug] ?? 0) + 1; });
  }

  const staticEntries: AffiliateLink[] = Object.values(affiliateLinks);
  const statusBadge: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    paused: "bg-slate-100 text-slate-600",
    rejected: "bg-red-100 text-red-700"
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold">إدارة روابط الأفيليات</h1>
        <p className="mt-1 text-sm text-slate-500">
          إنشاء ومراجعة وتفعيل الروابط المعتمدة فقط — كل تغيير بيتسجّل في سجل الأدمن. الكونفيرجنزات غير متاحة لحد ما يبقى فيه تكامل فعلي.
        </p>
      </header>

      {/* إنشاء رابط جديد */}
      <AffiliateForm dbReady={dbReady} />

      {/* روابط قاعدة البيانات */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold">روابط قاعدة البيانات {dbReady ? `(${rows.length})` : ""}</h2>
        {!dbReady ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            ⚠️ جدول <code>affiliate_links</code> مش موجود لسه — شغّل <code>docs/SQL-AFFILIATE.sql</code> على Supabase.
            الروابط الستاتيك في الكود شغالة بشكل طبيعي وبتظهر كـ pending.
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">لا توجد روابط بعد — أضف أول رابط من الفورم أعلاه.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="p-3">المزوّد</th>
                  <th className="p-3">الوجهة</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الكليكس</th>
                  <th className="p-3">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="p-3 font-bold">{r.provider}</td>
                    <td className="p-3 text-xs text-slate-500" dir="ltr">{r.destination}</td>
                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusBadge[r.status]}`}>{r.status}</span></td>
                    <td className="p-3">{clickCounts[r.app_slug ?? r.provider] ?? 0}</td>
                    <td className="p-3"><AffiliateActions id={r.id} status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* السجلات الستاتيك — تدار من الكود */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold">سجلات ستاتيك في الكود ({staticEntries.length})</h2>
        <p className="mb-3 text-xs text-slate-500">هذه الروابط معرفة داخل الكود (قيد الاعتماد) وتُدار بتعديل الملف — بتتعرض كروابط عادية بدون شارة عمولة.</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="p-3">التطبيق</th><th className="p-3">الرابط</th><th className="p-3">الحالة</th><th className="p-3">الكليكس</th></tr>
            </thead>
            <tbody>
              {staticEntries.map((l) => (
                <tr key={l.appSlug} className="border-t border-slate-100">
                  <td className="p-3 font-bold">{l.appSlug}</td>
                  <td className="p-3 text-xs text-slate-500" dir="ltr">{l.url}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusBadge[l.status]}`}>{l.status}</span></td>
                  <td className="p-3">{clickCounts[l.appSlug] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* الكونفيرجنزات — حالة صادقة */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-extrabold">التحويلات (المبيعات/الاشتراكات)</h2>
        <p className="mt-2 text-sm text-slate-500">
          غير متاح — لا يوجد تكامل للتحويلات حاليًا. عدّاد الكليكس هو المقياس المتاح الوحيد.
          عند ربط شبكة أفيليات (مثل Linkshare أو Impact) سيضاف هذا الجزء دون أي أرقام تقديرية.
        </p>
      </section>
    </div>
  );
}
