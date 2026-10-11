import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deals as staticDeals } from "@/data/deals";

/** عروض الموبايل — DB أولاً، و fallback للستاتيك (آمنة بدون env) */
export async function GET() {
  let dbDeals: unknown[] = [];
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin.from("deals").select("*").gt("expires_at", new Date().toISOString().split("T")[0]).order("created_at", { ascending: false }).limit(20);
      dbDeals = data ?? [];
    } catch {
      dbDeals = [];
    }
  }
  const combined = [...dbDeals, ...staticDeals.slice(0, 5).map(d => ({ ...d, expires_at: d.expiresAt, created_at: new Date().toISOString() }))];
  return NextResponse.json({ success: true, total: combined.length, data: combined });
}
