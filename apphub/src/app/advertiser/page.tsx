import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdvertiserDashboard } from "@/components/advertiser-dashboard";
import Link from "next/link";
export default async function AdvertiserPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  const { data: myDeals } = await supabase.from("deals").select("*").eq("advertiser_id", user.id).order("created_at", { ascending: false });
  const totalViews = (myDeals ?? []).reduce((sum, d: any) => sum + (d.views ?? 0), 0);
  const activeDeals = (myDeals ?? []).filter((d: any) => new Date(d.expires_at) > new Date()).length;
  const chartData = (myDeals ?? []).slice(0,5).map((d: any) => ({ name: d.title, views: d.views ?? 0 }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <Link href="/advertiser/upgrade" className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">ترقية الباقة</Link>
      </div>
      <AdvertiserDashboard
        stats={{ totalViews, activeDeals, estimatedRevenue: totalViews * 0.5, dealCount: myDeals?.length ?? 0 }}
        deals={myDeals ?? []}
        chartData={chartData}
      />
    </div>
  );
}
