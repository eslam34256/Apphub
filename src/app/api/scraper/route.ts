import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const SEED_DEALS = [
  { title:"خصم 35% على طلبات أونلاين", brand:"Amazon Egypt", category:"tech", discount:35, source_url:"https://amazon.eg/deals", expires_at: new Date(Date.now()+7*24*60*60*1000).toISOString().split("T")[0] },
  { title:"وفر 20% على سلة البقالة", brand:"Noon", category:"food", discount:20, source_url:"https://noon.com/egypt-ar/deals", expires_at: new Date(Date.now()+3*24*60*60*1000).toISOString().split("T")[0] },
  { title:"خصم 50% على ملابس الشتاء", brand:"Jumia", category:"fashion", discount:50, source_url:"https://jumia.com.eg/fashion", expires_at: new Date(Date.now()+5*24*60*60*1000).toISOString().split("T")[0] }
];
export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  try {
    const { error } = await supabaseAdmin.from("scraped_deals").insert(SEED_DEALS);
    if (error) throw error;
    return NextResponse.json({ success:true, count: SEED_DEALS.length });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status:500 }); }
}
