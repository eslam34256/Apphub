import { createClient } from "@/lib/supabase/server";
import { PricesEditor } from "@/components/admin/prices-editor";

export default async function AdminPricesPage() {
  const supabase = createClient();
  const { data: prices } = await supabase
    .from("ride_prices")
    .select("*")
    .order("app_name");

  const { data: reports } = await supabase
    .from("actual_ride_reports")
    .select("app_id")
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-purple-700 p-8 text-white">
        <p className="text-sm text-white/80">💰 إدارة الأسعار</p>
        <h1 className="mt-2 text-3xl font-extrabold">أسعار تطبيقات المشاوير</h1>
        <p className="mt-2 text-white/90">
          حدّث الأسعار بناءً على آخر تحديثات التطبيقات
        </p>
      </div>

      <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          📊 <strong>{reports?.length || 0} تقرير</strong> من المستخدمين في آخر 7 أيام
        </p>
      </div>

      <PricesEditor initialPrices={prices || []} />
    </div>
  );
}