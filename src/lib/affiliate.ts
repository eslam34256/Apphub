import { createClient } from "@/lib/supabase/client";
export type AffiliateLink = { appSlug: string; url: string; source: "amazon"|"noon"|"direct"|"other" };
export const affiliateLinks: Record<string, AffiliateLink> = {
  netflix:  { appSlug: "netflix",  url: "https://www.netflix.com/?ref=apphub",  source: "direct" },
  amazon:   { appSlug: "amazon",   url: "https://amzn.to/apphub",               source: "amazon" },
  noon:     { appSlug: "noon",     url: "https://www.noon.com/?ref=apphub",     source: "noon"   },
  coursera: { appSlug: "coursera", url: "https://www.coursera.org/?ref=apphub", source: "direct" },
  duolingo: { appSlug: "duolingo", url: "https://www.duolingo.com/?ref=apphub", source: "direct" }
};
export function getAffiliateLink(slug: string): string {
  return affiliateLinks[slug]?.url ?? "#";
}
export async function trackAffiliateClick(appSlug: string) {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  await supabase.from("affiliate_clicks").insert({ app_slug: appSlug, user_id: authData?.user?.id ?? null, ref: "apphub" });
}
