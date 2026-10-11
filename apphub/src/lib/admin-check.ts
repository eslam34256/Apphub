import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = createClient();

  // v43: أي فشل في التحقق = بره، مش استثناء بيكشف الصفحة
  let user = null;
  try {
    const res = await supabase.auth.getUser();
    user = res.data.user;
  } catch {
    redirect("/auth");
  }

  if (!user) redirect("/auth");

  let role: string | undefined;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role;
  } catch {
    redirect("/auth");
  }

  if (role !== "admin") {
    redirect("/");
  }

  return { user, role };
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
