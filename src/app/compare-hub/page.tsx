"use client";

import { useMemo, useState } from "react";
import {
  calculateRideEstimates,
  calculateDistance,
  Location
} from "@/lib/ride-calculator";
import { calculateFoodOrder, getAllCuisines } from "@/lib/food-delivery-calculator";
import { LocationSearch } from "@/components/location-search";
import { useLanguage } from "@/contexts/language-context";

type CompareCategory = "rides" | "food" | "streaming" | "bnpl";

export default function CompareHubPage() {
  const { t, lang } = useLanguage();
  const [category, setCategory] = useState<CompareCategory>("rides");

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-accent-600 text-sm uppercase tracking-[0.3em] mb-3">
            {lang === "ar" ? "قارن بذكاء" : "Smart Compare"}
          </p>
          <h1 className="heading-display text-5xl md:text-6xl text-brand-900 mb-4">
            {lang === "ar" ? "المقارنات" : "Comparisons"}
          </h1>
          <div className="divider-gold"></div>
          <p className="text-charcoal-500 max-w-xl mx-auto">
            {lang === "ar"
              ? "قارن أسعار وخدمات أفضل التطبيقات في مكان واحد"
              : "Compare prices and services of the best apps in one place"}
          </p>
        </div>

        {/* اختيار الفئة */}
        <div className="card-elegant p-6">
          <h2 className="heading-elegant text-xl text-brand-900 mb-4">
            {lang === "ar" ? "اختار نوع المقارنة:" : "Choose comparison type:"}
          </h2>
          <div className="grid gap-3 md:grid-cols-4">
            <CategoryButton
              active={category === "rides"}
              icon="🚗"
              title={lang === "ar" ? "المشاوير" : "Rides"}
              description="Uber, Careem, InDrive"
              onClick={() => setCategory("rides")}
            />
            <CategoryButton
              active={category === "food"}
              icon="🍔"
              title={lang === "ar" ? "توصيل الأكل" : "Food Delivery"}
              description={lang === "ar" ? "طلبات, إلمنيوز, كريم" : "Talabat, Elmenus, Careem"}
              onClick={() => setCategory("food")}
            />
            <CategoryButton
              active={category === "streaming"}
              icon="🎬"
              title={lang === "ar" ? "الستريمنج" : "Streaming"}
              description="Netflix, Shahid, OSN+"
              onClick={() => setCategory("streaming")}
            />
            <CategoryButton
              active={category === "bnpl"}
              icon="💳"
              title={lang === "ar" ? "التقسيط" : "BNPL"}
              description={lang === "ar" ? "فاليو, تمارا, تابي" : "Valu, Tamara, Tabby"}
              onClick={() => setCategory("bnpl")}
            />
          </div>
        </div>

        {/* عرض المقارنة المناسبة */}
        {category === "rides" && <RidesCompare />}
        {category === "food" && <FoodCompare />}
        {category === "streaming" && <StreamingCompare />}
        {category === "bnpl" && <BNPLCompare />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// زرار الفئة
// ════════════════════════════════════════
function CategoryButton({
  active, icon, title, description, onClick
}: {
  active: boolean; icon: string; title: string; description: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border-2 p-4 text-right transition ${
        active
          ? "border-accent-400 bg-accent-50"
          : "border-cream-200 bg-white hover:border-accent-300"
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-2 font-bold text-brand-900">{title}</h3>
      <p className="text-xs text-charcoal-500">{description}</p>
    </button>
  );
}

// ════════════════════════════════════════
// مقارنة المشاوير
// ════════════════════════════════════════
function RidesCompare() {
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const [isPeakHour, setIsPeakHour] = useState(false);

  const distance = useMemo(() => {
    if (!fromLocation || !toLocation) return 0;
    return calculateDistance(fromLocation.lat, fromLocation.lon, toLocation.lat, toLocation.lon);
  }, [fromLocation, toLocation]);

  const estimates = useMemo(
    () => (distance > 0 ? calculateRideEstimates(distance, isPeakHour) : []),
    [distance, isPeakHour]
  );

  const sorted = useMemo(
    () => [...estimates].sort((a, b) => a.estimatedPrice - b.estimatedPrice),
    [estimates]
  );

  return (
    <div className="space-y-6">
      <div className="card-elegant p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <LocationSearch
            label="من"
            icon="📍"
            placeholder="اكتب المنطقة (مدينة نصر، المعادي...)"
            value={fromLocation}
            onSelect={setFromLocation}
          />
          <LocationSearch
            label="إلى"
            icon="🎯"
            placeholder="اكتب الوجهة..."
            value={toLocation}
            onSelect={setToLocation}
          />
        </div>
        <label className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPeakHour}
            onChange={(e) => setIsPeakHour(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="text-sm text-charcoal-800">🔥 وقت الذروة (+40%)</span>
        </label>
      </div>

      {distance > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard label="📏 المسافة" value={`${distance} كم`} />
            <InfoCard label="⏱️ المدة" value={`${estimates[0]?.estimatedDuration} دقيقة`} />
            <InfoCard
              label="🏆 الأرخص"
              value={`${sorted[0]?.app.name} — ${sorted[0]?.estimatedPrice} ج`}
              variant="success"
            />
          </div>

          <div className="space-y-3">
            {sorted.map((est) => (
              <div
                key={est.app.id}
                className={`card-elegant p-5 ${
                  est.isCheapest ? "border-2 border-sage-400" :
                  est.isFastest ? "border-2 border-accent-400" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{est.app.icon}</div>
                    <div>
                      <h3 className="font-bold text-brand-900">{est.app.name}</h3>
                      <div className="mt-1 flex gap-2">
                        {est.isCheapest && <Badge type="success">🏆 الأرخص</Badge>}
                        {est.isFastest && <Badge type="info">⚡ الأسرع</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-extrabold text-brand-900">
                      {est.estimatedPrice} ج
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {est.priceRange.min}-{est.priceRange.max} ج
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// مقارنة الأكل
// ════════════════════════════════════════
function FoodCompare() {
  const [orderValue, setOrderValue] = useState(150);
  const [useSubscription, setUseSubscription] = useState(false);
  const [usePromoCode, setUsePromoCode] = useState(false);

  const estimates = useMemo(
    () => calculateFoodOrder(orderValue, useSubscription, usePromoCode),
    [orderValue, useSubscription, usePromoCode]
  );

  const sorted = useMemo(
    () => [...estimates].sort((a, b) => a.totalCost - b.totalCost),
    [estimates]
  );

  return (
    <div className="space-y-6">
      <div className="card-elegant p-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-brand-900">💵 قيمة الطلب</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={orderValue}
              onChange={(e) => setOrderValue(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              value={orderValue}
              onChange={(e) => setOrderValue(Number(e.target.value))}
              className="w-24 rounded-2xl border border-cream-200 px-3 py-2 text-center font-bold"
            />
            <span className="text-charcoal-500">ج</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[50, 100, 150, 200, 300, 500].map((val) => (
              <button
                key={val}
                onClick={() => setOrderValue(val)}
                className={`rounded-full px-3 py-1 text-sm ${
                  orderValue === val ? "bg-brand-900 text-white" : "bg-cream-100 text-charcoal-800"
                }`}
              >
                {val} ج
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-cream-200 pt-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useSubscription} onChange={(e) => setUseSubscription(e.target.checked)} className="h-5 w-5" />
            <span className="text-sm text-charcoal-800">⭐ عندي اشتراك Premium</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={usePromoCode} onChange={(e) => setUsePromoCode(e.target.checked)} className="h-5 w-5" />
            <span className="text-sm text-charcoal-800">🎟️ استخدم كود الخصم</span>
          </label>
        </div>
      </div>

      {sorted.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard label="🏆 الأرخص" value={`${sorted[0].app.name} — ${sorted[0].totalCost} ج`} variant="success" />
            <InfoCard label="💰 توفر" value={`${sorted[sorted.length-1].totalCost - sorted[0].totalCost} ج`} variant="info" />
            <InfoCard label="⚡ الأسرع" value={`${sorted.find(e => e.isFastest)?.app.name}`} variant="purple" />
          </div>

          <div className="space-y-3">
            {sorted.map((est) => (
              <div
                key={est.app.id}
                className={`card-elegant p-5 ${
                  est.isCheapest ? "border-2 border-sage-400" :
                  est.isFastest ? "border-2 border-accent-400" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{est.app.icon}</div>
                    <div>
                      <h3 className="font-bold text-brand-900">{est.app.name}</h3>
                      <p className="text-xs text-charcoal-500">⏱️ {est.estimatedTime} دقيقة</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {est.isCheapest && <Badge type="success">🏆 الأرخص</Badge>}
                        {est.isFastest && <Badge type="info">⚡ الأسرع</Badge>}
                        {est.hasPromo && <Badge type="warning">🎟️ كود خصم</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-extrabold text-accent-600">{est.totalCost} ج</p>
                    <p className="text-xs text-charcoal-500">
                      توصيل: {est.deliveryFee === 0 ? "مجاني" : `${est.deliveryFee} ج`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// مقارنة الستريمنج
// ════════════════════════════════════════
function StreamingCompare() {
  const platforms = [
    { id: "netflix", name: "Netflix", icon: "🎬", eg: 199, sa: 49, ae: 49 },
    { id: "shahid", name: "شاهد VIP", icon: "📺", eg: 79, sa: 29, ae: 29 },
    { id: "watchit", name: "واتش إت", icon: "🎥", eg: 49, sa: 0, ae: 0 },
    { id: "osn", name: "OSN+", icon: "📡", eg: 0, sa: 84, ae: 84 },
    { id: "starz", name: "StarzPlay", icon: "⭐", eg: 0, sa: 35, ae: 35 },
    { id: "spotify", name: "Spotify", icon: "🎵", eg: 60, sa: 22, ae: 22 },
    { id: "anghami", name: "أنغامي", icon: "🎶", eg: 40, sa: 15, ae: 15 },
    { id: "youtube", name: "YouTube Premium", icon: "▶️", eg: 72, sa: 24, ae: 24 }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-accent-50 border border-accent-200 p-4 text-sm text-brand-900">
        💡 الأسعار بالعملة المحلية لكل دولة. ممكن توفر فلوس لو اشتركت من بلد تاني.
      </div>

      <div className="card-elegant p-6 overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-cream-200">
              <th className="p-3 text-brand-900">المنصة</th>
              <th className="p-3 text-brand-900">🇪🇬 مصر</th>
              <th className="p-3 text-brand-900">🇸🇦 السعودية</th>
              <th className="p-3 text-brand-900">🇦🇪 الإمارات</th>
              <th className="p-3 text-brand-900">💰 الأرخص</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p) => {
              const prices = [
                { country: "🇪🇬 مصر", value: p.eg, currency: "ج" },
                { country: "🇸🇦 السعودية", value: p.sa, currency: "ريال" },
                { country: "🇦🇪 الإمارات", value: p.ae, currency: "درهم" }
              ].filter(x => x.value > 0);

              const cheapest = prices.length > 0 ? prices.reduce((a, b) => a.value < b.value ? a : b) : null;

              return (
                <tr key={p.id} className="border-b border-cream-100">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="font-bold text-brand-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-charcoal-800">{p.eg > 0 ? `${p.eg} ج` : "—"}</td>
                  <td className="p-3 text-charcoal-800">{p.sa > 0 ? `${p.sa} ريال` : "—"}</td>
                  <td className="p-3 text-charcoal-800">{p.ae > 0 ? `${p.ae} درهم` : "—"}</td>
                  <td className="p-3">
                    {cheapest && (
                      <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-sage-700">
                        {cheapest.country}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-accent-50 border border-accent-200 p-6">
        <h3 className="mb-3 font-bold text-brand-900">💡 نصايح للتوفير</h3>
        <ul className="space-y-2 text-sm text-charcoal-800">
          <li>✅ Netflix من السعودية أرخص بـ 60% من مصر</li>
          <li>✅ شاهد من الإمارات أرخص بـ 60% من مصر</li>
          <li>✅ استخدم الباقات العائلية واقتسم الاشتراك</li>
          <li>✅ اشترك سنويًا بدل شهريًا — وفر 15-17%</li>
        </ul>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// مقارنة BNPL
// ════════════════════════════════════════
function BNPLCompare() {
  const [amount, setAmount] = useState(5000);

  const apps = [
    { id: "valu", name: "فاليو", icon: "🛒", installments: 6, interestRate: 0, monthlyFee: 0, processingFee: 0 },
    { id: "tamara", name: "تمارا", icon: "🛍️", installments: 4, interestRate: 0, monthlyFee: 0, processingFee: 0 },
    { id: "tabby", name: "تابي", icon: "💎", installments: 4, interestRate: 0, monthlyFee: 0, processingFee: 0 },
    { id: "shahry", name: "شهري", icon: "📅", installments: 12, interestRate: 0, monthlyFee: 0, processingFee: 50 }
  ];

  return (
    <div className="space-y-6">
      <div className="card-elegant p-6">
        <label className="mb-2 block text-sm font-bold text-brand-900">💰 المبلغ المراد تقسيطه</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="500"
            max="50000"
            step="500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-32 rounded-2xl border border-cream-200 px-3 py-2 text-center font-bold"
          />
          <span className="text-charcoal-500">ج</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1000, 2500, 5000, 10000, 25000].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`rounded-full px-3 py-1 text-sm ${
                amount === val ? "bg-brand-900 text-white" : "bg-cream-100 text-charcoal-800"
              }`}
            >
              {val.toLocaleString()} ج
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app) => {
          const monthlyInstallment = (amount + app.processingFee) / app.installments;
          const totalCost = amount + app.processingFee;

          return (
            <div key={app.id} className="card-elegant p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{app.icon}</div>
                <h3 className="text-lg font-bold text-brand-900">{app.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-sage-50 border border-sage-200 p-4">
                  <p className="text-xs text-sage-700">القسط الشهري</p>
                  <p className="text-2xl font-extrabold text-sage-700">
                    {monthlyInstallment.toFixed(0)} ج
                  </p>
                  <p className="text-xs text-sage-600 mt-1">
                    على {app.installments} {app.installments > 4 ? "شهر" : "دفعات"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-cream-100 p-3">
                    <p className="text-xs text-charcoal-500">المبلغ الأصلي</p>
                    <p className="font-bold text-brand-900">{amount.toLocaleString()} ج</p>
                  </div>
                  <div className="rounded-lg bg-cream-100 p-3">
                    <p className="text-xs text-charcoal-500">إجمالي ما هتدفعه</p>
                    <p className="font-bold text-brand-900">{totalCost.toLocaleString()} ج</p>
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-sage-700">
                    {app.interestRate === 0 ? "بدون فوائد" : `فايدة ${app.interestRate}%`}
                  </span>
                  {app.processingFee > 0 && (
                    <span className="rounded-full bg-accent-100 px-3 py-1 text-accent-700">
                      رسوم {app.processingFee} ج
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-accent-50 border border-accent-200 p-6">
        <h3 className="mb-3 font-bold text-brand-900">💡 نصايح للتقسيط الذكي</h3>
        <ul className="space-y-2 text-sm text-charcoal-800">
          <li>✅ تمارا وتابي بدون فوائد وأنسب للمبالغ المتوسطة</li>
          <li>✅ فاليو الأفضل للمبالغ الكبيرة (6 شهور بدون فوائد)</li>
          <li>✅ اتأكد من قدرتك على السداد قبل التقسيط</li>
          <li>✅ التأخير في الدفع له رسوم — التزم بالمواعيد</li>
        </ul>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// Components مساعدة
// ════════════════════════════════════════
function InfoCard({ label, value, variant = "default" }: { label: string; value: string; variant?: "default" | "success" | "info" | "purple" }) {
  const colors = {
    default: "bg-white border border-cream-200",
    success: "bg-sage-50 border border-sage-200 text-sage-700",
    info: "bg-accent-50 border border-accent-200 text-accent-700",
    purple: "bg-brand-50 border border-brand-200 text-brand-700"
  };
  return (
    <div className={`rounded-2xl p-5 shadow-soft ${colors[variant]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-2 text-lg font-extrabold">{value}</p>
    </div>
  );
}

function Badge({ type, children }: { type: "success" | "info" | "warning"; children: React.ReactNode }) {
  const colors = {
    success: "bg-sage-100 text-sage-700",
    info: "bg-accent-100 text-accent-700",
    warning: "bg-cream-200 text-charcoal-800"
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${colors[type]}`}>
      {children}
    </span>
  );
}