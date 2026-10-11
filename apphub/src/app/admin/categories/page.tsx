import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">📂 إدارة الفئات</h1>
          <p className="text-sm text-slate-500">{categories?.length ?? 0} فئة</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-2xl bg-brand-600 px-5 py-2 font-bold text-white"
        >
          + إضافة فئة
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3">الأيقونة</th>
              <th className="p-3">الاسم</th>
              <th className="p-3">Slug</th>
              <th className="p-3">الترتيب</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((cat: any) => (
              <tr key={cat.id} className="border-b">
                <td className="p-3 text-2xl">{cat.icon}</td>
                <td className="p-3 font-bold">{cat.name_ar}</td>
                <td className="p-3 text-slate-500">{cat.slug}</td>
                <td className="p-3">{cat.sort_order}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    cat.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {cat.is_active ? "نشط" : "متوقف"}
                  </span>
                </td>
                <td className="p-3">
                  <DeleteCategoryButton categoryId={cat.id} categoryName={cat.name_ar} />
                </td>
              </tr>
            ))}
            {(!categories || categories.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  مفيش فئات لسه
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}