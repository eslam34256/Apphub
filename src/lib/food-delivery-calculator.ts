// نظام مقارنة تطبيقات توصيل الأكل - محدّث 2026

export type FoodApp = {
  id: string;
  name: string;
  icon: string;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  serviceFeePercent: number;
  minimumOrder: number;
  averageDeliveryTime: number;
  hasSubscription: boolean;
  subscriptionName?: string;
  subscriptionPrice?: number;
  subscriptionBenefits?: string[];
  restaurantCount: string;
  verifiedAt: string; // تاريخ آخر مراجعة — الرقم له تاريخ (قاعدة المشروع)
  features: string[];
  paymentMethods: string[];
  promoCode?: { code: string; discount: number; description: string };
  cuisines: string[];
};

export const foodApps: FoodApp[] = [
  {
    id: "talabat",
    name: "طلبات",
    icon: "🍔",
    baseDeliveryFee: 30,        // كان 20
    freeDeliveryThreshold: 200, // كان 150
    serviceFeePercent: 8,       // كان 5
    minimumOrder: 50,
    averageDeliveryTime: 45,
    hasSubscription: true,
    subscriptionName: "Talabat Pro",
    subscriptionPrice: 99,      // كان 49
    subscriptionBenefits: ["توصيل مجاني", "خصومات حصرية"],
    restaurantCount: "5,000+",
    verifiedAt: "سبتمبر 2026",
    features: ["أكتر مطاعم", "توصيل سريع", "عروض يومية"],
    paymentMethods: ["كاش", "كارت", "محفظة"],
    promoCode: { code: "WELCOME50", discount: 50, description: "خصم 50 ج على أول طلب" },
    cuisines: ["مصري", "إيطالي", "آسيوي", "أمريكي", "صحي", "حلويات", "بقالة"]
  },
  {
    id: "elmenus",
    name: "إلمنيوز",
    icon: "📋",
    baseDeliveryFee: 35,
    freeDeliveryThreshold: 250,
    serviceFeePercent: 3,
    minimumOrder: 60,
    averageDeliveryTime: 50,
    hasSubscription: false,
    restaurantCount: "3,500+",
    verifiedAt: "سبتمبر 2026",
    features: ["دليل المطاعم", "مراجعات حقيقية", "صور للأكل"],
    paymentMethods: ["كاش", "كارت"],
    promoCode: { code: "ELMENUS20", discount: 20, description: "خصم 20% على أول طلب" },
    cuisines: ["مصري", "شرقي", "إيطالي", "آسيوي", "أمريكي"]
  },
  {
    id: "careem-food",
    name: "كريم فود",
    icon: "🍕",
    baseDeliveryFee: 25,
    freeDeliveryThreshold: 180,
    serviceFeePercent: 6,
    minimumOrder: 40,
    averageDeliveryTime: 40,
    hasSubscription: true,
    subscriptionName: "Careem Plus",
    subscriptionPrice: 79,
    subscriptionBenefits: ["توصيل مجاني", "خصومات على المشاوير"],
    restaurantCount: "2,500+",
    verifiedAt: "سبتمبر 2026",
    features: ["مدمج مع كريم", "نقاط على كل طلب", "كريم باي"],
    paymentMethods: ["كاش", "كارت", "كريم باي"],
    promoCode: { code: "CAREEM30", discount: 30, description: "خصم 30 ج على أول طلب" },
    cuisines: ["مصري", "إيطالي", "أمريكي", "آسيوي", "صحي"]
  },
  {
    id: "breadfast",
    name: "بريدفاست",
    icon: "🥐",
    baseDeliveryFee: 20,
    freeDeliveryThreshold: 150,
    serviceFeePercent: 0,
    minimumOrder: 75,
    averageDeliveryTime: 30,
    hasSubscription: true,
    subscriptionName: "Breadfast Premium",
    subscriptionPrice: 149,
    subscriptionBenefits: ["توصيل مجاني للإفطار", "بقالة مجانية"],
    restaurantCount: "البقالة والإفطار",
    verifiedAt: "سبتمبر 2026",
    features: ["إفطار طازج", "بقالة يومية", "أسعار ممتازة"],
    paymentMethods: ["كاش", "كارت", "محفظة"],
    cuisines: ["إفطار", "بقالة", "مخبوزات", "ألبان", "خضار وفاكهة"]
  },
  {
    id: "rabbit",
    name: "رابيت",
    icon: "🐰",
    baseDeliveryFee: 15,
    freeDeliveryThreshold: 100,
    serviceFeePercent: 0,
    minimumOrder: 50,
    averageDeliveryTime: 20,
    hasSubscription: false,
    restaurantCount: "البقالة الفورية",
    verifiedAt: "سبتمبر 2026",
    features: ["توصيل في 20 دقيقة", "بقالة فورية", "سريع جدًا"],
    paymentMethods: ["كاش", "كارت"],
    promoCode: { code: "RABBIT15", discount: 15, description: "خصم 15% على أول 3 طلبات" },
    cuisines: ["بقالة", "مشروبات", "وجبات سريعة", "حلويات"]
  },
  {
    id: "otlob",
    name: "أطلب",
    icon: "🍴",
    baseDeliveryFee: 32,
    freeDeliveryThreshold: 220,
    serviceFeePercent: 5,
    minimumOrder: 55,
    averageDeliveryTime: 50,
    hasSubscription: false,
    restaurantCount: "2,000+",
    verifiedAt: "سبتمبر 2026",
    features: ["تاريخ طويل", "موثوق", "عروض موسمية"],
    paymentMethods: ["كاش", "كارت"],
    cuisines: ["مصري", "شرقي", "إيطالي", "صيني"]
  }
];

