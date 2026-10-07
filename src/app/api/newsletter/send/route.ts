import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) return NextResponse.json({ ok: false, error: "الخدمة مش مهيأة (envs ناقصة)" }, { status: 503 });
  const { data: subscribers } = await supabaseAdmin.from("newsletter").select("email");
  const { data: topDeals } = await supabaseAdmin.from("deals").select("*").gt("expires_at", new Date().toISOString().split("T")[0]).order("discount", { ascending:false }).limit(5);
  if (!subscribers?.length) return NextResponse.json({ message:"مفيش مشتركين" });
  return NextResponse.json({ success:true, subscribersCount: subscribers.length, dealsCount: topDeals?.length ?? 0 });
}
