import { createClient } from "@/lib/supabase/server";
import { VerifyBrandButton } from "@/components/admin/verify-brand-button";

export default async function AdminBrandsPage() {
  const supabase = createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">🏪 إدارة البراندات</h1>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3">الاسم</th>
              <th className="p-3">الوصف</th>
              <th className="p-3">الموقع</th>
              <th className="p-3">موثق؟</th>
              <th className="p-3">تاريخ التسجيل</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(brands ?? []).map((brand: any) => (
              <tr key={brand.id} className="border-b">
                <td className="p-3 font-bold">{brand.name}</td>
                <td className="p-3 text-xs">{brand.description?.slice(0, 50) || "—"}</td>
                <td className="p-3">
                  {brand.website ? (
                    <a href={brand.website} target="_blank" className="text-brand-600 text-xs">
                      🔗 رابط
                    </a>
                  ) : "—"}
                </td>
                <td className="p-3">
                  {brand.verified ? (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      ✅ موثق
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                      غير موثق
                    </span>
                  )}
                </td>
                <td className="p-3 text-xs">
                  {new Date(brand.created_at).toLocaleDateString("ar-EG")}
                </td>
                <td className="p-3">
                  <VerifyBrandButton brandId={brand.id} isVerified={brand.verified} />
                </td>
              </tr>
            ))}
            {(!brands || brands.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  مفيش براندات لسه
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}