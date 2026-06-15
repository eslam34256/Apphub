import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-06-20" });
export const PLANS = {
  starter:  { name: "باقة البداية",   price: 500,  currency: "egp", description: "عرض واحد لمدة 7 أيام",         stripePriceId: process.env.STRIPE_STARTER_PRICE_ID  ?? "" },
  business: { name: "الباقة المميزة", price: 1200, currency: "egp", description: "5 عروض في الشهر + تقارير",     stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? "" },
  partner:  { name: "باقة الشركات",   price: 2500, currency: "egp", description: "عروض غير محدودة + كل المميزات", stripePriceId: process.env.STRIPE_PARTNER_PRICE_ID  ?? "" }
};
export type PlanKey = keyof typeof PLANS;
