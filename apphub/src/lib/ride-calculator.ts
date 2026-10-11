import { createClient } from "@/lib/supabase/client";

export type RideApp = {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
  surgeMultiplier: number;
  estimatedWaitTime: number;
  paymentMethods: string[];
  features: string[];
  countries: string[];
  lastUpdated?: string;
};

// أسعار افتراضية (تستخدم لو Supabase مش متاح)
export const defaultRideApps: RideApp[] = [
  {
    id: "uber", name: "Uber", icon: "🚘",
    basePrice: 15, pricePerKm: 5.5, pricePerMinute: 0.8,
    minimumFare: 35, surgeMultiplier: 1.0, estimatedWaitTime: 5,
    paymentMethods: ["كاش", "كارت", "محفظة"],
    features: ["موثوق", "منتشر", "Uber X"],
    countries: ["EG", "SA", "AE"]
  },
  {
    id: "careem", name: "كريم", icon: "🚕",
    basePrice: 18, pricePerKm: 6.0, pricePerMinute: 0.9,
    minimumFare: 40, surgeMultiplier: 1.0, estimatedWaitTime: 6,
    paymentMethods: ["كاش", "كارت", "محفظة", "كريم باي"],
    features: ["سوبر آب", "كريم بلس", "خدمات"],
    countries: ["EG", "SA", "AE"]
  },
  {
    id: "indrive", name: "InDrive", icon: "🚗",
    basePrice: 10, pricePerKm: 3.5, pricePerMinute: 0.4,
    minimumFare: 25, surgeMultiplier: 1.0, estimatedWaitTime: 10,
    paymentMethods: ["كاش"],
    features: ["تتفاوض على السعر", "الأرخص", "شفاف"],
    countries: ["EG"]
  },
  {
    id: "didi", name: "DiDi", icon: "🚙",
    basePrice: 12, pricePerKm: 4.5, pricePerMinute: 0.6,
    minimumFare: 30, surgeMultiplier: 1.0, estimatedWaitTime: 7,
    paymentMethods: ["كاش", "كارت"],
    features: ["عروض كتيرة", "صيني", "صاعد"],
    countries: ["EG"]
  },
  {
    id: "yassir", name: "Yassir", icon: "🚖",
    basePrice: 14, pricePerKm: 5.0, pricePerMinute: 0.7,
    minimumFare: 32, surgeMultiplier: 1.0, estimatedWaitTime: 8,
    paymentMethods: ["كاش", "كارت"],
    features: ["سوبر آب", "جزائري", "نمو سريع"],
    countries: ["EG"]
  },
  {
    id: "swvl", name: "SWVL", icon: "🚌",
    basePrice: 25, pricePerKm: 2.0, pricePerMinute: 0.0,
    minimumFare: 25, surgeMultiplier: 1.0, estimatedWaitTime: 15,
    paymentMethods: ["كارت", "محفظة"],
    features: ["أتوبيس", "مكيف", "خطوط محددة"],
    countries: ["EG"]
  }
];

// رابط أيقونات وميزات التطبيقات
const APP_META: Record<string, { icon: string; waitTime: number; payment: string[]; features: string[]; countries: string[] }> = {
  uber: { icon: "🚘", waitTime: 5, payment: ["كاش", "كارت", "محفظة"], features: ["موثوق", "منتشر"], countries: ["EG", "SA", "AE"] },
  careem: { icon: "🚕", waitTime: 6, payment: ["كاش", "كارت", "كريم باي"], features: ["سوبر آب", "خدمات"], countries: ["EG", "SA", "AE"] },
  indrive: { icon: "🚗", waitTime: 10, payment: ["كاش"], features: ["تتفاوض", "الأرخص"], countries: ["EG"] },
  didi: { icon: "🚙", waitTime: 7, payment: ["كاش", "كارت"], features: ["عروض كتيرة"], countries: ["EG"] },
  yassir: { icon: "🚖", waitTime: 8, payment: ["كاش", "كارت"], features: ["سوبر آب"], countries: ["EG"] },
  swvl: { icon: "🚌", waitTime: 15, payment: ["كارت", "محفظة"], features: ["أتوبيس", "مكيف"], countries: ["EG"] }
};

// جلب الأسعار من Supabase (محدّثة باستمرار)
export async function fetchLatestPrices(): Promise<RideApp[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("ride_prices")
      .select("*")
      .eq("is_active", true)
      .order("app_name");

    if (error || !data || data.length === 0) {
      console.warn("Using default prices");
      return defaultRideApps;
    }

    return data.map((row: any) => {
      const meta = APP_META[row.app_id] || APP_META.uber;
      return {
        id: row.app_id,
        name: row.app_name,
        icon: meta.icon,
        basePrice: parseFloat(row.base_price),
        pricePerKm: parseFloat(row.price_per_km),
        pricePerMinute: parseFloat(row.price_per_minute),
        minimumFare: parseFloat(row.minimum_fare),
        surgeMultiplier: parseFloat(row.peak_multiplier) || 1.0,
        estimatedWaitTime: meta.waitTime,
        paymentMethods: meta.payment,
        features: meta.features,
        countries: meta.countries,
        lastUpdated: row.last_updated
      };
    });
  } catch (err) {
    console.error("Error fetching prices:", err);
    return defaultRideApps;
  }
}

