"use client";

import { useState, type FormEvent } from "react";

/**
 * «اطلبها دلوقتي» — طلب تنفيذ موثوق يتحوّل لـ shop_orders.
 * التنفيذ يدوي حتى البوابة المالية: بنسجّل الرغبة والبيانات ونرجع على البريد.
 * ممنوع وعد بسعر نهائي غير الرسمي اللحظي عند التواصل.
 */
export function ShopOrderButton({
  productSlug,
  productTitle,
  needsPlayerId = false
}: {
  productSlug: string;
  productTitle: string;
  needsPlayerId?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [playerRef, setPlayerRef] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [orderId, setOrderId] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    setMsg("");
    try {
      const res = await fetch("/api/shop/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug, playerRef, notes })
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setState("error");
        setMsg(j.error ?? "حصل خطأ — جرّب تاني");
        return;
      }
      setOrderId(j.orderId ?? "");
      setState("done");
    } catch {
      setState("error");
      setMsg("مفيش اتصال — جرّب لاحقًا");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-2xl border border-sage-300 bg-sage-50 px-4 py-3 text-sm font-bold text-sage-700">
        ✅ اتسجّل الطلب #{orderId} — هنتواصل لتأكيد السعر الرسمي اللحظي قبل أي خصم.
      </p>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-full bg-brand-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800 transition"
        >
          🛒 اطلب تنفيذها دلوقتي
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3 rounded-2xl border-2 border-accent-400 p-4 animate-fade-in">
          <p className="text-sm font-bold text-brand-900">طلب: {productTitle}</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني للتنفيذ"
            dir="ltr"
            className="w-full rounded-full border border-cream-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          {needsPlayerId && (
            <input
              type="text"
              value={playerRef}
              onChange={(e) => setPlayerRef(e.target.value)}
              placeholder="الـ Player ID (الأرقام بس — مش الباسورد أبدًا)"
              dir="ltr"
              className="w-full rounded-full border border-cream-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
          )}
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ملاحظة (عدد الباقات مثلًا)"
            className="w-full rounded-full border border-cream-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          <p className="text-[11px] text-charcoal-400">
            التنفيذ يدوي حاليًا حتى بوابة الدفع — الأولوية بتاريخ الطلب، والسعر يتأكد رسمي لحظة التواصل.
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={state === "sending"}
              className="flex-1 rounded-full bg-accent-400 px-5 py-2.5 text-sm font-bold text-brand-900 hover:bg-accent-500 disabled:opacity-50"
            >
              {state === "sending" ? "ثانية…" : "أكد الطلب"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-cream-100 px-4 py-2.5 text-sm font-bold text-charcoal-600 hover:bg-cream-200"
            >
              إلغاء
            </button>
          </div>
          {state === "error" && <p className="text-sm text-red-600">{msg}</p>}
        </form>
      )}
    </div>
  );
}
