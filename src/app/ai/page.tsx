"use client";
import { useState } from "react";
import { recommendApps } from "@/lib/recommend";
import { CountryCode } from "@/lib/types";
import { AppCard } from "@/components/app-card";
export default function AIPage() {
  const [activity, setActivity] = useState("watch");
  const [priority, setPriority] = useState("quality");
  const [country, setCountry] = useState<CountryCode>("EG");
  const [results, setResults] = useState(recommendApps({ activity:"watch", priority:"quality", country:"EG" }));
  function handleRecommend() { setResults(recommendApps({ activity, priority, country })); }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-extrabold">الترشيح الذكي</h1>
        <p className="mb-4 text-slate-500">جاوب 3 أسئلة وسنرشح لك أفضل التطبيقات.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded-2xl border px-4 py-3" value={activity} onChange={e => setActivity(e.target.value)}>
            <option value="food">الأكل والتوصيل</option>
            <option value="watch">🎬 أفلام ومسلسلات</option>
            <option value="music">🎵 موسيقى وبودكاست</option>
            <option value="shopping">التسوق</option>
            <option value="learning">التعلم</option>
            <option value="health">الصحة</option>
            <option value="mobility">المواصلات</option>
            <option value="finance">الفلوس والبنوك</option>
            <option value="home">العقارات</option>
          </select>
          <select className="rounded-2xl border px-4 py-3" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="price">السعر</option>
            <option value="quality">الجودة</option>
            <option value="popular">الأشهر</option>
            <option value="business">مناسب للبيزنس</option>
          </select>
          <select className="rounded-2xl border px-4 py-3" value={country} onChange={e => setCountry(e.target.value as CountryCode)}>
            <option value="EG">مصر</option>
            <option value="SA">السعودية</option>
            <option value="AE">الإمارات</option>
          </select>
        </div>
        <button onClick={handleRecommend} className="mt-4 rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-500">اعرض الترشيحات</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map(app => <AppCard key={app.id} app={app} />)}
      </div>
    </div>
  );
}
