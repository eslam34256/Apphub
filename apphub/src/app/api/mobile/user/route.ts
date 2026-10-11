import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"غير مسجل" }, { status:401 });
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: subs } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending:false });
  const { data: reviews } = await supabase.from("reviews").select("*").eq("user_id", user.id);
  return NextResponse.json({ success:true, data: { id:user.id, email:user.email, profile, subscriptions:subs??[], reviews:reviews??[] } });
}
