"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdActions({ adId, currentStatus }: { adId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("brand_ads")
      .update({ status: newStatus })
      .eq("id", adId);

    if (error) {
      alert(error.message);
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("متأكد من حذف الإعلان؟")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("brand_ads").delete().eq("id", adId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-1">
      {currentStatus === "pending" && (
        <>
          <button
            onClick={() => updateStatus("active")}
            disabled={loading}
            className="rounded-lg bg-emerald-100 px-2 py-1 text-xs text-emerald-700"
          >
            ✓ موافقة
          </button>
          <button
            onClick={() => updateStatus("rejected")}
            disabled={loading}
            className="rounded-lg bg-rose-100 px-2 py-1 text-xs text-rose-700"
          >
            ✕ رفض
          </button>
        </>
      )}
      {currentStatus === "active" && (
        <button
          onClick={() => updateStatus("paused")}
          disabled={loading}
          className="rounded-lg bg-amber-100 px-2 py-1 text-xs text-amber-700"
        >
          ⏸ إيقاف
        </button>
      )}
      {currentStatus === "paused" && (
        <button
          onClick={() => updateStatus("active")}
          disabled={loading}
          className="rounded-lg bg-emerald-100 px-2 py-1 text-xs text-emerald-700"
        >
          ▶ تشغيل
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg bg-slate-100 px-2 py-1 text-xs"
      >
        🗑️
      </button>
    </div>
  );
}