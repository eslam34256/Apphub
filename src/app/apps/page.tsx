import { AppsDirectory } from "@/components/apps-directory";
import { apps as staticApps } from "@/data/apps";
import { createClient } from "@/lib/supabase/server";
import { AppItem } from "@/lib/types";

export const revalidate = 0; // عشان يجيب أحدث البيانات دائمًا

export default async function AppsPage() {
  const supabase = createClient();
  
  // جيب التطبيقات من Supabase
  const { data: dbApps } = await supabase
    .from("managed_apps")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // حوّل التطبيقات من Supabase لنفس شكل التطبيقات الثابتة
  const dbAppsMapped: AppItem[] = (dbApps ?? []).map((app: any) => ({
    id: `db-${app.id}`,
    slug: app.slug,
    name: app.name,
    icon: app.icon,
    category: app.category,
    shortDescription: app.short_description || "",
    description: app.description || "",
    rating: parseFloat(app.rating) || 0,
    pros: Array.isArray(app.pros) ? app.pros : [],
    cons: Array.isArray(app.cons) ? app.cons : [],
    countries: Array.isArray(app.countries) ? app.countries : [],
    pricing: Array.isArray(app.pricing) ? app.pricing : [],
    tags: Array.isArray(app.tags) ? app.tags : [],
    businessUse: Array.isArray(app.business_use) ? app.business_use : []
  }));

  // ادمج التطبيقات (Supabase الأول، بعدين الثابتة)
  // لو فيه تطبيق بنفس الـ slug في الاتنين، اللي من Supabase ياخد الأولوية
  const dbSlugs = new Set(dbAppsMapped.map((a) => a.slug));
  const filteredStaticApps = staticApps.filter((a) => !dbSlugs.has(a.slug));
  const allApps = [...dbAppsMapped, ...filteredStaticApps];

  return <AppsDirectory apps={allApps} />;
}