import { AppCategory } from "@/lib/types";
import { categoryLabels } from "@/lib/constants";

/**
 * نظام الفئات الفرعية (Subcategories)
 * ───────────────────────────────────
 * المشكلة: الفئة العامة «streaming» بتخلط Netflix مع Spotify،
 * و«finance» بتخلط فودافون كاش مع تابي — ودي مقارنات وترشيحات غلط.
 *
 * الحل: فئة فرعية لكل تطبيق بتحدد «مين منافسينه الحقيقيين».
 * المبدأ الذهبي: التطبيق اللي مالهوش منافس طبيعي بياخد فئة فرعية لوحده
 * (أفضل ما يترشح غلط) — ولو تطبيق جديد اتضاف ومش متعيّن هنا،
 * بيرجع تلقائيًا لفئته العامة (fallback) بدون ما يبوّظ حاجة.
 *
 * الترتيب: لو عايز تحدد subcategory لتطبيق جديد بدون لمس الملف ده،
 * ضيف العمود الاختياري في الداتابيز:
 *   ALTER TABLE managed_apps ADD COLUMN IF NOT EXISTS subcategory text;
 * وlib/subcategoryOf بيقرأapp.subcategory الأول قبل المابنج.
 */

export type AppSubcategory = {
  key: string;
  category: AppCategory;
  label: string;
  icon: string;
};

