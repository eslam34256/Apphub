import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-06-20"
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await supabaseAdmin
        .from("payments")
        .update({ status: "paid" })
        .eq("stripe_session", session.id);

      await supabaseAdmin
        .from("profiles")
        .update({ role: "advertiser" })
        .eq("id", userId);

      await supabaseAdmin.from("notifications").insert({
        user_id: userId,
        title: "تم تفعيل الباقة",
        body: `تم تفعيل باقة ${plan} بنجاح`,
        link: "/advertiser-dashboard"
      });
    }
  }

  return NextResponse.json({ received: true });
}