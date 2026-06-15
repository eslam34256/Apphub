import { createClient } from "@/lib/supabase/server";

export default async function AdminLogsPage() {
  const supabase = createClient();
  const { data: logs } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">📋 سجل النشاطات</h1>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {logs && logs.length > 0 ? (
          <div className="space-y-2">
            {logs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between border-b py-3">
                <div>
                  <p className="font-bold text-sm">{log.action}</p>
                  <p className="text-xs text-slate-500">
                    {log.entity_type} • {log.entity_id?.slice(0, 8)}
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(log.created_at).toLocaleString("ar-EG")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">مفيش سجلات لسه</p>
        )}
      </div>
    </div>
  );
}