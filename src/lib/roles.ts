import { createClient } from "@/lib/supabase/server";
export type UserRole = "user" | "advertiser" | "admin";
export async function getUserRole(): Promise<UserRole> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "user";
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return (data?.role as UserRole) ?? "user";
}
export async function requireRole(role: UserRole): Promise<boolean> {
  const current = await getUserRole();
  const hierarchy: UserRole[] = ["user", "advertiser", "admin"];
  return hierarchy.indexOf(current) >= hierarchy.indexOf(role);
}
