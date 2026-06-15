"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteCategoryButton({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`متأكد من حذف "${categoryName}"؟`)) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", categoryId);
    
    if (error) {
      alert(error.message);
    } else {
      router.refresh();
    }
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