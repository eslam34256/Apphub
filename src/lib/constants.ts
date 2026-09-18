import { AppCategory, CountryCode } from "./types";

export const categoryLabels: Record<AppCategory, string> = {
  food: "أكل وتوصيل",
  streaming: "ستريمنج",
  shopping: "تسوق",
  health: "صحة",
  transport: "مواصلات",
  education: "تعليم",
  finance: "فلوس وبنوك",
  "real-estate": "عقارات",
  travel: "سفر",
  gaming: "ألعاب",
  kids: "أطفال وعائلة",
  tools: "أدوات وإنتاجية",
  religious: "ديني",
  government: "حكومي",
  freelance: "فريلانس",
  topup: "شحن وبطاقات"
};

export const countryLabels: Record<CountryCode, string> = {
  EG: "مصر",
  SA: "السعودية",
  AE: "الإمارات"
};

export const categoryIcons: Record<AppCategory, string> = {
  food: "🍔",
  streaming: "🎬",
  shopping: "🛍️",
  health: "💪",
  transport: "🚗",
  education: "📚",
  finance: "💰",
  "real-estate": "🏠",
  travel: "✈️",
  gaming: "🎮",
  kids: "👶",
  tools: "🛠️",
  religious: "🕌",
  government: "🏛️",
  freelance: "💼",
  topup: "🔋"
};
