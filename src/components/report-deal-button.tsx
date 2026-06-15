"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { reportDeal } from "@/lib/api";
import { POINTS } from "@/lib/points";
export function ReportDealButton({ dealId }: { dealId: string }) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string|null>(null);
  async function handleReport() {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) { setStatus("سجل دخول الأول"); return; }
    try { await reportDeal({ dealId, userId: authData.user.id, comment }); setStatus(`تم التبليغ — +${POINTS.REPORT_DEAL} نقطة`); setComment(""); }
    catch (err: any) { setStatus(err.message ?? "حصل خطأ"); }
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <button onClick={() => setOpen(p => !p)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{open ? "إلغاء" : "بلّغ عن عرض جديد"}</button>
      {open && (
        <div className="mt-3 space-y-2">
          <textarea className="w-full rounded-2xl border px-4 py-3" rows={2} placeholder="رابط أو تفاصيل العرض..." value={comment} onChange={e => setComment(e.target.value)} />
          <button onClick={handleReport} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">إرسال</button>
          {status && <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{status}</p>}
        </div>
      )}
    </div>
  );
}