/** تعريف الفئات الفرعية (ترتيب الظهور) */
export const SUBCATEGORIES: AppSubcategory[] = [
  // 🍔 أكل وتوصيل
  { key: "food-delivery", category: "food", label: "توصيل مطاعم", icon: "🍔" },
  { key: "food-grocery", category: "food", label: "بقالة وإفطار", icon: "🥐" },

  // 🎬 ستريمنج
  { key: "streaming-video", category: "streaming", label: "أفلام ومسلسلات", icon: "🎬" },
  { key: "streaming-music", category: "streaming", label: "موسيقى وبودكاست", icon: "🎵" },

  // 🛍️ تسوق
  { key: "shopping-marketplace", category: "shopping", label: "أسواق إلكترونية شاملة", icon: "🛒" },
  { key: "shopping-fashion", category: "shopping", label: "أزياء وموضة", icon: "👗" },
  { key: "shopping-beauty", category: "shopping", label: "تجميل وعناية", icon: "💄" },
  { key: "shopping-electronics", category: "shopping", label: "إلكترونيات وأجهزة", icon: "📱" },
  { key: "shopping-classifieds", category: "shopping", label: "إعلانات مبوبة", icon: "🏷️" },

  // 🚗 مواصلات
  { key: "transport-ride", category: "transport", label: "مشاوير وسيارات", icon: "🚗" },
  { key: "transport-transit", category: "transport", label: "نقل جماعي", icon: "🚌" },
  { key: "transport-maps", category: "transport", label: "خرائط وملاحة", icon: "🗺️" },
  { key: "transport-flights", category: "transport", label: "مقارنة رحلات طيران", icon: "✈️" },

  // 💰 فلوس
  { key: "finance-wallet", category: "finance", label: "محافظ ومدفوعات", icon: "💳" },
  { key: "finance-bank", category: "finance", label: "بنوك رقمية", icon: "🏦" },
  { key: "finance-bnpl", category: "finance", label: "تقسيط — اشترِ الآن", icon: "🧾" },
  { key: "finance-invest", category: "finance", label: "استثمار وتداول", icon: "📈" },

  // 💪 صحة
  { key: "health-doctor", category: "health", label: "حجز أطباء واستشارات", icon: "🩺" },
  { key: "health-fitness", category: "health", label: "لياقة وتمرين", icon: "🏋️" },
  { key: "health-diet", category: "health", label: "تغذية ودايت", icon: "🥗" },
  { key: "health-wellness", category: "health", label: "استرخاء ونوم", icon: "🧘" },
  { key: "health-women", category: "health", label: "صحة المرأة", icon: "🌸" },
  { key: "health-pharmacy", category: "health", label: "صيدلية وأدوية", icon: "💊" },
  { key: "health-gov", category: "health", label: "خدمات صحية حكومية", icon: "🏥" },

  // 🎓 تعليم
  { key: "education-language", category: "education", label: "تعلم لغات", icon: "🗣️" },
  { key: "education-courses", category: "education", label: "كورسات احترافية", icon: "🎓" },
  { key: "education-school", category: "education", label: "مناهج مدرسية", icon: "🏫" },
  { key: "education-tools", category: "education", label: "أدوات مذاكرة", icon: "📝" },

  // 🏠 عقارات
  { key: "realestate-search", category: "real-estate", label: "بحث عن عقارات", icon: "🏠" },
  { key: "realestate-projects", category: "real-estate", label: "مشاريع عقارية جديدة", icon: "🏗️" },

  // ✈️ سفر
  { key: "travel-booking", category: "travel", label: "حجز رحلات وإقامات", icon: "🏨" },
  { key: "travel-airline", category: "travel", label: "شركات طيران", icon: "✈️" },
  { key: "travel-reviews", category: "travel", label: "تقييمات سياحية", icon: "⭐" },
  { key: "travel-bike", category: "travel", label: "مشاركة دراجات", icon: "🚲" },

  // 🎮 ألعاب
  { key: "gaming-battle", category: "gaming", label: "باتل رويال", icon: "🔫" },
  { key: "gaming-strategy", category: "gaming", label: "ألعاب استراتيجية", icon: "🏰" },
  { key: "gaming-sports", category: "gaming", label: "ألعاب كرة ورياضة", icon: "⚽" },
  { key: "gaming-sandbox", category: "gaming", label: "عالم مفتوح وبناء", icon: "🧱" },
  { key: "gaming-cards", category: "gaming", label: "ورق وبلوت", icon: "🃏" },

  // 👶 أطفال
  { key: "kids-video", category: "kids", label: "فيديو وأفلام أطفال", icon: "📺" },
  { key: "kids-learning", category: "kids", label: "تعلم مبكر ومحتوى عربي", icon: "🧸" },

  // 🛠️ أدوات
  { key: "tools-messaging", category: "tools", label: "تواصل ومراسلة", icon: "💬" },
  { key: "tools-productivity", category: "tools", label: "إنتاجية وتنظيم", icon: "✅" },
  { key: "tools-storage", category: "tools", label: "تخزين سحابي", icon: "☁️" },
  { key: "tools-design", category: "tools", label: "تصميم ومونتاج", icon: "🎨" },
  { key: "tools-office", category: "tools", label: "أوفيس ومستندات", icon: "📊" },
  { key: "tools-security", category: "tools", label: "أمان وكلمات سر", icon: "🔐" },

  // 🕌 دين
  { key: "religious-quran", category: "religious", label: "قرآن وتلاوات", icon: "📖" },
  { key: "religious-daily", category: "religious", label: "أذكار ومواقيت", icon: "🤲" },

  // 💼 أعمال حرة
  { key: "freelance-micro", category: "freelance", label: "منصات أعمال حرة", icon: "🛠️" },
  { key: "freelance-jobs", category: "freelance", label: "وظائف وسير ذاتية", icon: "💼" },
  { key: "freelance-ecosystem", category: "freelance", label: "شبكات ومحتوى", icon: "🌐" },

  // 🔋 شحن وبطاقات
  { key: "topup-games", category: "topup", label: "شحن ألعاب (شدات وجواهر)", icon: "🎮" },
  { key: "topup-cards", category: "topup", label: "بطاقات هدايا واشتراكات", icon: "🎁" }
];

/* ملحوظة: مفيش تعيين تلقائي بالكلمات المفتاحية (auto-hints) —
 * التخمين بالاسم ممكن يوزّع تطبيقات غلط (مثلاً «شحن مجاني» في تسوق ≠ شحن رصيد).
 * التطبيق اللي مش في المابنج بيرجع لفئته العامة بأمان، والأدمن يقدر يحدد
 * الفئة الفرعية يدويًا من لوحة التحكم (عمود subcategory الاختياري). */

/**
 * تعيين كل تطبيق لفئته الفرعية (152 من أصل 162).
 * تطبيقات «حكومي» العشرة بدون مابنج عمدًا:
 * مفيش منافسة بين تطبيقات حكومات مختلفة، فبتفضل فئة واحدة (الـ fallback).
 */
