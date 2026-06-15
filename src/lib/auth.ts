import { createClient as createBrowserClient } from "@/lib/supabase/client";
export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserClient();
  return supabase.auth.signInWithPassword({ email, password });
}
export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = createBrowserClient();
  return supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
}
export async function signInWithGoogle() {
  const supabase = createBrowserClient();
  return supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` } });
}
export async function signOut() {
  const supabase = createBrowserClient();
  return supabase.auth.signOut();
}
