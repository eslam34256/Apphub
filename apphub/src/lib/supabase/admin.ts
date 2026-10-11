import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client كسول وآمن للبيئات بلا envs (v33.2):
 * المديول-scope createClient(process.env.X!) بيقع في build/page-data
 * لو المتغيرات مش موجودة — فالستدعاء دايماً جوه الـ handler وبيتراجع بـ null محترم.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}