export const SUBCATEGORY_BY_SLUG: Record<string, string> = {
  // 🍔 food
  talabat: "food-delivery",
  "careem-food": "food-delivery",
  "noon-food": "food-delivery",
  hungerstation: "food-delivery",
  mrsool: "food-delivery",
  jahez: "food-delivery",
  elmenus: "food-delivery",
  otlob: "food-delivery",
  deliveroo: "food-delivery",
  zomato: "food-delivery",
  breadfast: "food-grocery",
  rabbit: "food-grocery",

  // 🎬 streaming
  netflix: "streaming-video",
  shahid: "streaming-video",
  watchit: "streaming-video",
  "osn-plus": "streaming-video",
  starzplay: "streaming-video",
  tod: "streaming-video",
  "disney-plus": "streaming-video",
  "apple-tv": "streaming-video",
  "youtube-premium": "streaming-video",
  spotify: "streaming-music",
  anghami: "streaming-music",
  deezer: "streaming-music",

  // 🛍️ shopping
  amazon: "shopping-marketplace",
  noon: "shopping-marketplace",
  jumia: "shopping-marketplace",
  temu: "shopping-marketplace",
  aliexpress: "shopping-marketplace",
  shein: "shopping-fashion",
  namshi: "shopping-fashion",
  ounass: "shopping-fashion",
  "bath-body": "shopping-beauty",
  sephora: "shopping-beauty",
  extra: "shopping-electronics",
  jarir: "shopping-electronics",
  olx: "shopping-classifieds",
  dubizzle: "shopping-classifieds",
  opensooq: "shopping-classifieds",

  // 💪 health
  vezeeta: "health-doctor",
  altibbi: "health-doctor",
  cura: "health-doctor",
  "nike-training": "health-fitness",
  strava: "health-fitness",
  sweat: "health-fitness",
  myfitnesspal: "health-diet",
  calm: "health-wellness",
  headspace: "health-wellness",
  flo: "health-women",
  pharmacare: "health-pharmacy",
  sehhaty: "health-gov",

  // 🚗 transport
  uber: "transport-ride",
  careem: "transport-ride",
  indriver: "transport-ride",
  yassir: "transport-ride",
  didi: "transport-ride",
  swvl: "transport-transit",
  "google-maps": "transport-maps",
  waze: "transport-maps",
  skyscanner: "transport-flights",
  wego: "transport-flights",

  // 🎓 education
  duolingo: "education-language",
  coursera: "education-courses",
  udemy: "education-courses",
  edraak: "education-courses",
  rwaq: "education-courses",
  skillshare: "education-courses",
  "linkedin-learning": "education-courses",
  "noon-academy": "education-school",
  abwaab: "education-school",
  "khan-academy": "education-school",
  nafham: "education-school",
  quizlet: "education-tools",

  // 💰 finance
  instapay: "finance-wallet",
  "vodafone-cash": "finance-wallet",
  fawry: "finance-wallet",
  "stc-pay": "finance-wallet",
  "apple-pay": "finance-wallet",
  "nbe-mobile": "finance-bank",
  "cib-mobile": "finance-bank",
  alrajhi: "finance-bank",
  snb: "finance-bank",
  liv: "finance-bank",
  "mashreq-neo": "finance-bank",
  valu: "finance-bnpl",
  tamara: "finance-bnpl",
  tabby: "finance-bnpl",
  baraka: "finance-invest",

  // 🏠 real-estate
  aqarmap: "realestate-search",
  propertyfinder: "realestate-search",
  bayut: "realestate-search",
  nawy: "realestate-search",
  "olx-property": "realestate-search",
  "dubizzle-property": "realestate-search",
  "opensooq-property": "realestate-search",
  hamlat: "realestate-projects",

  // ✈️ travel
  booking: "travel-booking",
  airbnb: "travel-booking",
  agoda: "travel-booking",
  almosafer: "travel-booking",
  tajawal: "travel-booking",
  tripadvisor: "travel-reviews",
  flynas: "travel-airline",
  egyptair: "travel-airline",
  emirates: "travel-airline",
  "careem-bike": "travel-bike",

  // 🎮 gaming
  "pubg-mobile": "gaming-battle",
  "free-fire": "gaming-battle",
  "clash-of-clans": "gaming-strategy",
  "clash-royale": "gaming-strategy",
  "fifa-mobile": "gaming-sports",
  efootball: "gaming-sports",
  roblox: "gaming-sandbox",
  minecraft: "gaming-sandbox",
  jawaker: "gaming-cards",
  baloot: "gaming-cards",

  // 👶 kids
  "youtube-kids": "kids-video",
  "spacetoon-go": "kids-video",
  lamsa: "kids-learning",
  "noon-kids": "kids-learning",
  "abcmouse-arabic": "kids-learning",
  taleemabad: "kids-learning",
  kiddopia: "kids-learning",
  "adam-mishmish": "kids-learning",

  // 🛠️ tools
  whatsapp: "tools-messaging",
  telegram: "tools-messaging",
  notion: "tools-productivity",
  todoist: "tools-productivity",
  "google-drive": "tools-storage",
  dropbox: "tools-storage",
  canva: "tools-design",
  capcut: "tools-design",
  "microsoft-365": "tools-office",
  "1password": "tools-security",

  // 🕌 religious
  "quran-com": "religious-quran",
  tarteel: "religious-quran",
  sudais: "religious-quran",
  "muslim-pro": "religious-daily",
  adkar: "religious-daily",
  "hisn-almoslim": "religious-daily",
  "athan-pro": "religious-daily",
  islamicfinder: "religious-daily",

  // 💼 freelance
  mostaql: "freelance-micro",
  khamsat: "freelance-micro",
  upwork: "freelance-micro",
  fiverr: "freelance-micro",
  freelancer: "freelance-micro",
  bayt: "freelance-jobs",
  wuzzuf: "freelance-jobs",
  tanqeeb: "freelance-jobs",
  linkedin: "freelance-jobs",
  hsoub: "freelance-ecosystem",

  // 🔋 topup
  midasbuy: "topup-games",
  codashop: "topup-games",
  unipin: "topup-games",
  carry1st: "topup-games",
  likecard: "topup-cards"
};

