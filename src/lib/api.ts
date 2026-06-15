import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { ReviewItem, SubscriptionItem } from "./types";

export async function getReviewsForApp(appSlug: string): Promise<ReviewItem[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("reviews").select("*").eq("app_slug", appSlug).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ReviewItem[];
}
export async function createReview(payload: { appSlug: string; userId: string; userName: string; rating: number; comment: string }) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("reviews").insert({ app_slug: payload.appSlug, user_id: payload.userId, user_name: payload.userName, rating: payload.rating, comment: payload.comment }).select().single();
  if (error) throw error;
  return data;
}
export async function subscribeNewsletter(email: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("newsletter").insert({ email }).select().single();
  if (error) throw error;
  return data;
}
export async function reportDeal(payload: { dealId: string; userId: string; comment: string }) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("deal_reports").insert({ deal_id: payload.dealId, user_id: payload.userId, comment: payload.comment }).select().single();
  if (error) throw error;
  return data;
}
export async function createSubscription(payload: Omit<SubscriptionItem, "id" | "createdAt">) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("subscriptions").insert({ user_id: payload.userId, app_name: payload.appName, plan: payload.plan, price: payload.price, cycle: payload.cycle }).select().single();
  if (error) throw error;
  return data as SubscriptionItem;
}
export async function getSubscriptions(userId: string): Promise<SubscriptionItem[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubscriptionItem[];
}
export async function deleteSubscription(id: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  if (error) throw error;
}
