"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("متأكد من حذف التعليق؟")) return;

    setLoading(true);
    const supabase = createClient();
    await supabase.from("comments").delete().eq("id", commentId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-rose-100 px-3 py-1 text-xs text-rose-700"
    >
      {loading ? "..." : "🗑️ حذف"}
    </button>
  );
}