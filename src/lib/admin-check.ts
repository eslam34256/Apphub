import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/auth");
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  if (profile?.role !== "admin") {
    redirect("/");
  }
  
  return { user, role: profile.role };
}

export async function logAdminAction(
  action: string,
  entityType?: string,
  entityId?: string,
  details?: any
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;
  
  await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details
  });
}
