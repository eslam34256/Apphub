"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function VerifyBrandButton({ brandId, isVerified }: { brandId: string; isVerified: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("brands")
      .update({ verified: !isVerified })
      .eq("id", brandId);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-lg px-3 py-1 text-xs ${
        isVerified
          ? "bg-rose-100 text-rose-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {loading ? "..." : isVerified ? "إلغاء التوثيق" : "✓ توثيق"}
    </button>
  );
}