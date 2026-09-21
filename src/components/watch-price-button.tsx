"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/contexts/language-context";

/**
 * زر «نبّهني لو السعر نزل» — يفتح ميني نموذج (إيميل + سعر مستهدف اختياري).
 * لحد ترحيل migration 004 السيرفر بيرجع 503 صادق والزر بيعرض «بتتجهز».
 */
export function WatchPriceButton({ appSlug, currentPrice }: { appSlug: string; currentPrice?: number }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState(currentPrice != null ? String(Math.floor(currentPrice * 0.9)) : "");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    setMsg("");
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          appSlug,
          country: "EG",
          targetPrice: target ? Number(target) : null
        })
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setState("error");
        setMsg(
          j.error ?? (ar ? "التنبيهات بتتجهز — جرّب لاحقًا" : "Alerts are being set up — try later")
        );
        return;
      }
      setState("done");
    } catch {
      setState("error");
      setMsg(ar ? "مفيش اتصال — جرّب لاحقًا" : "No connection — try later");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-sage-300 bg-sage-50 px-5 py-2.5 text-sm font-bold text-sage-700">
        ✅ {ar ? "هننبّهك أول ما السعر ينزل" : "We'll alert you on the next price drop"}
      </p>
    );
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border-2 border-accent-400 bg-white px-5 py-2.5 text-sm font-bold text-brand-900 hover:bg-accent-50 transition"
        >
          👁 {ar ? "نبّهني لو السعر نزل" : "Alert me on price drop"}
        </button>
      ) : (
        <form
          onSubmit={submit}
          className="max-w-md rounded-2xl border-2 border-accent-400 bg-white p-4 space-y-3 animate-fade-in"
        >
          <p className="text-sm font-bold text-brand-900">
            👁 {ar ? "تنبيه نزول السعر" : "Price-drop alert"}
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={ar ? "بريدك الإلكتروني" : "Your email"}
            dir="ltr"
            className="w-full rounded-full border border-cream-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          <input
            type="number"
            min={1}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={ar ? "سعرك المستهدف (اختياري)" : "Target price (optional)"}
            dir="ltr"
            className="w-full rounded-full border border-cream-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          <p className="text-[11px] text-charcoal-400">
            {ar
              ? "لو السعر المستهدف اتحقق هنبعتلك إيميل واحد — مفيش سبام. إلغاء التنبيه لينك واحد في الإيميل."
              : "One email when your target hits — no spam. One-link unsubscribe inside."}
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-full bg-accent-400 px-6 py-2.5 text-sm font-bold text-brand-900 hover:bg-accent-500 disabled:opacity-50"
            >
              {state === "sending"
                ? ar ? "ثانية…" : "…"
                : ar ? "فعّل التنبيه" : "Enable alert"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-cream-100 px-5 py-2.5 text-sm font-bold text-charcoal-600 hover:bg-cream-200"
            >
              {ar ? "إلغاء" : "Cancel"}
            </button>
          </div>
          {state === "error" && <p className="text-sm text-red-600">{msg}</p>}
        </form>
      )}
    </div>
  );
}
