"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** v43 — نشر/إيقاف عرض بدون حذف (نفس نمط أزرار الأدمن الموجودة) */
export function ToggleDealButton({ dealId, active, title }: { dealId: string; active: boolean; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("managed_deals").update({ is_active: !active }).eq("id", dealId);
    if (error) alert(error.message);
    else router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-lg px-3 py-1 text-xs disabled:opacity-60 ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
      title={title}
    >
      {loading ? "..." : active ? "🟢 منشور" : " موقوف"}
    </button>
  );
}
