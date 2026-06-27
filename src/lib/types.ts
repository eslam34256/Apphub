export type CountryCode = "EG" | "SA" | "AE";

export type AppCategory =
  | "food" | "streaming" | "shopping" | "health"
  | "transport" | "education" | "finance" | "real-estate"
  | "travel" | "gaming" | "kids" | "tools"
  | "religious" | "government" | "freelance";

export type PriceItem = {
  country: CountryCode;
  monthly?: number;
  yearly?: number;
  currency: "EGP" | "SAR" | "AED";
  note?: string;
};

export type AppItem = {
  id: string; slug: string; name: string; icon: string;
  category: AppCategory; shortDescription: string; description: string;
  rating: number; pros: string[]; cons: string[];
  countries: CountryCode[]; pricing: PriceItem[];
  tags: string[]; businessUse?: string[];
};

export type DealItem = {
  id: string; title: string; brand: string;
  category: "tech" | "food" | "beauty" | "fashion";
  discount: number; views: number; expiresAt: string;
  code?: string; createdAt?: string; userId?: string;
};

export type BusinessStack = {
  id: string; title: string; description: string; apps: string[];
};

export type SubscriptionItem = {
  id: string; userId: string; appName: string;
  plan: string; price: number;
  cycle: "monthly" | "yearly"; createdAt: string;
};

export type ReviewItem = {
  id: string; appSlug: string; userId: string;
  user_name: string; rating: number; comment: string;
  created_at: string; likes: number;
};

export type AppItem = {
  // ... باقي الحقول
  googlePlay?: string;
  appStore?: string;
  website?: string;
};