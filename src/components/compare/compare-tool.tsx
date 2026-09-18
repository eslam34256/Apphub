"use client";

/**
 * أداة المقارنة التفاعلية بين أي تطبيقين — موجودة زي ما هي من الكود الأصلي،
 * اتنقلت لمكون مستقل عشان صفحة /compare تبقى Server Component ليها SEO.
 */

import { useMemo, useState } from "react";
import { apps } from "@/data/apps";
import { countryLabels } from "@/lib/constants";
import { formatMoney, getPriceForCountry } from "@/lib/helpers";
import { CountryCode } from "@/lib/types";

export function CompareTool() {
  const [first, setFirst] = useState(apps[0].slug);
  const [second, setSecond] = useState(apps[1].slug);
  const [country, setCountry] = useState<CountryCode>("EG");
  const app1 = useMemo(() => apps.find(a => a.slug === first), [first]);
  const app2 = useMemo(() => apps.find(a => a.slug === second), [second]);
  if (!app1 || !app2) return null;
  const price1 = getPriceForCountry(app1, country);
  const price2 = getPriceForCountry(app2, country);
  const winner = app1.rating > app2.rating ? app1.name : app2.rating > app1.rating ? app2.name : "تعادل";

  return (
    <>
      <div className="card-elegant p-6">
        <h2 className="heading-elegant mb-4 text-xl text-brand-900">قارن بين أي تطبيقين بنفسك</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded-2xl border border-cream-200 bg-white px-4 py-3" value={first} onChange={e => setFirst(e.target.value)}>
            {apps.map(app => <option key={app.id} value={app.slug}>{app.name}</option>)}
          </select>
          <select className="rounded-2xl border border-cream-200 bg-white px-4 py-3" value={second} onChange={e => setSecond(e.target.value)}>
            {apps.map(app => <option key={app.id} value={app.slug}>{app.name}</option>)}
          </select>
          <select className="rounded-2xl border border-cream-200 bg-white px-4 py-3" value={country} onChange={e => setCountry(e.target.value as CountryCode)}>
            <option value="EG">{countryLabels.EG}</option>
            <option value="SA">{countryLabels.SA}</option>
            <option value="AE">{countryLabels.AE}</option>
          </select>
        </div>
      </div>

      <div className="card-elegant p-6">
        <p className="mb-4 rounded-2xl bg-accent-50 border border-accent-200 px-4 py-3 text-accent-800 font-bold">
          🏆 الأفضل حاليًا: {winner}
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-right">
            <tbody>
              {[
                ["العنصر", app1.name, app2.name],
                ["التقييم", `⭐ ${app1.rating}`, `⭐ ${app2.rating}`],
                ["الوصف", app1.shortDescription, app2.shortDescription],
                [`السعر في ${countryLabels[country]}`, formatMoney(price1?.monthly, price1?.currency ?? "EGP"), formatMoney(price2?.monthly, price2?.currency ?? "EGP")],
                ["متاح في البلد؟", app1.countries.includes(country) ? "نعم" : "لا", app2.countries.includes(country) ? "نعم" : "لا"],
                ["أبرز ميزة", app1.pros[0], app2.pros[0]],
                ["أبرز عيب", app1.cons[0], app2.cons[0]]
              ].map((row, i) => (
                <tr key={i} className={i === 0 ? "bg-cream-50" : "bg-white"}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-3 ${j === 0 ? "font-bold text-brand-900" : ""} ${i > 0 ? "border border-cream-200" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
