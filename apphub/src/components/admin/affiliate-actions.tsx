"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** أزرار حالة الرابط (تفعيل/إيقاف/رفض) — بتمر على /api/admin/affiliate اللي بيتحقق من الدور */
export function AffiliateActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/affiliate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next })
      });
      if (res.ok) router.refresh();
      else alert("تعديل الحالة فشل: " + (await res.json().catch(() => ({ error: "خطأ" })).then(j => j.error ?? "خطأ")));
    } finally {
      setBusy(false);
    }
  }

  const btn = "rounded-lg px-2.5 py-1 text-xs font-bold transition disabled:opacity-50";
  return (
    <div className="flex gap-1.5">
      {status !== "active" && (
        <button disabled={busy} onClick={() => setStatus("active")} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>تفعيل</button>
      )}
      {status === "active" && (
        <button disabled={busy} onClick={() => setStatus("paused")} className={`${btn} bg-amber-500 text-white hover:bg-amber-600`}>إيقاف مؤقت</button>
      )}
      {status !== "rejected" && (
        <button disabled={busy} onClick={() => setStatus("rejected")} className={`${btn} bg-red-100 text-red-700 hover:bg-red-200`}>رفض</button>
      )}
    </div>
  );
}
