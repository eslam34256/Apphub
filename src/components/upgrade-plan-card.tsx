import { PlanKey, PLANS } from "@/lib/stripe";
type Props = { planKey:PlanKey; plan:(typeof PLANS)[PlanKey]; loading:boolean; onSelect:(plan:PlanKey)=>void };
const highlights: Record<PlanKey, string[]> = {
  starter:  ["عرض واحد لمدة 7 أيام","إحصائيات أساسية","ظهور في الدليل"],
  business: ["5 عروض في الشهر","أولوية في الظهور","تقارير مفصّلة","ظهور في النشرة"],
  partner:  ["عروض غير محدودة","أعلى أولوية","تقارير أسبوعية","Push Notifications","لوجو على الرئيسية"]
};
export function UpgradePlanCard({ planKey, plan, loading, onSelect }: Props) {
  const isPopular = planKey === "business";
  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${isPopular ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"}`}>
      {isPopular && <span className="mb-3 inline-block rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">الأكثر شيوعًا</span>}
      <h2 className="mb-1 text-xl font-extrabold">{plan.name}</h2>
      <p className="mb-4 text-slate-500">{plan.description}</p>
      <p className="mb-6 text-3xl font-extrabold text-brand-600">{plan.price.toLocaleString("ar-EG")} ج</p>
      <ul className="mb-6 space-y-2">
        {highlights[planKey].map(item => <li key={item} className="flex items-center gap-2 text-sm text-slate-700"><span className="text-emerald-500">✓</span>{item}</li>)}
      </ul>
      <button disabled={loading} onClick={() => onSelect(planKey)} className={`w-full rounded-2xl px-4 py-3 font-bold disabled:opacity-60 ${isPopular ? "bg-brand-600 text-white hover:bg-brand-500" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
        {loading ? "جاري التحميل..." : "اشترك الآن"}
      </button>
    </div>
  );
}
