import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { deals as staticDeals } from "@/data/deals";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function GET() {
  const { data: dbDeals } = await supabaseAdmin.from("deals").select("*").gt("expires_at", new Date().toISOString().split("T")[0]).order("created_at", { ascending:false }).limit(20);
  const combined = [...(dbDeals??[]), ...staticDeals.slice(0,5).map(d => ({ ...d, expires_at:d.expiresAt, created_at:new Date().toISOString() }))];
  return NextResponse.json({ success:true, total:combined.length, data:combined });
}
