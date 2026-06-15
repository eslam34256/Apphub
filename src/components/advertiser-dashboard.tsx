import { DealForm } from "./deal-form";
type Stat = { totalViews:number; activeDeals:number; estimatedRevenue:number; dealCount:number };
type Deal = { id:string; title:string; brand:string; category:string; discount:number; views:number; expires_at:string; code:string|null };
export function AdvertiserDashboard({ stats, deals, chartData }: { stats:Stat; deals:Deal[]; chartData:{name:string;views:number}[] }) {
  const maxViews = Math.max(1, ...chartData.map(d => d.views));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">لوحة تحكم المعلن</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {[["إجمالي المشاهدات", stats.totalViews],["العروض النشطة", stats.activeDeals],["عدد العروض", stats.dealCount],["الإيرادات التقديرية", `${stats.estimatedRevenue.toFixed(0)} ج`]].map(([label, val]) => (
          <div key={label as string} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-extrabold">{val}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">أداء العروض</h2>
        <div className="space-y-2">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="w-40 truncate text-sm text-slate-600">{item.name}</span>
              <div className="flex-1 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-brand-500" style={{ width: `${(item.views/maxViews)*100}%` }} /></div>
              <span className="w-16 text-right text-sm text-slate-500">{item.views}</span>
            </div>
          ))}
          {!chartData.length && <p className="text-slate-500">مفيش عروض لسه</p>}
        </div>
      </div>
      <DealForm />
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">كل العروض</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-slate-50">
              <tr>{["العنوان","البراند","الفئة","الخصم","المشاهدات","ينتهي"].map(h => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{deal.title}</td>
                  <td className="px-3 py-2">{deal.brand}</td>
                  <td className="px-3 py-2">{deal.category}</td>
                  <td className="px-3 py-2">{deal.discount}%</td>
                  <td className="px-3 py-2">{deal.views}</td>
                  <td className="px-3 py-2">{deal.expires_at}</td>
                </tr>
              ))}
              {!deals.length && <tr><td colSpan={6} className="px-3 py-4 text-center text-slate-500">مفيش عروض لسه</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