/**
 * الفئة الفرعية لتطبيق:
 * 1) app.subcategory لو متعبّي (مثلاً من عمود الداتابيز الاختياري)
 * 2) المابنج بالـ slug
 * 3) الفئة العامة كـ fallback (أمان — سلوك قديم بدون كسر)
 */
export function subcategoryOf(app: {
  slug: string;
  category: string;
  subcategory?: string | null;
}): string {
  return app.subcategory || SUBCATEGORY_BY_SLUG[app.slug] || app.category;
}

/** تعريف فئة فرعية بالمفتاح (null لو مفتاح = فئة عامة fallback) */
export function subcategoryDef(key: string): AppSubcategory | null {
  return SUBCATEGORIES.find((s) => s.key === key) ?? null;
}

/** الفئات الفرعية التابعة لفئة عامة (مرتبة زي التعريف) */
export function subcategoriesOfCategory(category: string): AppSubcategory[] {
  return SUBCATEGORIES.filter((s) => s.category === category);
}

/** اسم معروض للفئة الفرعية (مع fallback لاسم الفئة العامة) */
export function subcategoryLabel(key: string): string {
  const def = subcategoryDef(key);
  if (def) return def.label;
  return categoryLabels[key as AppCategory] ?? key;
}

/** أيقونة الفئة الفرعية (مع fallback لأيقونة الفئة العامة من تعريفها) */
export function subcategoryIcon(key: string): string {
  return subcategoryDef(key)?.icon ?? "📂";
}

export type AppsBySubcategory<T> = {
  key: string;
  label: string;
  icon: string;
  apps: T[];
};

/**
 * تجميع تطبيقات حسب الفئة الفرعية مع الحفاظ على ترتيب الاكتشاف —
 * بيستخدمه: أداة المقارنة (optgroups)، صفحات /best، دليل التطبيقات.
 */
export function groupAppsBySubcategory<
  T extends { slug: string; category: string; subcategory?: string | null }
>(list: T[]): AppsBySubcategory<T>[] {
  const order: string[] = [];
  const map = new Map<string, T[]>();
  for (const app of list) {
    const key = subcategoryOf(app);
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(app);
  }
  return order.map((key) => {
    const def = subcategoryDef(key);
    return {
      key,
      label: def ? def.label : subcategoryLabel(key),
      icon: def ? def.icon : "📂",
      apps: map.get(key)!
    };
  });
}

/** نفس الفئة الفرعية؟ (شرط المنافسة الحقيقية) */
export function sameSubcategory(
  a: { slug: string; category: string; subcategory?: string | null },
  b: { slug: string; category: string; subcategory?: string | null }
): boolean {
  return subcategoryOf(a) === subcategoryOf(b);
}
