"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * تسجيل الخروج — لازم السيرفر client (cookies-based) مش البروزر client.
 * v29 bug fix: النسخة القديمة كانت بتستدعي createBrowserClient جوه server action —
 * فـ signOut العملية كانت بتفشل بصمت (مفيش document/cookies browser APIs على السيرفر)،
 * والمستخدم بيعمل redirect لكنه بيفضل ساجل دخوله.
 */
export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
