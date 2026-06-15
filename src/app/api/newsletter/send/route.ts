import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { data: subscribers } = await supabaseAdmin.from("newsletter").select("email");
  const { data: topDeals } = await supabaseAdmin.from("deals").select("*").gt("expires_at", new Date().toISOString().split("T")[0]).order("discount", { ascending:false }).limit(5);
  if (!subscribers?.length) return NextResponse.json({ message:"مفيش مشتركين" });
  return NextResponse.json({ success:true, subscribersCount: subscribers.length, dealsCount: topDeals?.length ?? 0 });
}
