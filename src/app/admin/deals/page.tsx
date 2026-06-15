import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteDealButton } from "@/components/admin/delete-deal-button";

export default async function AdminDealsPage() {
  const supabase = createClient();
  const { data: deals } = await supabase
    .from("managed_deals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">💰 إدارة العروض</h1>
          <p className="text-sm text-slate-500">{deals?.length ?? 0} عرض</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="rounded-2xl bg-brand-600 px-5 py-2 font-bold text-white"
        >
          + إضافة عرض
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3">العنوان</th>
              <th className="p-3">البراند</th>
              <th className="p-3">الفئة</th>
              <th className="p-3">الخصم</th>
              <th className="p-3">المشاهدات</th>
              <th className="p-3">ينتهي</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(deals ?? []).map((deal: any) => (
              <tr key={deal.id} className="border-b">
                <td className="p-3 font-bold">{deal.title}</td>
                <td className="p-3">{deal.brand}</td>
                <td className="p-3">{deal.category}</td>
                <td className="p-3">{deal.discount}%</td>
                <td className="p-3">{deal.views}</td>
                <td className="p-3 text-xs">{deal.expires_at}</td>
                <td className="p-3">
                  <DeleteDealButton dealId={deal.id} dealTitle={deal.title} />
                </td>
              </tr>
            ))}
            {(!deals || deals.length === 0) && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  مفيش عروض لسه
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}