"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError("املأ كل الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject,
      message: form.message
    });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
    setLoading(false);

    setTimeout(() => setSuccess(false), 5000);
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-8 text-center">
        <div className="text-6xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2">تم إرسال رسالتك!</h3>
        <p className="text-emerald-700">هنرد عليك في أقرب وقت ممكن</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold">الاسم *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="اسمك الكامل"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 transition"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">البريد الإلكتروني *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 transition"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold">رقم الهاتف</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+20 100 000 0000"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 transition"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">الموضوع</label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 transition"
          >
            <option value="general">استفسار عام</option>
            <option value="advertise">الإعلانات</option>
            <option value="suggestion">اقتراح</option>
            <option value="complaint">شكوى</option>
            <option value="partnership">شراكة</option>
            <option value="other">أخرى</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">الرسالة *</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="اكتب رسالتك هنا..."
          rows={6}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500 transition resize-none"
          required
        />
      </div>

      {error && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-700 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl gradient-brand py-4 font-bold text-white hover:scale-[1.02] transition disabled:opacity-60"
      >
        {loading ? "جاري الإرسال..." : "📨 إرسال الرسالة"}
      </button>

      <p className="text-xs text-center text-slate-500">
        بإرسال الرسالة، أنت توافق على{" "}
        <a href="/privacy" className="text-brand-600 hover:underline">
          سياسة الخصوصية
        </a>
      </p>
    </form>
  );
}