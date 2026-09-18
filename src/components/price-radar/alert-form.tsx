"use client";

/**
 * نموذج تنبيهات الأسعار — حاليًا بيسجّل في جدول الـ newsletter الموجود
 * (صفر migrations). لما نبني نظام التنبيهات الكامل، نفس الفورم يتوجه
 * لجدول price_alerts — شوف التعليق أسفل.
 */

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/language-context";

export function PriceAlertForm() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error" | "duplicate">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("newsletter").insert({ email });
      if (error) {
        setStatus(error.code === "23505" ? "duplicate" : "error");
      } else {
        setStatus("done");
        setEmail("");
      }
    } catch {
      setStatus("error");
    }
  }

  /*
    TODO لما نظام التنبيهات يتطور:
    نفّذ الـ SQL ده وأبدل الجدول:
    create table price_alerts (
      id uuid default gen_random_uuid() primary key,
      email text not null,
      app_slug text,           -- null = كل التطبيقات
      country text,
      created_at timestamptz default now(),
      unique(email, app_slug, country)
    );
  */

  const t = {
    title: lang === "ar" ? "🔔 خلّيك أول من يعرف" : "🔔 Be the first to know",
    desc:
      lang === "ar"
        ? "سجّل إيميلك وهنوصلك أول ما سعر أي اشتراك من اللي بنرصدهم يتغير — الزيادة والنقصان على السواء."
        : "Get notified the moment any tracked subscription price changes — up or down.",
    placeholder: lang === "ar" ? "إيميلك" : "Your email",
    button: lang === "ar" ? "فعّل التنبيهات" : "Enable alerts",
    done: lang === "ar" ? "✅ تمام! هنوصلك أول ما سعر يتغير" : "✅ Done! We'll alert you",
    duplicate: lang === "ar" ? "أنت مسجّل بالفعل 👌" : "Already subscribed 👌",
    error: lang === "ar" ? "حصل خطأ — جرب تاني" : "Something went wrong"
  };

  if (status === "done") {
    return (
      <div className="card-elegant p-6 text-center">
        <p className="text-lg font-bold text-sage-600">{t.done}</p>
      </div>
    );
  }

  return (
    <div className="card-elegant p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h2 className="heading-elegant text-xl text-brand-900">{t.title}</h2>
          <p className="mt-1 text-sm leading-6 text-charcoal-500">{t.desc}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 md:w-64 rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary whitespace-nowrap disabled:opacity-60"
          >
            {status === "loading" ? "..." : t.button}
          </button>
        </form>
      </div>
      {(status === "duplicate" || status === "error") && (
        <p className={`mt-2 text-sm font-bold ${status === "duplicate" ? "text-accent-600" : "text-red-600"}`}>
          {status === "duplicate" ? t.duplicate : t.error}
        </p>
      )}
    </div>
  );
}
