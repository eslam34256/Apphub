import { createAdminClient } from "@/lib/supabase/admin";

/**
 * v43 — لوحة رؤى صاحب المشروع: أرقام حقيقية فقط عبر service_role.
 * مفيش اختلاق: لو جدول مش موجود أو env ناقصة → حالة إعداد صادقة بدل صفر مضلل.
 */
export const dynamic = "force-dynamic";

export default async function AdminInsightsPage({ searchParams }: { searchParams: { days?: string } }) {
  const days = Math.min(Math.max(parseInt(searchParams.days ?? "30", 10) || 30, 1), 365);
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const admin = createAdminClient();

  if (!admin) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-lg font-extrabold text-amber-800">📊 الرؤى لسه بتتجهز</p>
        <p className="mt-2 text-sm text-amber-700">
          محتاجة SUPABASE_SERVICE_ROLE_KEY في بيئة التشغيل + تنفيذ docs/SQL-COMMERCE.sql —
          ساعتها الأرقام الحقيقية هتظهر هنا تلقائيًا.
        </p>
      </div>
    );
  }

  const [events, clicks, waitlist, newsletter] = await Promise.all([
    admin.from("commerce_events").select("event, target").gte("created_at", since).limit(5000),
    admin.from("affiliate_clicks").select("app_slug").gte("created_at", since).limit(5000),
    admin.from("waitlist").select("interest, created_at").limit(1000),
    admin.from("newsletter").select("email", { count: "exact", head: true })
  ]);

  const agg = (rows: { key: string }[]) => {
    const m: Record<string, number> = {};
    for (const r of rows) m[r.key] = (m[r.key] ?? 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };
  const evAgg = agg((events.data ?? []).map(r => ({ key: `${r.event} → ${r.target}` })));
  const clAgg = agg((clicks.data ?? []).map(r => ({ key: r.app_slug })));
  const leads = (waitlist.data ?? []) as { interest: string; created_at: string }[];
  const advLeads = leads.filter(l => l.interest === "advertiser").length;
  const bizLeads = leads.filter(l => l.interest === "business-lead").length;
  const clicksTotal = (clicks.data ?? []).length;
  const eventsTotal = (events.data ?? []).length;
  const max = Math.max(1, ...evAgg.map(([, n]) => n));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">📊 رؤى البيزنس</h1>
          <p className="text-sm text-slate-500">أرقام حقيقية فقط — آخر {days} يوم</p>
        </div>
        <div className="flex gap-2 text-xs font-bold">
          {[7, 30, 90].map(d => (
            <a key={d} href={`/admin/insights?days=${d}`} className={`rounded-full px-4 py-2 ${d === days ? "bg-brand-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
              {d} يوم
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card label="كليكات خارجية" value={eventsTotal} icon="🔗" />
        <Card label="كليكات أفيليات" value={clicksTotal} icon="💸" />
        <Card label="استعلامات معلنيين" value={advLeads} icon="📢" />
        <Card label="ليدات شركات" value={bizLeads} icon="💼" />
        <Card label="مشتركي النشرة" value={newsletter.count ?? 0} icon="📬" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-extrabold">أكثر الأهداف كليكات</h2>
        {evAgg.length === 0 ? (
          <p className="text-sm text-slate-500">لسه مفيش كليكات مسجلة في الفترة دي — طبيعي في البداية.</p>
        ) : (
          <div className="space-y-2">
            {evAgg.slice(0, 10).map(([k, n]) => (
              <div key={k} className="flex items-center gap-3 text-xs">
                <span className="w-56 truncate font-bold text-slate-700">{k}</span>
                <div className="h-3 flex-1 rounded-full bg-cream-100">
                  <div className="h-3 rounded-full bg-brand-500" style={{ width: `${Math.round((n / max) * 100)}%` }} />
                </div>
                <span className="w-8 text-left font-extrabold text-slate-800">{n}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {clAgg.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-extrabold">كليكات الأفيليات حسب التطبيق</h2>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {clAgg.map(([k, n]) => (
              <span key={k} className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{k}: {n}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
      <p className="text-xl">{icon}</p>
      <p className="mt-1 text-2xl font-extrabold text-brand-700">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
