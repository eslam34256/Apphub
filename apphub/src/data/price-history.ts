import { AppCategory, CountryCode } from "@/lib/types";

/**
 * 🚨 رادار أسعار الاشتراكات — بذرة البيانات
 *
 * الفلسفة: كل مرة سعر اشتراك بيتغير، ضيف PricePoint جديد في نهاية history.
 * القيمة الحقيقية للميزة دي بتتراكم مع الوقت — بعد 6 شهور هيبقى عندك أرشيف
 * أسعار مفيش عنده حد تاني في الوطن العربي.
 *
 * روتين التشغيل (لحد ما الأتمتة تتربط بـ /api/scraper):
 * مراجعة أسبوعية للتطبيقات دي ← سعر جديد؟ ضيف نقطة + حدّث updatedAt.
 *
 * المصادر: الأسعار الرسمية المنشورة من المنصات/المتاجر وقت كل نقطة.
 */

export type PricePoint = {
  /** YYYY-MM-DD */
  date: string;
  price: number;
};

export type RadarPlan = {
  name: string;
  note?: string;
  /** مرتبة من الأقدم للأحدث */
  points: PricePoint[];
};

export type RadarEntry = {
  appSlug: string;
  name: string;
  icon: string;
  category: AppCategory;
  country: CountryCode;
  currency: "EGP" | "SAR" | "AED";
  plans: RadarPlan[];
  /** تاريخ آخر مراجعة يدوية */
  updatedAt: string;
};

export const priceRadar: RadarEntry[] = [
  {
    appSlug: "netflix",
    name: "Netflix",
    icon: "🎬",
    category: "streaming",
    country: "EG",
    currency: "EGP",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "الأساسية",
        note: "شاشة واحدة — HD",
        points: [
          { date: "2025-05-12", price: 100 },
          { date: "2026-09-18", price: 100 }
        ]
      },
      {
        name: "القياسية",
        note: "شاشتين — Full HD",
        points: [
          { date: "2025-05-12", price: 170 },
          { date: "2026-09-18", price: 170 }
        ]
      },
      {
        name: "المميزة",
        note: "4 شاشات — 4K",
        points: [
          { date: "2025-05-12", price: 240 },
          { date: "2026-09-18", price: 240 }
        ]
      }
    ]
  },
  {
    appSlug: "shahid",
    name: "شاهد VIP",
    icon: "📺",
    category: "streaming",
    country: "EG",
    currency: "EGP",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "VIP الشهرية",
        points: [
          { date: "2025-05-13", price: 49 },
          { date: "2026-09-18", price: 49 }
        ]
      },
      {
        name: "الرياضية الشهرية",
        points: [
          { date: "2025-05-13", price: 99 },
          { date: "2026-09-18", price: 99 }
        ]
      }
    ]
  },
  {
    appSlug: "shahid",
    name: "شاهد VIP",
    icon: "📺",
    category: "streaming",
    country: "SA",
    currency: "SAR",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "VIP الشهرية",
        points: [
          { date: "2025-06-20", price: 29.62 },
          { date: "2026-09-18", price: 29.62 }
        ]
      },
      {
        name: "الرياضية الشهرية",
        points: [
          { date: "2025-06-20", price: 57.99 },
          { date: "2026-09-18", price: 57.99 }
        ]
      }
    ]
  },
  {
    appSlug: "watchit",
    name: "واتش إت",
    icon: "🎥",
    category: "streaming",
    country: "EG",
    currency: "EGP",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "الشهرية",
        points: [{ date: "2026-09-18", price: 49 }]
      }
    ]
  },
  {
    appSlug: "spotify",
    name: "Spotify",
    icon: "🎵",
    category: "streaming",
    country: "EG",
    currency: "EGP",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "Individual",
        points: [{ date: "2026-09-18", price: 79.99 }]
      },
      {
        name: "Family",
        note: "6 حسابات",
        points: [{ date: "2026-09-18", price: 129.99 }]
      }
    ]
  },
  {
    appSlug: "anghami",
    name: "أنغامي",
    icon: "🎶",
    category: "streaming",
    country: "EG",
    currency: "EGP",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "Plus الشهرية",
        points: [{ date: "2026-09-18", price: 39.99 }]
      }
    ]
  },
  {
    appSlug: "youtube-premium",
    name: "YouTube Premium",
    icon: "▶️",
    category: "streaming",
    country: "EG",
    currency: "EGP",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "Individual",
        points: [{ date: "2026-09-18", price: 84.99 }]
      },
      {
        name: "Family",
        points: [{ date: "2026-09-18", price: 169.99 }]
      }
    ]
  },
  {
    appSlug: "osn-plus",
    name: "OSN+",
    icon: "📡",
    category: "streaming",
    country: "SA",
    currency: "SAR",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "الشهرية",
        points: [{ date: "2026-09-18", price: 31.5 }]
      }
    ]
  },
  {
    appSlug: "tod",
    name: "TOD",
    icon: "⚽",
    category: "streaming",
    country: "SA",
    currency: "SAR",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "الشهرية",
        points: [{ date: "2026-09-18", price: 69 }]
      }
    ]
  },
  {
    appSlug: "disney-plus",
    name: "Disney+",
    icon: "🏰",
    category: "streaming",
    country: "AE",
    currency: "AED",
    updatedAt: "2026-09-18",
    plans: [
      {
        name: "الشهرية",
        points: [{ date: "2026-09-18", price: 33.99 }]
      }
    ]
  }
];
