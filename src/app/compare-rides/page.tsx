"use client";

import { useMemo, useState } from "react";
import {
  calculateRideEstimates,
  calculateDistance,
  Location
} from "@/lib/ride-calculator";
import { LocationSearch } from "@/components/location-search";

export default function CompareRidesPage() {
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const [isPeakHour, setIsPeakHour] = useState(false);

  const distance = useMemo(() => {
    if (!fromLocation || !toLocation) return 0;
    return calculateDistance(
      fromLocation.lat,
      fromLocation.lon,
      toLocation.lat,
      toLocation.lon
    );
  }, [fromLocation, toLocation]);

  const estimates = useMemo(
    () => (distance > 0 ? calculateRideEstimates(distance, isPeakHour) : []),
    [distance, isPeakHour]
  );

  const sortedEstimates = useMemo(
    () => [...estimates].sort((a, b) => a.estimatedPrice - b.estimatedPrice),
    [estimates]
  );

  const cheapest = sortedEstimates[0];
  const duration = estimates[0]?.estimatedDuration ?? 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-slate-900 p-8 text-white">
        <p className="mb-2 text-sm text-white/70">🚗 مقارنة أسعار المشاوير</p>
        <h1 className="text-3xl font-extrabold">
          قارن أسعار كل تطبيقات المشاوير في ثانية
        </h1>
        <p className="mt-3 text-white/80">
          اكتب أي مكان في مصر واعرف أرخص تطبيق قبل ما تطلب
        </p>
      </div>

      {/* فورم البحث */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <LocationSearch
            label="من"
            icon="📍"
            placeholder="اكتب اسم المنطقة... (مثال: مدينة نصر)"
            value={fromLocation}
            onSelect={setFromLocation}
          />

          <LocationSearch
            label="إلى"
            icon="🎯"
            placeholder="اكتب اسم المنطقة... (مثال: المعادي)"
            value={toLocation}
            onSelect={setToLocation}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            id="peak"
            type="checkbox"
            checked={isPeakHour}
            onChange={(e) => setIsPeakHour(e.target.checked)}
            className="h-5 w-5"
          />
          <label htmlFor="peak" className="text-sm text-slate-700">
            🔥 وقت الذروة (الأسعار أعلى بـ 40%)
          </label>
        </div>

        {!fromLocation || !toLocation ? (
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            💡 ابدأ بكتابة اسم المكان في الخانتين فوق
          </div>
        ) : null}
      </div>

      {/* النتائج */}
      {distance > 0 && (
        <>
          {/* معلومات الرحلة */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">📏 المسافة</p>
              <p className="mt-2 text-2xl font-extrabold">{distance} كم</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">⏱️ المدة التقريبية</p>
              <p className="mt-2 text-2xl font-extrabold">{duration} دقيقة</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm text-emerald-700">💰 أرخص خيار</p>
              <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                {cheapest?.app.name} — {cheapest?.estimatedPrice} ج
              </p>
            </div>
          </div>

          {/* المقارنة الكاملة */}
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold">📊 مقارنة كاملة</h2>

            {sortedEstimates.map((estimate) => (
              <div
                key={estimate.app.id}
                className={`rounded-2xl border-2 bg-white p-5 shadow-sm transition hover:shadow-md ${
                  estimate.isCheapest
                    ? "border-emerald-500"
                    : estimate.isFastest
                    ? "border-blue-500"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                      {estimate.app.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">
                          {estimate.app.name}
                        </h3>
                        {estimate.isCheapest && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            🏆 الأرخص
                          </span>
                        )}
                        {estimate.isFastest && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            ⚡ الأسرع
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        ⏱️ ينتظر {estimate.app.estimatedWaitTime} دقايق
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-3xl font-extrabold text-brand-600">
                      {estimate.estimatedPrice} ج
                    </p>
                    <p className="text-sm text-slate-500">
                      من {estimate.priceRange.min} لـ {estimate.priceRange.max} ج
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {estimate.app.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs text-slate-500">
                    💳 {estimate.app.paymentMethods.join(" • ")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* نصايح */}
          <div className="rounded-3xl bg-amber-50 p-6">
            <h3 className="mb-3 font-bold text-amber-900">💡 نصايح للتوفير</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>✅ <strong>InDrive</strong> الأرخص عادةً ، بس تحتاج تفاوض</li>
              <li>✅ <strong>SWVL</strong> الأرخص للمشاوير الطويلة</li>
              <li>✅ تجنب وقت الذروة (8-10 ص، 5-8 م)</li>
              <li>✅ <strong>DiDi</strong> دايمًا عنده عروض للمستخدمين الجدد</li>
              <li>✅ قارن الأسعار قبل ما تطلب — ممكن توفر 30-50%</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
