// نظام تقدير أسعار الرحلات

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
};

export const rideApps: RideApp[] = [
  {
    id: "uber", name: "Uber", icon: "🚘",
    basePrice: 10, pricePerKm: 3.5, pricePerMinute: 0.5,
    minimumFare: 25, surgeMultiplier: 1.0, estimatedWaitTime: 5,
    paymentMethods: ["كاش", "كارت", "محفظة"],
    features: ["موثوق", "منتشر", "Uber Eats"],
    countries: ["EG", "SA", "AE"]
  },
  {
    id: "careem", name: "كريم", icon: "🚕",
    basePrice: 12, pricePerKm: 3.8, pricePerMinute: 0.6,
    minimumFare: 30, surgeMultiplier: 1.0, estimatedWaitTime: 6,
    paymentMethods: ["كاش", "كارت", "محفظة", "كريم باي"],
    features: ["سوبر آب", "كريم بلس", "خدمات"],
    countries: ["EG", "SA", "AE"]
  },
  {
    id: "indrive", name: "InDrive", icon: "🚗",
    basePrice: 8, pricePerKm: 2.5, pricePerMinute: 0.3,
    minimumFare: 20, surgeMultiplier: 1.0, estimatedWaitTime: 10,
    paymentMethods: ["كاش"],
    features: ["تتفاوض على السعر", "أرخص", "شفاف"],
    countries: ["EG"]
  },
  {
    id: "didi", name: "DiDi", icon: "🚙",
    basePrice: 9, pricePerKm: 3.0, pricePerMinute: 0.4,
    minimumFare: 22, surgeMultiplier: 1.0, estimatedWaitTime: 7,
    paymentMethods: ["كاش", "كارت"],
    features: ["عروض كتير", "صيني", "صاعد"],
    countries: ["EG"]
  },
  {
    id: "yassir", name: "Yassir", icon: "🚖",
    basePrice: 10, pricePerKm: 3.2, pricePerMinute: 0.4,
    minimumFare: 25, surgeMultiplier: 1.0, estimatedWaitTime: 8,
    paymentMethods: ["كاش", "كارت"],
    features: ["سوبر آب", "جزائري", "نمو سريع"],
    countries: ["EG"]
  },
  {
    id: "swvl", name: "SWVL", icon: "🚌",
    basePrice: 15, pricePerKm: 1.2, pricePerMinute: 0.0,
    minimumFare: 15, surgeMultiplier: 1.0, estimatedWaitTime: 15,
    paymentMethods: ["كارت", "محفظة"],
    features: ["أتوبيس", "أرخص", "مكيف", "خطوط محددة"],
    countries: ["EG"]
  }
];

// ════════════════════════════════════════
// البحث عن الأماكن باستخدام OpenStreetMap
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
        }),
      {
        headers: {
          "Accept": "application/json"
        }
      }
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
    console.error("Error searching location:", err);
    return [];
  }
}

// ════════════════════════════════════════
// حساب المسافة بين نقطتين (Haversine)
// ════════════════════════════════════════

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;

  // الزيادة الفعلية للطرق (40% أكثر من الخط المستقيم في المدن)
  return Math.round(straightDistance * 1.4 * 10) / 10;
}

// ════════════════════════════════════════
// التقدير الكامل
// ════════════════════════════════════════

export type RideEstimate = {
  app: RideApp;
  distance: number;
  estimatedDuration: number;
  estimatedPrice: number;
  priceRange: { min: number; max: number };
  isCheapest?: boolean;
  isFastest?: boolean;
};

export function calculateRideEstimates(
  distance: number,
  isPeakHour: boolean = false
): RideEstimate[] {
  const estimatedDuration = Math.round((distance / 30) * 60);

  const estimates: RideEstimate[] = rideApps.map((app) => {
    let price =
      app.basePrice +
      distance * app.pricePerKm +
      estimatedDuration * app.pricePerMinute;

    if (isPeakHour) price = price * 1.4;
    price = Math.max(price, app.minimumFare);

    return {
      app,
      distance,
      estimatedDuration,
      estimatedPrice: Math.round(price),
      priceRange: {
        min: Math.round(price * 0.9),
        max: Math.round(price * 1.15)
      }
    };
  });

  const cheapest = estimates.reduce((min, e) =>
    e.estimatedPrice < min.estimatedPrice ? e : min
  );
  const fastest = estimates.reduce((min, e) =>
    e.app.estimatedWaitTime < min.app.estimatedWaitTime ? e : min
  );

  return estimates.map((e) => ({
    ...e,
    isCheapest: e.app.id === cheapest.app.id,
    isFastest: e.app.id === fastest.app.id
  }));
}
