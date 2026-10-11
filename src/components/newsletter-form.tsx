"use client";

import { useState } from "react";

import { useLanguage } from "@/contexts/language-context";

export function NewsletterForm() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // v41 (Master Audit P1): تحقق شكل البريد في الكلاينت قبل الرحلة للـ DB
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(lang === "ar" ? "اكتب بريد إلكتروني صحيح الأول" : "Enter a valid email first");
      return;
    }

    setLoading(true);
    setError(null);

    // v42: التسجيل بقى server-side (validation + rate limiting في الروت)
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const j = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setError(lang === "ar" ? "محاولات كتير — جرّب بعد دقيقة" : "Too many attempts — try in a minute");
      } else if (!res.ok && !j.already) {
        setError(j.error ?? (lang === "ar" ? "حصل خطأ — جرّب لاحقًا" : "Something went wrong"));
      } else {
        setSuccess(true);
        setEmail("");
      }
    } catch {
      setError(lang === "ar" ? "مفيش اتصال — جرّب لاحقًا" : "No connection — try later");
    }

    setLoading(false);
  }

  return (
    <div className="rounded-3xl bg-gradient-navy p-8 md:p-12 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="heading-elegant text-3xl md:text-4xl mb-3">
          {lang === "ar" ? "اشترك في النشرة الأسبوعية" : "Subscribe to Newsletter"}
        </h2>
        <p className="text-white/80 mb-8">
          {lang === "ar"
            ? "هنوصلك أفضل 5 عروض وأحدث التطبيقات كل أسبوع"
            : "Get the best 5 deals and latest apps every week"}
        </p>

        {success ? (
          <div className="bg-sage-500/20 border border-sage-400 rounded-2xl p-6">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-lg font-bold">
              {lang === "ar" ? "تم الاشتراك بنجاح!" : "Subscribed Successfully!"}
            </p>
            <p className="text-sm text-white/80 mt-1">
              {lang === "ar"
                ? "هنبعتلك أول نشرة قريبًا"
                : "We'll send you the first newsletter soon"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === "ar" ? "بريدك الإلكتروني" : "Your email address"}
              required
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-6 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-accent-400 focus:bg-white/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
            >
              {loading
                ? lang === "ar"
                  ? "جاري الاشتراك..."
                  : "Subscribing..."
                : lang === "ar"
                ? "اشترك"
                : "Subscribe"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-sm text-rose-300">{error}</p>
        )}
      </div>
    </div>
  );
}