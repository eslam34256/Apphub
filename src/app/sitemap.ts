import { MetadataRoute } from "next";
import { apps as staticApps } from "@/data/apps";
import { comparisons } from "@/data/comparisons";
import { bestCombos } from "@/lib/best";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // احذف أي / من نهاية الـ URL
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app";
  const baseUrl = rawUrl.replace(/\/$/, ""); // يشيل / من الآخر لو موجودة
  
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/apps`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/compare-hub`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/price-radar`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/price-index`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/data`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/disclosure`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/uc-radar`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/telecom-radar`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/ai-radar`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/best`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/deals`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/ai`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/business`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 }
  ];

  let dbApps: any[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("managed_apps")
      .select("slug, updated_at")
      .eq("is_active", true);
    dbApps = data ?? [];
  } catch (err) {
    console.error("Sitemap DB error:", err);
  }

  const appPages: MetadataRoute.Sitemap = dbApps.map((app: any) => ({
    url: `${baseUrl}/apps/${app.slug}`,
    lastModified: new Date(app.updated_at || now),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const dbSlugs = new Set(dbApps.map((a) => a.slug));
  const staticAppPages: MetadataRoute.Sitemap = staticApps
    .filter((a) => !dbSlugs.has(a.slug))
    .map((app) => ({
      url: `${baseUrl}/apps/${app.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6
    }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: new Date(c.updatedAt || now),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  // صفحات «الأفضل في البلد» — 45 صفحة SEO برمجية
  const bestPages: MetadataRoute.Sitemap = bestCombos().map((combo) => ({
    url: `${baseUrl}/best/${combo.category}/${combo.country}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [...staticPages, ...comparisonPages, ...bestPages, ...appPages, ...staticAppPages];
}