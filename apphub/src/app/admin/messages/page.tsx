import { createClient } from "@/lib/supabase/server";
import { MessageActions } from "@/components/admin/message-actions";

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const stats = {
    total: messages?.length ?? 0,
    new: messages?.filter((m: any) => m.status === "new").length ?? 0,
    replied: messages?.filter((m: any) => m.status === "replied").length ?? 0
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">📨 رسائل التواصل</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatBox label="الإجمالي" value={stats.total} color="blue" />
        <StatBox label="جديد" value={stats.new} color="amber" />
        <StatBox label="تم الرد" value={stats.replied} color="emerald" />
      </div>

      <div className="space-y-3">
        {(messages ?? []).map((msg: any) => (
          <div
            key={msg.id}
            className={`rounded-2xl border-2 p-5 shadow-sm ${
              msg.status === "new" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{msg.name}</span>
                  <StatusBadge status={msg.status} />
                </div>
                <p className="text-sm text-slate-600">
                  📧 {msg.email}
                  {msg.phone && ` • 📞 ${msg.phone}`}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {msg.subject} • {new Date(msg.created_at).toLocaleString("ar-EG")}
                </p>
              </div>
              <MessageActions messageId={msg.id} currentStatus={msg.status} />
            </div>
            <p className="text-slate-700 mt-3 whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}

        {(!messages || messages.length === 0) && (
          <div className="rounded-3xl border border-dashed p-12 text-center text-slate-500">
            <p className="text-4xl mb-2">📭</p>
            <p>مفيش رسائل لسه</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700"
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
    new: { label: "جديد", color: "bg-amber-100 text-amber-700" },
    read: { label: "مقروء", color: "bg-blue-100 text-blue-700" },
    replied: { label: "تم الرد", color: "bg-emerald-100 text-emerald-700" },
    closed: { label: "مغلق", color: "bg-slate-100 text-slate-700" }
  };
  const cfg = config[status] || config.new;
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}