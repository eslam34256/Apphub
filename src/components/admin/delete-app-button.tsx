"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteAppButton({ appId, appName }: { appId: string; appName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`متأكد من حذف "${appName}"؟`)) return;

    setLoading(true);
    const supabase = createClient();
    await supabase.from("managed_apps").delete().eq("id", appId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-rose-100 px-3 py-1 text-xs text-rose-700 disabled:opacity-60"
    >
      {loading ? "..." : "حذف"}
    </button>
  );
}