export type FoodOrderEstimate = {
  app: FoodApp;
  orderValue: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  totalCost: number;
  estimatedTime: number;
  savings: number;
  isCheapest?: boolean;
  isFastest?: boolean;
  hasPromo?: boolean;
};

export function calculateFoodOrder(
  orderValue: number,
  useSubscription: boolean = false,
  usePromoCode: boolean = false
): FoodOrderEstimate[] {
  if (orderValue <= 0) return [];

  const estimates: FoodOrderEstimate[] = foodApps.map((app) => {
    let deliveryFee = app.baseDeliveryFee;

    if (orderValue >= app.freeDeliveryThreshold) {
      deliveryFee = 0;
    }

    if (useSubscription && app.hasSubscription) {
      deliveryFee = 0;
    }

    const serviceFee = (orderValue * app.serviceFeePercent) / 100;

    let discount = 0;
    if (usePromoCode && app.promoCode) {
      if (app.promoCode.discount > 50) {
        discount = (orderValue * app.promoCode.discount) / 100;
      } else {
        discount = app.promoCode.discount;
      }
    }

    const totalCost = Math.max(
      orderValue + deliveryFee + serviceFee - discount,
      app.minimumOrder
    );

    return {
      app,
      orderValue,
      deliveryFee,
      serviceFee: Math.round(serviceFee),
      discount: Math.round(discount),
      totalCost: Math.round(totalCost),
      estimatedTime: app.averageDeliveryTime,
      savings: 0,
      hasPromo: usePromoCode && !!app.promoCode
    };
  });

  const cheapest = estimates.reduce((min, e) =>
    e.totalCost < min.totalCost ? e : min
  );
  const fastest = estimates.reduce((min, e) =>
    e.estimatedTime < min.estimatedTime ? e : min
  );

  return estimates.map((e) => ({
    ...e,
    isCheapest: e.app.id === cheapest.app.id,
    isFastest: e.app.id === fastest.app.id
  }));
}

export function getAllCuisines(): string[] {
  const cuisines = new Set<string>();
  foodApps.forEach((app) => app.cuisines.forEach((c) => cuisines.add(c)));
  return Array.from(cuisines);
}