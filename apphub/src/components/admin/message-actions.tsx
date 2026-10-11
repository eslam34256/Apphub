"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MessageActions({ messageId, currentStatus }: { messageId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("contact_messages")
      .update({ status: newStatus })
      .eq("id", messageId);
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("متأكد من حذف الرسالة؟")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("contact_messages").delete().eq("id", messageId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-1">
      <select
        value={currentStatus}
        onChange={(e) => updateStatus(e.target.value)}
        disabled={loading}
        className="rounded-lg border px-2 py-1 text-xs"
      >
        <option value="new">جديد</option>
        <option value="read">مقروء</option>
        <option value="replied">تم الرد</option>
        <option value="closed">مغلق</option>
      </select>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg bg-rose-100 px-2 py-1 text-xs text-rose-700"
      >
        🗑️
      </button>
    </div>
  );
}