// ════════════════════════════════════════
// البحث عن الأماكن
// ════════════════════════════════════════

export type Location = {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type?: string;
};

export async function searchLocation(query: string): Promise<Location[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: "json",
          limit: "5",
          countrycodes: "eg",
          "accept-language": "ar"
        })
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item: any) => ({
      name: item.name || item.display_name.split(",")[0],
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type
    }));
  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
}

// ════════════════════════════════════════
// حساب المسافة
// ════════════════════════════════════════

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.5 * 10) / 10;
}

// ════════════════════════════════════════
// التقدير مع البيانات الفعلية من المستخدمين
// ════════════════════════════════════════

export type RideEstimate = {
  app: RideApp;
  distance: number;
  estimatedDuration: number;
  estimatedPrice: number;
  priceRange: { min: number; max: number };
  actualPriceFromUsers?: number;
  reportsCount?: number;
  isCheapest?: boolean;
  isFastest?: boolean;
  confidence?: "high" | "medium" | "low";
};

export async function calculateRideEstimatesAdvanced(
  distance: number,
  isPeakHour: boolean = false,
  fromLocation?: string,
  toLocation?: string
): Promise<RideEstimate[]> {
  // جيب أحدث الأسعار من Supabase
  const apps = await fetchLatestPrices();

  // جيب تقارير المستخدمين الفعلية لرحلات مشابهة
  let userReports: any[] = [];
  if (fromLocation && toLocation) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("actual_ride_reports")
        .select("app_id, actual_price")
        .gte("distance", distance * 0.8)
        .lte("distance", distance * 1.2)
        .gte("trip_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
      
      userReports = data || [];
    } catch (err) {}
  }

  const estimatedDuration = Math.round((distance / 25) * 60);

  const estimates: RideEstimate[] = apps.map((app) => {
    let price = app.basePrice + distance * app.pricePerKm + estimatedDuration * app.pricePerMinute;
    
    if (isPeakHour) price = price * 1.6;
    price = Math.max(price, app.minimumFare);

    // احسب متوسط الأسعار الفعلية من المستخدمين
    const appReports = userReports.filter((r) => r.app_id === app.id);
    let actualPrice: number | undefined;
    let confidence: "high" | "medium" | "low" = "low";

    if (appReports.length >= 5) {
      actualPrice = Math.round(
        appReports.reduce((sum, r) => sum + parseFloat(r.actual_price), 0) / appReports.length
      );
      confidence = "high";
    } else if (appReports.length >= 2) {
      actualPrice = Math.round(
        appReports.reduce((sum, r) => sum + parseFloat(r.actual_price), 0) / appReports.length
      );
      confidence = "medium";
    }

    // لو فيه بيانات حقيقية، استخدمها
    const finalPrice = actualPrice && confidence !== "low" ? actualPrice : Math.round(price);

    return {
      app,
      distance,
      estimatedDuration,
      estimatedPrice: finalPrice,
      priceRange: {
        min: Math.round(finalPrice * 0.85),
        max: Math.round(finalPrice * 1.25)
      },
      actualPriceFromUsers: actualPrice,
      reportsCount: appReports.length,
      confidence
    };
  });

  const cheapest = estimates.reduce((min, e) => e.estimatedPrice < min.estimatedPrice ? e : min);
  const fastest = estimates.reduce((min, e) => e.app.estimatedWaitTime < min.app.estimatedWaitTime ? e : min);

  return estimates.map((e) => ({
    ...e,
    isCheapest: e.app.id === cheapest.app.id,
    isFastest: e.app.id === fastest.app.id
  }));
}

// الدالة القديمة للتوافق
export function calculateRideEstimates(distance: number, isPeakHour: boolean = false): RideEstimate[] {
  const estimatedDuration = Math.round((distance / 25) * 60);
  
  const estimates: RideEstimate[] = defaultRideApps.map((app) => {
    let price = app.basePrice + distance * app.pricePerKm + estimatedDuration * app.pricePerMinute;
    if (isPeakHour) price = price * 1.6;
    price = Math.max(price, app.minimumFare);

    return {
      app,
      distance,
      estimatedDuration,
      estimatedPrice: Math.round(price),
      priceRange: {
        min: Math.round(price * 0.85),
        max: Math.round(price * 1.25)
      },
      confidence: "low" as const
    };
  });

  const cheapest = estimates.reduce((min, e) => e.estimatedPrice < min.estimatedPrice ? e : min);
  const fastest = estimates.reduce((min, e) => e.app.estimatedWaitTime < min.app.estimatedWaitTime ? e : min);

  return estimates.map((e) => ({
    ...e,
    isCheapest: e.app.id === cheapest.app.id,
    isFastest: e.app.id === fastest.app.id
  }));
}