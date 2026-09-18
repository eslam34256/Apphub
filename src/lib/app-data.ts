import { cache } from "react";
import { apps as staticApps } from "@/data/apps";
import { createClient } from "@/lib/supabase/server";
import { AppItem } from "@/lib/types";

/**
 * تحميل تطبيق واحد بالـ slug — على مستوى السيرفر.
 * React cache بتمنع تكرار الاستعلام: generateMetadata و page
 * بيشتركوا في نفس النتيجة خلال نفس الريكوست.
 *
 * الأولوية: قاعدة البيانات (لو الأدمن ضاف/عدّل) ← ثم البيانات الثابتة.
 */
export const getAppBySlug = cache(
  async (slug: string): Promise<AppItem | null> => {
    try {
      const supabase = createClient();
      const { data: dbApp } = await supabase
        .from("managed_apps")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (dbApp) {
        return {
          id: `db-${dbApp.id}`,
          slug: dbApp.slug,
          name: dbApp.name,
          icon: dbApp.icon,
          category: dbApp.category,
          shortDescription: dbApp.short_description || "",
          description: dbApp.description || "",
          rating: parseFloat(dbApp.rating) || 0,
          pros: Array.isArray(dbApp.pros) ? dbApp.pros : [],
          cons: Array.isArray(dbApp.cons) ? dbApp.cons : [],
          countries: Array.isArray(dbApp.countries) ? dbApp.countries : [],
          pricing: Array.isArray(dbApp.pricing) ? dbApp.pricing : [],
          tags: Array.isArray(dbApp.tags) ? dbApp.tags : [],
          businessUse: Array.isArray(dbApp.business_use)
            ? dbApp.business_use
            : [],
          googlePlay: dbApp.google_play || undefined,
          appStore: dbApp.app_store || undefined,
          website: dbApp.website || undefined
        };
      }
    } catch {
      // قاعدة البيانات غير متاحة (بناء محلي بدون env مثلاً) — نكمل بالثابتة
    }

    return staticApps.find((a) => a.slug === slug) ?? null;
  }
);

/** كل الـ slugs المتاحة — للاستخدام في الـ sitemap والروابط الداخلية */
export async function getAllAppSlugs(): Promise<string[]> {
  const slugs = new Set(staticApps.map((a) => a.slug));
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("managed_apps")
      .select("slug")
      .eq("is_active", true);
    data?.forEach((a: { slug: string }) => slugs.add(a.slug));
  } catch {}
  return [...slugs];
}

/** تحويل صف managed_apps من القاعدة لشكل AppItem */
function mapDbApp(dbApp: any): AppItem {
  return {
    id: `db-${dbApp.id}`,
    slug: dbApp.slug,
    name: dbApp.name,
    icon: dbApp.icon,
    category: dbApp.category,
    subcategory: dbApp.subcategory || undefined,
    shortDescription: dbApp.short_description || "",
    description: dbApp.description || "",
    rating: parseFloat(dbApp.rating) || 0,
    pros: Array.isArray(dbApp.pros) ? dbApp.pros : [],
    cons: Array.isArray(dbApp.cons) ? dbApp.cons : [],
    countries: Array.isArray(dbApp.countries) ? dbApp.countries : [],
    pricing: Array.isArray(dbApp.pricing) ? dbApp.pricing : [],
    tags: Array.isArray(dbApp.tags) ? dbApp.tags : [],
    businessUse: Array.isArray(dbApp.business_use) ? dbApp.business_use : [],
    googlePlay: dbApp.google_play || undefined,
    appStore: dbApp.app_store || undefined,
    website: dbApp.website || undefined
  };
}

/**
 * كل التطبيقات مدمجة (قاعدة + ثابتة بدون تكرار بالـ slug).
 * بتستخدمها صفحات التجميع: /best/[category]/[country] والـ sitemap.
 * محمية الرجوع: لو القاعدة وقعت ترجّع الثابتة كاملة والموقع لا يتعطل.
 */
export const getAllAppsMerged = cache(async (): Promise<AppItem[]> => {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("managed_apps")
      .select("*")
      .eq("is_active", true);
    if (!data?.length) return staticApps;
    const dbSlugs = new Set(data.map((a: any) => a.slug as string));
    return [
      ...data.map(mapDbApp),
      ...staticApps.filter((a) => !dbSlugs.has(a.slug))
    ];
  } catch {
    return staticApps;
  }
});
