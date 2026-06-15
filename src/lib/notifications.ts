import { createClient as createBrowserClient } from "@/lib/supabase/client";

export async function getMyNotifications() {
  const supabase = createBrowserClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function markAllRead() {
  const supabase = createBrowserClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", authData.user.id)
    .eq("read", false);
}

export async function sendNotification(
  userId: string,
  title: string,
  body: string,
  link?: string
) {
  const supabase = createBrowserClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    body,
    link
  });
}