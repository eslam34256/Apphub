import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/home-client";
import { AppItem } from "@/lib/types";
import { buildMeta } from "@/lib/seo";

// الصفحة ديناميكية: التطبيقات المُدارة بتتجيب من السيرفر في كل زيارة (SEO + داتا طازة)
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMeta({
  title: "كل اشتراكاتك بسعرها الحقيقي",
  description:
    "المرجع العربي لأسعار الاشتراكات: دليل التطبيقات، رادار الأسعار اليومي، البدائل الأوفر، وحاسبة مصروفك الرقمي — بأرقام مُتحقق منها بتاريخها.",
  url: "https://apphub.eg/",
  keywords: ["أسعار الاشتراكات", "رادار الأسعار", "بدائل أرخص", "تطبيقات"]
});

// نفس تعيين أعمدة managed_apps لـ AppItem — منقول من الكلاينت للسيرفر
function mapManagedApp(app: any): AppItem {
  return {
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
  };
}

export default async function HomePage() {
  let dbApps: AppItem[] = [];
  let radarCount: number | null = null;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("managed_apps")
      .select("*")
      .eq("is_active", true);
    dbApps = (data ?? []).map(mapManagedApp);
  } catch (err) {
    // بيئة بيلد من غير قاعدة بيانات → الداتا الثابتة تكفي
    console.error("Home SSR managed_apps error:", err);
  }

  try {
    const supabase = createClient();
    const { count } = await supabase
      .from("price_watch")
      .select("*", { count: "exact", head: true });
    radarCount = count;
  } catch {
    // جدول الرصد لسه مش موجود → العدّاد بيختفي بهدوء (ممنوع أرقام مختلقة)
    radarCount = null;
  }

  return <HomeClient initialDbApps={dbApps} radarCount={radarCount} />;
}
