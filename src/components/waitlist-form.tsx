"use client";

import { useState, type FormEvent } from "react";

export function WaitlistForm({ interest }: { interest: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    try {
      const res = await fetch("/api/shop/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest })
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setStatus("error");
        setMsg(j.error ?? "حصل خطأ — جرب تاني");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMsg("مفيش اتصال — جرب لاحقًا");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-2xl border border-sage-300 bg-sage-50 px-5 py-3 text-sm font-bold text-sage-700">
        ✅ اتسجلت! هتوصلك دعوة أول دفعة على بريدك.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="بريدك الإلكتروني"
        className="flex-1 rounded-full border border-cream-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
        dir="ltr"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-accent-400 px-6 py-3 text-sm font-bold text-brand-900 hover:bg-accent-500 disabled:opacity-50"
      >
        {status === "sending" ? "ثانية…" : "سجّلني"}
      </button>
      {status === "error" && <p className="text-sm text-red-600 w-full">{msg}</p>}
    </form>
  );
}
