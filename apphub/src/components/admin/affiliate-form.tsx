"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** فورم إضافة رابط أفيليات جديد — بيتولد بحالة pending دايمًا (التفعيل إجراء أدمن منفصل) */
export function AffiliateForm({ dbReady }: { dbReady: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [f, setF] = useState({ provider: "", appSlug: "", destination: "", countries: "", campaign: "", sourceUrl: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          countries: f.countries ? f.countries.split(",").map(s => s.trim()).filter(Boolean) : []
        })
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg("✅ أُضيف الرابط بحالة pending — فعّله من الجدول بعد التحقق من الشبكة.");
        setF({ provider: "", appSlug: "", destination: "", countries: "", campaign: "", sourceUrl: "" });
        router.refresh();
      } else setMsg("⚠️ " + (j.error ?? "خطأ غير متوقع"));
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";
  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-extrabold">إضافة رابط أفيليات</h2>
      {!dbReady && <p className="mt-1 text-xs text-amber-700">⚠️ الجدول غير موجود بعد — شغّل docs/SQL-AFFILIATE.sql أولًا.</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <input required placeholder="المزوّد (مثال: Netflix)" value={f.provider} onChange={e => setF({ ...f, provider: e.target.value })} className={input} />
        <input placeholder="slug التطبيق (اختياري)" value={f.appSlug} onChange={e => setF({ ...f, appSlug: e.target.value })} className={input} />
        <input required placeholder="رابط العمولة (https + دومين مسموح)" dir="ltr" value={f.destination} onChange={e => setF({ ...f, destination: e.target.value })} className={input} />
        <input placeholder="الدول (مفصولة بفواصل)" value={f.countries} onChange={e => setF({ ...f, countries: e.target.value })} className={input} />
        <input placeholder="اسم الحملة (اختياري)" value={f.campaign} onChange={e => setF({ ...f, campaign: e.target.value })} className={input} />
        <input placeholder="رابط المصدر الرسمي (اختياري)" dir="ltr" value={f.sourceUrl} onChange={e => setF({ ...f, sourceUrl: e.target.value })} className={input} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button disabled={busy} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50">
          {busy ? "جارٍ الإضافة..." : "إضافة الرابط"}
        </button>
        {msg && <span className="text-xs text-slate-600">{msg}</span>}
      </div>
    </form>
  );
}
