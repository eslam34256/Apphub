"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UserActions({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function changeRole(newRole: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      value={currentRole || "user"}
      onChange={(e) => changeRole(e.target.value)}
      disabled={loading}
      className="rounded-lg border px-2 py-1 text-xs"
    >
      <option value="user">مستخدم</option>
      <option value="advertiser">معلن</option>
      <option value="admin">أدمن</option>
    </select>
  );
}
