import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, PlanKey } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
const supabaseAdmin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`post:pay-session:${ip}`, 6, 60_000)) {
    return NextResponse.json({ ok: false, error: "محاولات كتير متتالية — جرّب بعد دقيقة" }, { status: 429 });
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"غير مسجل" }, { status:401 });
  const { plan } = await request.json() as { plan: PlanKey };
  const selectedPlan = PLANS[plan];
  if (!selectedPlan) return NextResponse.json({ error:"باقة غير صحيحة" }, { status:400 });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: selectedPlan.currency, product_data: { name: selectedPlan.name, description: selectedPlan.description }, unit_amount: selectedPlan.price * 100 }, quantity:1 }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertiser?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertiser/upgrade?canceled=1`,
      metadata: { userId: user.id, plan }
    });
    await supabaseAdmin.from("payments").insert({ user_id:user.id, stripe_session:session.id, plan, amount:selectedPlan.price, currency:selectedPlan.currency, status:"pending" });
    return NextResponse.json({ url: session.url });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status:500 }); }
}
