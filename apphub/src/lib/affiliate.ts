import { createClient } from "@/lib/supabase/client";

/**
 * v44 — معمارية الأفيليات: روابط معتمدة فقط تتوسم كعمولة.
 * الحالة pending = رابط إحالة تجريبي غير معتمد → يعرض ك링크 عادي بدون شارة عمولة.
 * الاعتماد بيتم من الأدمن (DB affiliate_links) بعد القبول في الشبكات — docs/SQL-AFFILIATE.sql
 */
export type AffiliateStatus = "pending" | "active" | "paused" | "rejected";

export type AffiliateLink = {
  appSlug: string;
  url: string;
  source: "amazon" | "noon" | "direct" | "other";
  provider?: string;
  status: AffiliateStatus;
  campaign?: string;
  sourceUrl?: string;
  verifiedAt?: string;
};

/** روابط يدوية أولية — كلها pending لحد ما ييجي اعتماد شبكة حقيقي (ممنوع اختلاق شراكات) */
export const affiliateLinks: Record<string, AffiliateLink> = {
  netflix:  { appSlug: "netflix",  url: "https://www.netflix.com/?ref=apphub",  source: "direct", status: "pending" },
  amazon:   { appSlug: "amazon",   url: "https://amzn.to/apphub",               source: "amazon", status: "pending" },
  noon:     { appSlug: "noon",     url: "https://www.noon.com/?ref=apphub",     source: "noon",   status: "pending" },
  coursera: { appSlug: "coursera", url: "https://www.coursera.org/?ref=apphub", source: "direct", status: "pending" },
  duolingo: { appSlug: "duolingo", url: "https://www.duolingo.com/?ref=apphub", source: "direct", status: "pending" }
};

/** Allowlist دومينات الوجهات — مفيش open redirect: الوجهة لازم تكون من سجل معتمد ودومين مسموح */
export const ALLOWED_AFFILIATE_HOSTS = [
  "www.netflix.com", "netflix.com",
  "amzn.to", "www.amazon.com", "amazon.com", "www.amazon.eg",
  "www.noon.com", "noon.com",
  "www.coursera.org", "coursera.org",
  "www.duolingo.com", "duolingo.com"
];

export function isSafeDestination(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return ALLOWED_AFFILIATE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export function getAffiliateLink(slug: string): string {
  return affiliateLinks[slug]?.url ?? "#";
}

export function getAffiliateEntry(slug: string): AffiliateLink | undefined {
  return affiliateLinks[slug];
}

export async function trackAffiliateClick(appSlug: string) {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  await supabase.from("affiliate_clicks").insert({ app_slug: appSlug, user_id: authData?.user?.id ?? null, ref: "apphub" });
}
