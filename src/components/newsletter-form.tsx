"use client";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState("");
  async function handleSubmit() {
    if (!email) return;
    setStatus("loading");
    try { await subscribeNewsletter(email); setStatus("success"); setMessage("اشتركت بنجاح! هنبعتلك أفضل العروض كل أسبوع"); setEmail(""); }
    catch (err: any) { setStatus("error"); setMessage(err.message ?? "حصل خطأ"); }
  }
  return (
    <div className="rounded-3xl bg-slate-900 p-6 text-white">
      <h2 className="mb-2 text-xl font-bold">اشترك في النشرة الأسبوعية</h2>
      <p className="mb-4 text-slate-300">هنوصلك أفضل 5 عروض وأحدث التطبيقات كل أسبوع</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-brand-500" placeholder="بريدك الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} />
        <button disabled={status==="loading"} onClick={handleSubmit} className="rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white disabled:opacity-60">{status==="loading" ? "جاري..." : "اشترك"}</button>
      </div>
      {message && <p className={`mt-3 rounded-xl px-4 py-3 ${status==="success" ? "bg-emerald-900 text-emerald-100" : "bg-rose-900 text-rose-100"}`}>{message}</p>}
    </div>
  );
}
