"use client";

import { useState, type FormEvent } from "react";

/**
 * استمارة تحديث سعر رسمي — للشركات والعلامات.
 * التقديم يبقى pending وبيتراجع يدويًا قبل أي ظهور في الرادارات.
 */
export function BrandUpdateForm() {
  const [form, setForm] = useState({
    company: "",
    contactEmail: "",
    planName: "",
    oldPrice: "",
    newPrice: "",
    currency: "EGP",
    evidenceUrl: "",
    note: ""
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    setMsg("");
    try {
      const res = await fetch("/api/brand-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          contactEmail: form.contactEmail,
          planName: form.planName,
          oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
          newPrice: Number(form.newPrice),
          currency: form.currency,
          evidenceUrl: form.evidenceUrl,
          note: form.note
        })
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setState("error");
        setMsg(j.error ?? "حصل خطأ — جرّب تاني");
        return;
      }
      setState("done");
      setMsg(j.message ?? "وصل الطلب ✅");
    } catch {
      setState("error");
      setMsg("مفيش اتصال — جرّب لاحقًا");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-2xl border border-sage-300 bg-sage-50 px-5 py-4 text-sm font-bold text-sage-700">
        ✅ {msg}
      </p>
    );
  }

  const input = "w-full rounded-2xl border border-cream-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-charcoal-500">اسم الشركة *</label>
          <input required value={form.company} onChange={set("company")} placeholder="مثال: Midasbuy" className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-charcoal-500">بريد العمل *</label>
          <input required type="email" dir="ltr" value={form.contactEmail} onChange={set("contactEmail")} placeholder="name@company.com" className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-charcoal-500">اسم الخطة/الباقة *</label>
          <input required value={form.planName} onChange={set("planName")} placeholder="مثال: UC ٦٦٠" className={input} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="mb-1 block text-xs font-bold text-charcoal-500">العملة</label>
            <select value={form.currency} onChange={set("currency")} className={input}>
              <option value="EGP">ج</option>
              <option value="SAR">ر.س</option>
              <option value="AED">د.إ</option>
              <option value="USD">$</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="mb-1 block text-xs font-bold text-charcoal-500">السعر القديم</label>
            <input type="number" step="0.01" min="0" dir="ltr" value={form.oldPrice} onChange={set("oldPrice")} placeholder="—" className={input} />
          </div>
          <div className="col-span-1">
            <label className="mb-1 block text-xs font-bold text-charcoal-500">الجديد *</label>
            <input required type="number" step="0.01" min="0" dir="ltr" value={form.newPrice} onChange={set("newPrice")} placeholder="0.00" className={input} />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold text-charcoal-500">رابط الإعلان الرسمي (الدليل) *</label>
        <input required type="url" dir="ltr" value={form.evidenceUrl} onChange={set("evidenceUrl")} placeholder="https://..." className={input} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold text-charcoal-500">ملاحظة إضافية</label>
        <textarea value={form.note} onChange={set("note")} rows={2} className={input} placeholder="مثال: يسري من ١ أكتوبر" />
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full rounded-full bg-accent-400 px-6 py-3 text-sm font-bold text-brand-900 hover:bg-accent-500 disabled:opacity-50"
      >
        {state === "sending" ? "بيبعت…" : "قدّم التحديث الرسمي"}
      </button>
      {state === "error" && <p className="text-sm text-red-600">{msg}</p>}
    </form>
  );
}
