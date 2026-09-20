import { AppsDirectory } from "@/components/apps-directory";
import { apps as staticApps } from "@/data/apps";
import { createClient } from "@/lib/supabase/server";
import { AppItem } from "@/lib/types";

export const revalidate = 0;

export default async function AppsPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();

  const { data: dbApps } = await supabase
    .from("managed_apps")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

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

  const dbSlugs = new Set(dbAppsMapped.map((a) => a.slug));
  const filteredStaticApps = staticApps.filter((a) => !dbSlugs.has(a.slug));
  const allApps = [...dbAppsMapped, ...filteredStaticApps];

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <p className="text-accent-600 text-sm uppercase tracking-[0.3em] mb-3">
            اكتشف
          </p>
          <h1 className="heading-display text-5xl md:text-6xl text-brand-900 mb-4">
            كل التطبيقات
          </h1>
          <div className="divider-gold"></div>
          <p className="text-charcoal-500 max-w-xl mx-auto">
            تصفّح مكتبة ضخمة من التطبيقات المختارة بعناية
          </p>
        </div>

        {/* Apps Directory — ?q= بيجهز البحث من الـ Hero */}
        <AppsDirectory apps={allApps} initialQuery={typeof searchParams.q === "string" ? searchParams.q : ""} />
      </div>
    </div>
  );
}