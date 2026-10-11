#!/bin/bash

echo "🚀 جاري إنشاء AppHub..."

# ── الفولدرات ──────────────────────────────────────────
mkdir -p src/app/api/scraper
mkdir -p src/app/api/newsletter/send
mkdir -p src/app/api/payments/create-session
mkdir -p src/app/api/payments/webhook
mkdir -p src/app/api/mobile/apps
mkdir -p src/app/api/mobile/deals
mkdir -p src/app/api/mobile/user
mkdir -p src/app/api/notifications
mkdir -p src/app/api/auth
mkdir -p src/app/auth/callback
mkdir -p src/app/apps/\[slug\]
mkdir -p src/app/compare
mkdir -p src/app/deals
mkdir -p src/app/ai
mkdir -p src/app/subscriptions
mkdir -p src/app/business
mkdir -p src/app/blog/\[slug\]
mkdir -p src/app/advertiser/upgrade
mkdir -p src/app/admin/users
mkdir -p src/app/profile
mkdir -p src/components
mkdir -p src/data
mkdir -p src/lib/supabase

echo "✅ الفولدرات جاهزة"

# ── package.json ───────────────────────────────────────
cat > package.json << 'EOF'
{
  "name": "apphub",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.1",
    "@supabase/supabase-js": "^2.45.4",
    "lucide-react": "^0.453.0",
    "next": "14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "stripe": "^16.12.0"
  },
  "devDependencies": {
    "@types/node": "^22.7.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3"
  }
}
EOF

# ── tsconfig.json ──────────────────────────────────────
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# ── next.config.mjs ────────────────────────────────────
cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
EOF

# ── postcss.config.js ──────────────────────────────────
cat > postcss.config.js << 'EOF'
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
EOF

# ── tailwind.config.ts ─────────────────────────────────
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9eeff",
          500: "#2563eb",
          600: "#1d4ed8",
          900: "#0f172a"
        }
      }
    }
  },
  plugins: []
};
export default config;
EOF

# ── vercel.json ────────────────────────────────────────
cat > vercel.json << 'EOF'
{
  "crons": [
    { "path": "/api/scraper", "schedule": "0 */6 * * *" },
    { "path": "/api/newsletter/send", "schedule": "0 9 * * 1" }
  ]
}
EOF

# ── .env.example ───────────────────────────────────────
cat > .env.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
STRIPE_PARTNER_PRICE_ID=price_...
CRON_SECRET=your-random-secret-32-chars
EOF

cp .env.example .env.local

# ── .gitignore ─────────────────────────────────────────
cat > .gitignore << 'EOF'
node_modules/
.next/
.env.local
.env
out/
EOF

echo "✅ ملفات الإعداد جاهزة"

# ══════════════════════════════════════════════════════
# src/lib
# ══════════════════════════════════════════════════════

cat > src/lib/types.ts << 'EOF'
export type CountryCode = "EG" | "SA" | "AE";
export type AppCategory =
  | "food" | "streaming" | "shopping" | "health"
  | "transport" | "education" | "finance" | "real-estate";

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
EOF

cat > src/lib/constants.ts << 'EOF'
import { AppCategory, CountryCode } from "./types";
export const categoryLabels: Record<AppCategory, string> = {
  food: "أكل وتوصيل", streaming: "ستريمنج", shopping: "تسوق",
  health: "صحة", transport: "مواصلات", education: "تعليم",
  finance: "فلوس وبنوك", "real-estate": "عقارات"
};
export const countryLabels: Record<CountryCode, string> = {
  EG: "مصر", SA: "السعودية", AE: "الإمارات"
};
EOF

cat > src/lib/helpers.ts << 'EOF'
import { AppItem, CountryCode, PriceItem } from "./types";
export function formatMoney(value?: number, currency: "EGP"|"SAR"|"AED" = "EGP") {
  if (value === undefined) return "غير متاح";
  if (value === 0) return "مجاني";
  const locale = currency === "EGP" ? "ar-EG" : currency === "SAR" ? "ar-SA" : "ar-AE";
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}
export function getPriceForCountry(app: AppItem, country: CountryCode): PriceItem | undefined {
  return app.pricing.find(p => p.country === country);
}
export function getMonthlyPrice(app: AppItem, country: CountryCode): number {
  const item = getPriceForCountry(app, country);
  return item?.monthly ?? Number.MAX_SAFE_INTEGER;
}
export function getCheapestCountry(app: AppItem) {
  const valid = app.pricing.filter(p => typeof p.monthly === "number");
  if (!valid.length) return null;
  return valid.reduce((min, cur) =>
    (cur.monthly ?? Number.MAX_SAFE_INTEGER) < (min.monthly ?? Number.MAX_SAFE_INTEGER) ? cur : min
  );
}
EOF

cat > src/lib/recommend.ts << 'EOF'
import { apps } from "@/data/apps";
import { getMonthlyPrice } from "./helpers";
import { AppItem, CountryCode } from "./types";
type Answers = { activity: string; priority: string; country: CountryCode };
const activityToCategories: Record<string, string[]> = {
  food: ["food"], entertainment: ["streaming"], shopping: ["shopping"],
  learning: ["education"], health: ["health"], mobility: ["transport"],
  finance: ["finance"], home: ["real-estate"]
};
export function recommendApps({ activity, priority, country }: Answers): AppItem[] {
  const categories = activityToCategories[activity] ?? [];
  return apps
    .filter(app => app.countries.includes(country))
    .map(app => {
      let score = 0;
      if (categories.includes(app.category)) score += 4;
      if (priority === "price") {
        const price = getMonthlyPrice(app, country);
        if (price === 0) score += 4;
        else if (price <= 50) score += 3;
        else if (price <= 150) score += 2;
        else score += 1;
      }
      if (priority === "quality") score += app.rating;
      if (priority === "business") score += app.businessUse?.length ? 3 : 0;
      if (priority === "popular") score += app.rating + app.tags.length / 2;
      return { app, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.app);
}
EOF

cat > src/lib/roles.ts << 'EOF'
import { createClient } from "@/lib/supabase/server";
export type UserRole = "user" | "advertiser" | "admin";
export async function getUserRole(): Promise<UserRole> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "user";
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return (data?.role as UserRole) ?? "user";
}
export async function requireRole(role: UserRole): Promise<boolean> {
  const current = await getUserRole();
  const hierarchy: UserRole[] = ["user", "advertiser", "admin"];
  return hierarchy.indexOf(current) >= hierarchy.indexOf(role);
}
EOF

cat > src/lib/seo.ts << 'EOF'
import type { Metadata } from "next";
type SEOProps = { title: string; description: string; url?: string; image?: string; keywords?: string[] };
export function buildMeta({ title, description, url = "https://apphub.eg", image = "https://apphub.eg/og.png", keywords = [] }: SEOProps): Metadata {
  const fullTitle = `${title} | AppHub`;
  return {
    title: fullTitle, description,
    keywords: ["تطبيقات", "عروض", "خصومات", "مصر", "السعودية", ...keywords].join(", "),
    openGraph: { title: fullTitle, description, url, siteName: "AppHub", images: [{ url: image, width: 1200, height: 630 }], locale: "ar_EG", type: "website" },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    alternates: { canonical: url },
    robots: { index: true, follow: true }
  };
}
EOF

cat > src/lib/affiliate.ts << 'EOF'
import { createClient } from "@/lib/supabase/client";
export type AffiliateLink = { appSlug: string; url: string; source: "amazon"|"noon"|"direct"|"other" };
export const affiliateLinks: Record<string, AffiliateLink> = {
  netflix:  { appSlug: "netflix",  url: "https://www.netflix.com/?ref=apphub",  source: "direct" },
  amazon:   { appSlug: "amazon",   url: "https://amzn.to/apphub",               source: "amazon" },
  noon:     { appSlug: "noon",     url: "https://www.noon.com/?ref=apphub",     source: "noon"   },
  coursera: { appSlug: "coursera", url: "https://www.coursera.org/?ref=apphub", source: "direct" },
  duolingo: { appSlug: "duolingo", url: "https://www.duolingo.com/?ref=apphub", source: "direct" }
};
export function getAffiliateLink(slug: string): string {
  return affiliateLinks[slug]?.url ?? "#";
}
export async function trackAffiliateClick(appSlug: string) {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  await supabase.from("affiliate_clicks").insert({ app_slug: appSlug, user_id: authData?.user?.id ?? null, ref: "apphub" });
}
EOF

cat > src/lib/stripe.ts << 'EOF'
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-06-20" });
export const PLANS = {
  starter:  { name: "باقة البداية",   price: 500,  currency: "egp", description: "عرض واحد لمدة 7 أيام",         stripePriceId: process.env.STRIPE_STARTER_PRICE_ID  ?? "" },
  business: { name: "الباقة المميزة", price: 1200, currency: "egp", description: "5 عروض في الشهر + تقارير",     stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? "" },
  partner:  { name: "باقة الشركات",   price: 2500, currency: "egp", description: "عروض غير محدودة + كل المميزات", stripePriceId: process.env.STRIPE_PARTNER_PRICE_ID  ?? "" }
};
export type PlanKey = keyof typeof PLANS;
EOF

cat > src/lib/notifications.ts << 'EOF'
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
export async function sendNotification(userId: string, title: string, body: string, link?: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from("notifications").insert({ user_id: userId, title, body, link });
  if (error) throw error;
}
export async function getMyNotifications() {
  const supabase = createBrowserClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const { data } = await supabase.from("notifications").select("*").eq("user_id", authData.user.id).order("created_at", { ascending: false }).limit(20);
  return data ?? [];
}
export async function markAllRead() {
  const supabase = createBrowserClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return;
  await supabase.from("notifications").update({ read: true }).eq("user_id", authData.user.id).eq("read", false);
}
EOF

cat > src/lib/auth.ts << 'EOF'
import { createClient as createBrowserClient } from "@/lib/supabase/client";
export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserClient();
  return supabase.auth.signInWithPassword({ email, password });
}
export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = createBrowserClient();
  return supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
}
export async function signInWithGoogle() {
  const supabase = createBrowserClient();
  return supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` } });
}
export async function signOut() {
  const supabase = createBrowserClient();
  return supabase.auth.signOut();
}
EOF

cat > src/lib/api.ts << 'EOF'
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { ReviewItem, SubscriptionItem } from "./types";

export async function getReviewsForApp(appSlug: string): Promise<ReviewItem[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("reviews").select("*").eq("app_slug", appSlug).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ReviewItem[];
}
export async function createReview(payload: { appSlug: string; userId: string; userName: string; rating: number; comment: string }) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("reviews").insert({ app_slug: payload.appSlug, user_id: payload.userId, user_name: payload.userName, rating: payload.rating, comment: payload.comment }).select().single();
  if (error) throw error;
  return data;
}
export async function subscribeNewsletter(email: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("newsletter").insert({ email }).select().single();
  if (error) throw error;
  return data;
}
export async function reportDeal(payload: { dealId: string; userId: string; comment: string }) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("deal_reports").insert({ deal_id: payload.dealId, user_id: payload.userId, comment: payload.comment }).select().single();
  if (error) throw error;
  return data;
}
export async function createSubscription(payload: Omit<SubscriptionItem, "id" | "createdAt">) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("subscriptions").insert({ user_id: payload.userId, app_name: payload.appName, plan: payload.plan, price: payload.price, cycle: payload.cycle }).select().single();
  if (error) throw error;
  return data as SubscriptionItem;
}
export async function getSubscriptions(userId: string): Promise<SubscriptionItem[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubscriptionItem[];
}
export async function deleteSubscription(id: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  if (error) throw error;
}
EOF

cat > src/lib/points.ts << 'EOF'
export const POINTS = { REVIEW: 5, REPORT_DEAL: 15, NEWSLETTER: 20, AI_RECOMMENDATION: 10, COMMENT: 5, COMPARE: 8 };
export type PointAction = keyof typeof POINTS;
export function pointsFor(action: PointAction): number { return POINTS[action]; }
EOF

echo "✅ src/lib جاهز"

# ── supabase clients ───────────────────────────────────
cat > src/lib/supabase/server.ts << 'EOF'
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch {} },
        remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: "", ...options }); } catch {} }
      }
    }
  );
}
EOF

cat > src/lib/supabase/client.ts << 'EOF'
import { createBrowserClient } from "@supabase/ssr";
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
EOF

cat > src/lib/supabase/middleware.ts << 'EOF'
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        }
      }
    }
  );
  await supabase.auth.getUser();
  return response;
}
EOF

echo "✅ supabase clients جاهزة"

# ══════════════════════════════════════════════════════
# src/data
# ══════════════════════════════════════════════════════

cat > src/data/apps.ts << 'DATAEOF'
import { AppItem } from "@/lib/types";
export const apps: AppItem[] = [
  { id:"1", slug:"talabat", name:"طلبات", icon:"🍔", category:"food", shortDescription:"توصيل أكل وبقالة في دول عربية متعددة", description:"واحد من أشهر تطبيقات التوصيل في المنطقة.", rating:4.4, pros:["مطاعم كثيرة","عروض مستمرة","واجهة سهلة"], cons:["الرسوم أحيانًا مرتفعة","السرعة تختلف حسب المنطقة"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:0,currency:"EGP"},{country:"SA",monthly:0,currency:"SAR"},{country:"AE",monthly:0,currency:"AED"}], tags:["توصيل","مطاعم","عروض"], businessUse:["restaurant","cafe"] },
  { id:"2", slug:"careem", name:"كريم", icon:"🚕", category:"transport", shortDescription:"مواصلات وتوصيل وخدمات متعددة", description:"كريم سوبر آب مناسب للمشاوير اليومية.", rating:4.3, pros:["متوفر في الخليج","خدمات متعددة","سهولة الدفع"], cons:["الأسعار تزيد وقت الذروة","توفر أقل ببعض المناطق"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:0,currency:"EGP",note:"الدفع حسب الرحلة"},{country:"SA",monthly:0,currency:"SAR",note:"الدفع حسب الرحلة"},{country:"AE",monthly:0,currency:"AED",note:"الدفع حسب الرحلة"}], tags:["مواصلات","سوبر آب"], businessUse:["delivery","field-team"] },
  { id:"3", slug:"netflix", name:"Netflix", icon:"🎬", category:"streaming", shortDescription:"أشهر منصة مشاهدة عالمية", description:"محتوى عالمي متنوع وأفلام ومسلسلات أصلية.", rating:4.7, pros:["مكتبة ضخمة","جودة عالية","تجربة ممتازة"], cons:["السعر أعلى من بعض البدائل","المحتوى العربي أقل من شاهد"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:199,yearly:2388,currency:"EGP"},{country:"SA",monthly:49,yearly:588,currency:"SAR"},{country:"AE",monthly:49,yearly:588,currency:"AED"}], tags:["أفلام","مسلسلات","عالمي"] },
  { id:"4", slug:"shahid", name:"شاهد", icon:"📺", category:"streaming", shortDescription:"أفضل منصة محتوى عربي", description:"مناسب للمستخدم العربي بمكتبة عربية واسعة.", rating:4.5, pros:["محتوى عربي قوي","مسلسلات رمضان","بث مباشر"], cons:["بعض المحتوى أقل جودة","العروض تختلف حسب البلد"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:79,yearly:948,currency:"EGP"},{country:"SA",monthly:29,yearly:348,currency:"SAR"},{country:"AE",monthly:29,yearly:348,currency:"AED"}], tags:["عربي","بث","رياضة"] },
  { id:"5", slug:"amazon", name:"Amazon", icon:"🛒", category:"shopping", shortDescription:"تسوق ومنتجات متنوعة وشحن سريع", description:"منصة تسوق ضخمة مناسبة للبحث والمقارنة.", rating:4.6, pros:["تنوع ضخم","ثقة عالية","عروض كثيرة"], cons:["التوفر يختلف حسب البلد","بعض البائعين متفاوتين"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:0,currency:"EGP"},{country:"SA",monthly:0,currency:"SAR"},{country:"AE",monthly:0,currency:"AED"}], tags:["تسوق","إلكترونيات","عروض"], businessUse:["retail","office"] },
  { id:"6", slug:"noon", name:"نون", icon:"📦", category:"shopping", shortDescription:"تسوق قوي في الخليج ومصر", description:"منصة عربية مميزة في التسوق والعروض.", rating:4.4, pros:["عروض قوية","حضور ممتاز في الخليج","تنوع جيد"], cons:["الجودة تعتمد على البائع","خدمة العملاء متفاوتة"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:0,currency:"EGP"},{country:"SA",monthly:0,currency:"SAR"},{country:"AE",monthly:0,currency:"AED"}], tags:["تسوق","خصومات","خليج"], businessUse:["retail","reseller"] },
  { id:"7", slug:"vezeeta", name:"Vezeeta", icon:"🩺", category:"health", shortDescription:"حجز دكاترة وعيادات وتحاليل", description:"من أفضل التطبيقات الصحية في مصر.", rating:4.2, pros:["سهل جدًا","حجوزات سريعة","عيادات كثيرة"], cons:["توافر أقل خارج مصر","بعض البيانات تحتاج تحديث"], countries:["EG"], pricing:[{country:"EG",monthly:0,currency:"EGP"}], tags:["صحة","دكتور","حجز"], businessUse:["clinic","doctor"] },
  { id:"8", slug:"uber", name:"Uber", icon:"🚘", category:"transport", shortDescription:"خدمة مشاوير موثوقة في مدن كثيرة", description:"مناسب للتنقل اليومي بانتشار كبير.", rating:4.5, pros:["انتشار قوي","تجربة ثابتة","خيارات متعددة"], cons:["السعر يزيد وقت الذروة","الدعم أحيانًا بطيء"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:0,currency:"EGP",note:"الدفع حسب الرحلة"},{country:"SA",monthly:0,currency:"SAR",note:"الدفع حسب الرحلة"},{country:"AE",monthly:0,currency:"AED",note:"الدفع حسب الرحلة"}], tags:["مواصلات","رحلات","موثوق"] },
  { id:"9", slug:"duolingo", name:"Duolingo", icon:"📚", category:"education", shortDescription:"تعلم لغات بشكل ممتع وسهل", description:"أفضل تطبيق للمبتدئين في تعلم اللغات.", rating:4.8, pros:["مجاني","ممتع","مناسب للمبتدئين"], cons:["ليس عميقًا للمستويات المتقدمة","التكرار أحيانًا كثير"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:0,yearly:0,currency:"EGP"},{country:"SA",monthly:0,yearly:0,currency:"SAR"},{country:"AE",monthly:0,yearly:0,currency:"AED"}], tags:["تعليم","لغات","مجاني"] },
  { id:"10", slug:"coursera", name:"Coursera", icon:"🎓", category:"education", shortDescription:"كورسات احترافية من جامعات وشركات", description:"مناسب للتطوير المهني بكورسات وشهادات متنوعة.", rating:4.6, pros:["محتوى عالي الجودة","شهادات قوية","مجالات كثيرة"], cons:["بعض المسارات مكلفة","مش مناسب للبداية دائمًا"], countries:["EG","SA","AE"], pricing:[{country:"EG",monthly:299,yearly:3588,currency:"EGP"},{country:"SA",monthly:59,yearly:708,currency:"SAR"},{country:"AE",monthly:59,yearly:708,currency:"AED"}], tags:["كورسات","شهادات","تطوير مهني"] },
  { id:"11", slug:"instapay", name:"InstaPay", icon:"💸", category:"finance", shortDescription:"تحويلات مالية لحظية في مصر", description:"تطبيق مهم للتحويل بين الحسابات والبنوك.", rating:4.7, pros:["سريع","مفيد يوميًا","مدعوم محليًا"], cons:["متاح في مصر فقط","يعتمد على دعم البنك"], countries:["EG"], pricing:[{country:"EG",monthly:0,currency:"EGP"}], tags:["فلوس","تحويل","بنوك"] },
  { id:"12", slug:"nawy", name:"Nawy", icon:"🏠", category:"real-estate", shortDescription:"بحث ومقارنة وحدات عقارية", description:"منصة حديثة للعقارات في مصر.", rating:4.1, pros:["واجهة جيدة","عروض عقارية متنوعة","بحث مرتب"], cons:["التركيز الأكبر على مصر","بعض التفاصيل تحتاج تحديث"], countries:["EG"], pricing:[{country:"EG",monthly:0,currency:"EGP"}], tags:["عقارات","شراء","استثمار"], businessUse:["real-estate","broker"] }
];
DATAEOF

cat > src/data/deals.ts << 'DATAEOF'
import { DealItem } from "@/lib/types";
export const deals: DealItem[] = [
  { id:"d1", title:"خصم 30% على أول طلب", brand:"طلبات", category:"food", discount:30, views:1420, expiresAt:"2025-12-31", code:"APPHUB30" },
  { id:"d2", title:"خصم 20% على سماعات وتكنولوجيا", brand:"Amazon", category:"tech", discount:20, views:1940, expiresAt:"2025-11-30" },
  { id:"d3", title:"خصم 15% على منتجات العناية", brand:"Noon", category:"beauty", discount:15, views:880, expiresAt:"2025-10-10", code:"CARE15" },
  { id:"d4", title:"خصم 25% على أول رحلة", brand:"Careem", category:"food", discount:25, views:1020, expiresAt:"2025-09-20", code:"RIDE25" },
  { id:"d5", title:"خصم 40% على الأزياء المختارة", brand:"Noon", category:"fashion", discount:40, views:2110, expiresAt:"2025-10-01" }
];
DATAEOF

cat > src/data/business.ts << 'DATAEOF'
import { BusinessStack } from "@/lib/types";
export const businessStacks: BusinessStack[] = [
  { id:"b1", title:"كافيه أو مطعم", description:"أهم التطبيقات لإدارة الطلبات والتسويق والتوصيل", apps:["طلبات","كريم","نون","واتساب بزنس","Canva"] },
  { id:"b2", title:"فريلانسر", description:"أدوات تساعدك في الشغل والتنظيم والتحصيل", apps:["Coursera","Duolingo","InstaPay","Notion","Canva"] },
  { id:"b3", title:"عيادة أو دكتور", description:"أدوات للحجز والتواصل وإدارة المواعيد", apps:["Vezeeta","واتساب بزنس","Google Calendar","Canva"] },
  { id:"b4", title:"سمسار أو مكتب عقاري", description:"أدوات للعرض والتسويق والمتابعة", apps:["Nawy","Bayut","واتساب بزنس","Canva","Google Drive"] }
];
DATAEOF

cat > src/data/blog-posts.ts << 'DATAEOF'
export type BlogPost = { id:string; slug:string; title:string; excerpt:string; content:string; coverUrl:string; author:string; published:boolean; createdAt:string; tags:string[] };
export const blogPosts: BlogPost[] = [
  { id:"1", slug:"best-apps-egypt-2025", title:"أفضل 10 تطبيقات في مصر لعام 2025", excerpt:"قايمة بأفضل التطبيقات اللي بتخدم المصريين كل يوم", content:"## مقدمة\n\nمصر في 2025 سوق تكنولوجي نشيط.\n\n## 1. InstaPay\n\nالتطبيق اللي غيّر طريقة تحويل الفلوس.\n\n**أسباب التميز:**\n- تحويل فوري 24/7\n- بين كل البنوك المصرية\n- مجاني تمامًا\n\n## 2. طلبات\n\nأكبر تطبيق توصيل في المنطقة.\n\n**أسباب التميز:**\n- آلاف المطاعم\n- عروض يومية\n- توصيل سريع", coverUrl:"/covers/best-apps.jpg", author:"فريق AppHub", published:true, createdAt:"2025-01-10", tags:["مصر","تطبيقات","2025"] },
  { id:"2", slug:"save-on-subscriptions", title:"إزاي توفر 500 جنيه شهريًا من اشتراكاتك", excerpt:"نصايح عملية لتقليل فاتورة الاشتراكات الشهرية", content:"## المشكلة\n\nالواحد بيدفع اشتراكات كتير من غير ما يحس.\n\n## النصايح\n\n### 1. اشترك سنويًا مش شهريًا\n- نتفليكس السنوي أوفر بـ 15%\n- سبوتيفاي السنوي أوفر بـ 17%\n\n### 2. استخدم الباقات العائلية\n- نتفليكس عائلي بـ 4 أشخاص\n- وفّر على الفرد أكتر من 60%\n\n### 3. اشترك من مصر\n- نتفليكس من مصر أرخص 40% من السعودية", coverUrl:"/covers/save-subscriptions.jpg", author:"فريق AppHub", published:true, createdAt:"2025-01-15", tags:["توفير","اشتراكات","نصايح"] },
  { id:"3", slug:"netflix-vs-shahid-vs-watchit", title:"مقارنة شاملة: نتفليكس vs شاهد vs واتش إت", excerpt:"أي منصة تناسبك؟ مقارنة بالسعر والمحتوى", content:"## نتفليكس\n- السعر: 199 ج/شهر\n- المحتوى: عالمي ضخم\n\n## شاهد\n- السعر: 79 ج/شهر\n- المحتوى: عربي قوي\n\n## واتش إت\n- السعر: 49 ج/شهر\n- المحتوى: مصري بامتياز\n\n## الخلاصة\n\nاختار حسب احتياجك.", coverUrl:"/covers/streaming.jpg", author:"فريق AppHub", published:true, createdAt:"2025-01-20", tags:["مقارنة","ستريمنج","نتفليكس"] }
];
DATAEOF

echo "✅ src/data جاهز"

# ══════════════════════════════════════════════════════
# src/components
# ══════════════════════════════════════════════════════

cat > src/components/navbar.tsx << 'EOF'
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "./notification-bell";

const links = [
  { href:"/",             label:"الرئيسية"     },
  { href:"/apps",         label:"التطبيقات"    },
  { href:"/compare",      label:"مقارنة"       },
  { href:"/deals",        label:"العروض"       },
  { href:"/ai",           label:"الترشيح الذكي"},
  { href:"/subscriptions",label:"اشتراكاتي"    },
  { href:"/business",     label:"للبيزنس"      },
  { href:"/blog",         label:"المدونة"      }
];

export async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-extrabold text-brand-600">AppHub</Link>
        <nav className="hidden gap-4 md:flex">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-700 hover:text-brand-600">{link.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <Link href="/advertiser" className="hidden text-sm font-medium text-slate-700 hover:text-brand-600 md:block">لوحة المعلن</Link>
              <Link href="/profile" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white">حسابي</Link>
            </>
          ) : (
            <Link href="/auth" className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">دخول / تسجيل</Link>
          )}
        </div>
      </div>
    </header>
  );
}
EOF

cat > src/components/app-card.tsx << 'EOF'
import Link from "next/link";
import { AppItem } from "@/lib/types";
import { categoryLabels, countryLabels } from "@/lib/constants";
export function AppCard({ app }: { app: AppItem }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{app.icon}</div>
        <div>
          <h3 className="font-bold text-slate-900">{app.name}</h3>
          <p className="text-sm text-slate-500">{categoryLabels[app.category]}</p>
        </div>
      </div>
      <p className="mb-4 text-sm text-slate-600">{app.shortDescription}</p>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">⭐ {app.rating}</span>
        <span className="text-slate-500">{app.tags.slice(0,2).join(" • ")}</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {app.countries.map(country => (
          <span key={country} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{countryLabels[country]}</span>
        ))}
      </div>
      <Link href={`/apps/${app.slug}`} className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">عرض التفاصيل</Link>
    </div>
  );
}
EOF

cat > src/components/apps-directory.tsx << 'EOF'
"use client";
import { useMemo, useState } from "react";
import { AppCard } from "./app-card";
import { AppItem, CountryCode } from "@/lib/types";
import { categoryLabels, countryLabels } from "@/lib/constants";
export function AppsDirectory({ apps }: { apps: AppItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [country, setCountry] = useState<CountryCode|"all">("all");
  const categories = useMemo(() => Array.from(new Set(apps.map(a => a.category))), [apps]);
  const filteredApps = useMemo(() => apps.filter(app => {
    const q = app.name.toLowerCase().includes(query.toLowerCase()) || app.shortDescription.toLowerCase().includes(query.toLowerCase()) || app.tags.join(" ").toLowerCase().includes(query.toLowerCase());
    const c = category === "all" || app.category === category;
    const cn = country === "all" || app.countries.includes(country as CountryCode);
    return q && c && cn;
  }), [apps, query, category, country]);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-2xl font-extrabold text-slate-900">دليل التطبيقات</h1>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500" placeholder="ابحث عن تطبيق..." value={query} onChange={e => setQuery(e.target.value)} />
          <select className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">كل الفئات</option>
            {categories.map(cat => <option key={cat} value={cat}>{categoryLabels[cat]}</option>)}
          </select>
          <select className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500" value={country} onChange={e => setCountry(e.target.value as CountryCode|"all")}>
            <option value="all">كل البلدان</option>
            {(["EG","SA","AE"] as CountryCode[]).map(c => <option key={c} value={c}>{countryLabels[c]}</option>)}
          </select>
        </div>
        <p className="mt-4 text-sm text-slate-500">عدد النتائج: {filteredApps.length}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredApps.map(app => <AppCard key={app.id} app={app} />)}
      </div>
    </div>
  );
}
EOF

cat > src/components/reviews-section.tsx << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { createReview, getReviewsForApp } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { ReviewItem } from "@/lib/types";
import { POINTS } from "@/lib/points";
export function ReviewsSection({ appSlug }: { appSlug: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|null>(null);
  const [user, setUser] = useState<{id:string;name:string}|null>(null);
  useEffect(() => {
    async function load() {
      try { const data = await getReviewsForApp(appSlug); setReviews(data); } catch {}
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) setUser({ id: authData.user.id, name: (authData.user.user_metadata as any)?.full_name ?? authData.user.email ?? "مستخدم" });
    }
    load();
  }, [appSlug]);
  async function handleSubmit() {
    if (!user) { setMessage("لازم تسجل دخول أول"); return; }
    if (!comment.trim()) return;
    setLoading(true); setMessage(null);
    try {
      await createReview({ appSlug, userId: user.id, userName: user.name, rating, comment });
      setComment("");
      const data = await getReviewsForApp(appSlug);
      setReviews(data);
      setMessage(`تم إضافة المراجعة +${POINTS.REVIEW} نقطة`);
    } catch (err: any) { setMessage(err.message ?? "حصل خطأ"); }
    finally { setLoading(false); }
  }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">التعليقات والتقييمات</h2>
        <div className="space-y-3">
          <select className="rounded-2xl border px-4 py-3" value={rating} onChange={e => setRating(Number(e.target.value))}>
            <option value={5}>⭐⭐⭐⭐⭐</option><option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option><option value={2}>⭐⭐</option><option value={1}>⭐</option>
          </select>
          <textarea className="w-full rounded-2xl border px-4 py-3" rows={3} placeholder="شاركنا رأيك..." value={comment} onChange={e => setComment(e.target.value)} />
          <button disabled={loading} onClick={handleSubmit} className="rounded-2xl bg-brand-600 px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? "جاري الإضافة..." : "أضف مراجعة"}</button>
          {message && <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700">{message}</p>}
        </div>
      </div>
      <div className="space-y-3">
        {reviews.map(review => (
          <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold">{review.user_name}</p>
              <span className="text-sm text-amber-600">{"⭐".repeat(review.rating)}</span>
            </div>
            <p className="text-slate-700">{review.comment}</p>
            <p className="mt-2 text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString("ar-EG")}</p>
          </div>
        ))}
        {!reviews.length && <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">مفيش مراجعات لسه</div>}
      </div>
    </div>
  );
}
EOF

cat > src/components/newsletter-form.tsx << 'EOF'
"use client";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState("");
  async function handleSubmit() {
    if (!email) return;
    setStatus("loading");
    try { await subscribeNewsletter(email); setStatus("success"); setMessage("اشتركت بنجاح! هنبعتلك أفضل العروض كل أسبوع"); setEmail(""); }
    catch (err: any) { setStatus("error"); setMessage(err.message ?? "حصل خطأ"); }
  }
  return (
    <div className="rounded-3xl bg-slate-900 p-6 text-white">
      <h2 className="mb-2 text-xl font-bold">اشترك في النشرة الأسبوعية</h2>
      <p className="mb-4 text-slate-300">هنوصلك أفضل 5 عروض وأحدث التطبيقات كل أسبوع</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-brand-500" placeholder="بريدك الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} />
        <button disabled={status==="loading"} onClick={handleSubmit} className="rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white disabled:opacity-60">{status==="loading" ? "جاري..." : "اشترك"}</button>
      </div>
      {message && <p className={`mt-3 rounded-xl px-4 py-3 ${status==="success" ? "bg-emerald-900 text-emerald-100" : "bg-rose-900 text-rose-100"}`}>{message}</p>}
    </div>
  );
}
EOF

cat > src/components/report-deal-button.tsx << 'EOF'
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { reportDeal } from "@/lib/api";
import { POINTS } from "@/lib/points";
export function ReportDealButton({ dealId }: { dealId: string }) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string|null>(null);
  async function handleReport() {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) { setStatus("سجل دخول الأول"); return; }
    try { await reportDeal({ dealId, userId: authData.user.id, comment }); setStatus(`تم التبليغ — +${POINTS.REPORT_DEAL} نقطة`); setComment(""); }
    catch (err: any) { setStatus(err.message ?? "حصل خطأ"); }
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <button onClick={() => setOpen(p => !p)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{open ? "إلغاء" : "بلّغ عن عرض جديد"}</button>
      {open && (
        <div className="mt-3 space-y-2">
          <textarea className="w-full rounded-2xl border px-4 py-3" rows={2} placeholder="رابط أو تفاصيل العرض..." value={comment} onChange={e => setComment(e.target.value)} />
          <button onClick={handleReport} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">إرسال</button>
          {status && <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{status}</p>}
        </div>
      )}
    </div>
  );
}
EOF

cat > src/components/notification-bell.tsx << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { getMyNotifications, markAllRead } from "@/lib/notifications";
type Notif = { id:string; title:string; body:string; read:boolean; link?:string; created_at:string };
export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  useEffect(() => { getMyNotifications().then(data => setNotifications(data as Notif[])); }, []);
  async function handleOpen() {
    setOpen(p => !p);
    if (unread > 0) { await markAllRead(); setNotifications(p => p.map(n => ({ ...n, read: true }))); }
  }
  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">
        🔔
        {unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b p-4"><h3 className="font-bold">الإشعارات</h3></div>
          <div className="max-h-72 overflow-y-auto">
            {!notifications.length ? <p className="p-4 text-center text-sm text-slate-500">مفيش إشعارات</p> :
              notifications.map(n => (
                <div key={n.id} className={`border-b p-4 text-sm ${n.read ? "bg-white" : "bg-blue-50"}`}>
                  <p className="font-bold">{n.title}</p>
                  <p className="mt-1 text-slate-600">{n.body}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(n.created_at).toLocaleDateString("ar-EG")}</p>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
EOF

cat > src/components/points-display.tsx << 'EOF'
export function PointsDisplay({ points }: { points: number }) {
  return <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-800">🏆 {points} نقطة</div>;
}
EOF

cat > src/components/profile-actions.tsx << 'EOF'
"use client";
export function ProfileActions({ signOutAction }: { signOutAction: () => Promise<void> }) {
  return (
    <button onClick={() => signOutAction()} className="rounded-2xl bg-rose-100 px-4 py-3 font-bold text-rose-700">
      تسجيل الخروج
    </button>
  );
}
EOF

cat > src/components/blog-card.tsx << 'EOF'
import Link from "next/link";
import { BlogPost } from "@/data/blog-posts";
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex flex-wrap gap-2">
        {post.tags.slice(0,3).map(tag => <span key={tag} className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-600">{tag}</span>)}
      </div>
      <h2 className="mb-2 text-lg font-bold text-slate-900">{post.title}</h2>
      <p className="mb-4 text-sm text-slate-600">{post.excerpt}</p>
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span>{post.author}</span>
        <span>{new Date(post.createdAt).toLocaleDateString("ar-EG")}</span>
      </div>
      <Link href={`/blog/${post.slug}`} className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">اقرأ المقال</Link>
    </div>
  );
}
EOF

cat > src/components/affiliate-button.tsx << 'EOF'
"use client";
import { getAffiliateLink, trackAffiliateClick } from "@/lib/affiliate";
export function AffiliateButton({ appSlug, label = "حمّل التطبيق" }: { appSlug: string; label?: string }) {
  const url = getAffiliateLink(appSlug);
  async function handleClick() { await trackAffiliateClick(appSlug); window.open(url, "_blank", "noopener,noreferrer"); }
  return (
    <button onClick={handleClick} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500">
      {label} ↗
    </button>
  );
}
EOF

cat > src/components/deal-form.tsx << 'EOF'
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function DealForm() {
  const [title, setTitle] = useState(""); const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("tech"); const [discount, setDiscount] = useState(10);
  const [expiresAt, setExpiresAt] = useState(""); const [code, setCode] = useState("");
  const [message, setMessage] = useState<string|null>(null);
  async function handleSubmit() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage("لازم تسجل دخول"); return; }
    const { error } = await supabase.from("deals").insert({ title, brand, category, discount, expires_at: expiresAt, code: code||null, advertiser_id: user.id });
    if (error) { setMessage(error.message); return; }
    setMessage("تم إضافة العرض"); setTitle(""); setBrand(""); setCode("");
  }
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">أضف عرض جديد</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-2xl border px-4 py-3" placeholder="عنوان العرض" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="rounded-2xl border px-4 py-3" placeholder="البراند" value={brand} onChange={e => setBrand(e.target.value)} />
        <select className="rounded-2xl border px-4 py-3" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="tech">تكنولوجيا</option><option value="food">أكل</option>
          <option value="beauty">جمال</option><option value="fashion">ملابس</option>
        </select>
        <input className="rounded-2xl border px-4 py-3" type="number" placeholder="نسبة الخصم" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
        <input className="rounded-2xl border px-4 py-3" type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
        <input className="rounded-2xl border px-4 py-3" placeholder="كود الخصم (اختياري)" value={code} onChange={e => setCode(e.target.value)} />
      </div>
      <button onClick={handleSubmit} className="mt-4 rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white">إضافة العرض</button>
      {message && <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">{message}</p>}
    </div>
  );
}
EOF

cat > src/components/advertiser-dashboard.tsx << 'EOF'
import { DealForm } from "./deal-form";
type Stat = { totalViews:number; activeDeals:number; estimatedRevenue:number; dealCount:number };
type Deal = { id:string; title:string; brand:string; category:string; discount:number; views:number; expires_at:string; code:string|null };
export function AdvertiserDashboard({ stats, deals, chartData }: { stats:Stat; deals:Deal[]; chartData:{name:string;views:number}[] }) {
  const maxViews = Math.max(1, ...chartData.map(d => d.views));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">لوحة تحكم المعلن</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {[["إجمالي المشاهدات", stats.totalViews],["العروض النشطة", stats.activeDeals],["عدد العروض", stats.dealCount],["الإيرادات التقديرية", `${stats.estimatedRevenue.toFixed(0)} ج`]].map(([label, val]) => (
          <div key={label as string} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-extrabold">{val}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">أداء العروض</h2>
        <div className="space-y-2">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="w-40 truncate text-sm text-slate-600">{item.name}</span>
              <div className="flex-1 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-brand-500" style={{ width: `${(item.views/maxViews)*100}%` }} /></div>
              <span className="w-16 text-right text-sm text-slate-500">{item.views}</span>
            </div>
          ))}
          {!chartData.length && <p className="text-slate-500">مفيش عروض لسه</p>}
        </div>
      </div>
      <DealForm />
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">كل العروض</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-slate-50">
              <tr>{["العنوان","البراند","الفئة","الخصم","المشاهدات","ينتهي"].map(h => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{deal.title}</td>
                  <td className="px-3 py-2">{deal.brand}</td>
                  <td className="px-3 py-2">{deal.category}</td>
                  <td className="px-3 py-2">{deal.discount}%</td>
                  <td className="px-3 py-2">{deal.views}</td>
                  <td className="px-3 py-2">{deal.expires_at}</td>
                </tr>
              ))}
              {!deals.length && <tr><td colSpan={6} className="px-3 py-4 text-center text-slate-500">مفيش عروض لسه</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/components/upgrade-plan-card.tsx << 'EOF'
import { PlanKey, PLANS } from "@/lib/stripe";
type Props = { planKey:PlanKey; plan:(typeof PLANS)[PlanKey]; loading:boolean; onSelect:(plan:PlanKey)=>void };
const highlights: Record<PlanKey, string[]> = {
  starter:  ["عرض واحد لمدة 7 أيام","إحصائيات أساسية","ظهور في الدليل"],
  business: ["5 عروض في الشهر","أولوية في الظهور","تقارير مفصّلة","ظهور في النشرة"],
  partner:  ["عروض غير محدودة","أعلى أولوية","تقارير أسبوعية","Push Notifications","لوجو على الرئيسية"]
};
export function UpgradePlanCard({ planKey, plan, loading, onSelect }: Props) {
  const isPopular = planKey === "business";
  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${isPopular ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"}`}>
      {isPopular && <span className="mb-3 inline-block rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">الأكثر شيوعًا</span>}
      <h2 className="mb-1 text-xl font-extrabold">{plan.name}</h2>
      <p className="mb-4 text-slate-500">{plan.description}</p>
      <p className="mb-6 text-3xl font-extrabold text-brand-600">{plan.price.toLocaleString("ar-EG")} ج</p>
      <ul className="mb-6 space-y-2">
        {highlights[planKey].map(item => <li key={item} className="flex items-center gap-2 text-sm text-slate-700"><span className="text-emerald-500">✓</span>{item}</li>)}
      </ul>
      <button disabled={loading} onClick={() => onSelect(planKey)} className={`w-full rounded-2xl px-4 py-3 font-bold disabled:opacity-60 ${isPopular ? "bg-brand-600 text-white hover:bg-brand-500" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
        {loading ? "جاري التحميل..." : "اشترك الآن"}
      </button>
    </div>
  );
}
EOF

echo "✅ src/components جاهز"

# ══════════════════════════════════════════════════════
# src/app
# ══════════════════════════════════════════════════════

cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
html, body { background: #f8fafc; color: #0f172a; font-family: Arial, Helvetica, sans-serif; }
* { box-sizing: border-box; }
EOF

cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
export const metadata: Metadata = { title: "AppHub", description: "دليل التطبيقات العربي" };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const navbar = await Navbar();
  return (
    <html lang="ar" dir="rtl">
      <body>
        {navbar}
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
EOF

cat > src/app/not-found.tsx << 'EOF'
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
      <h1 className="mb-3 text-3xl font-extrabold">الصفحة غير موجودة</h1>
      <p className="mb-6 text-slate-500">الرابط غير صحيح أو التطبيق مش موجود.</p>
      <Link href="/" className="rounded-2xl bg-brand-600 px-5 py-3 text-white">ارجع للرئيسية</Link>
    </div>
  );
}
EOF

cat > src/app/sitemap.ts << 'EOF'
import { MetadataRoute } from "next";
import { apps } from "@/data/apps";
import { blogPosts } from "@/data/blog-posts";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://apphub.eg";
  const staticPages = [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/apps`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/deals`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/compare`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/ai`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/business`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), priority: 0.8 }
  ];
  const appPages = apps.map(app => ({ url: `${base}/apps/${app.slug}`, lastModified: new Date(), priority: 0.7 }));
  const blogPages = blogPosts.filter(p => p.published).map(post => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date(post.createdAt), priority: 0.6 }));
  return [...staticPages, ...appPages, ...blogPages];
}
EOF

cat > src/app/robots.ts << 'EOF'
import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/auth/callback"] }, sitemap: "https://apphub.eg/sitemap.xml" };
}
EOF

cat > src/middleware.ts << 'EOF'
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
export async function middleware(request: NextRequest) { return updateSession(request); }
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
EOF

# ── Pages ──────────────────────────────────────────────

cat > src/app/page.tsx << 'EOF'
import Link from "next/link";
import { AppCard } from "@/components/app-card";
import { apps } from "@/data/apps";
import { deals } from "@/data/deals";
import { NewsletterForm } from "@/components/newsletter-form";

export default function HomePage() {
  const topApps = [...apps].sort((a,b) => b.rating - a.rating).slice(0,6);
  const topDeals = [...deals].sort((a,b) => b.discount - a.discount).slice(0,4);
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-l from-brand-600 to-slate-900 p-8 text-white">
        <p className="mb-3 text-sm opacity-80">AppHub — دليل التطبيقات العربي</p>
        <h1 className="mb-4 text-4xl font-extrabold">اكتشف أفضل التطبيقات والعروض وقارن الأسعار بسهولة</h1>
        <p className="mb-6 max-w-2xl text-white/85">منصّة عربية تساعدك تختار التطبيق المناسب حسب بلدك وميزانيتك واحتياجك.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/apps" className="rounded-2xl bg-white px-5 py-3 font-bold text-brand-600">تصفح التطبيقات</Link>
          <Link href="/ai" className="rounded-2xl border border-white/30 px-5 py-3 font-bold text-white">جرّب الترشيح الذكي</Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[["عدد التطبيقات",apps.length],["عدد الفئات",8],["العروض النشطة",deals.length],["الدول المغطاة",3]].map(([label,val]) => (
          <div key={label as string} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-extrabold">{val}</p>
          </div>
        ))}
      </section>
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">أفضل التطبيقات</h2>
          <Link href="/apps" className="text-brand-600">عرض الكل</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topApps.map(app => <AppCard key={app.id} app={app} />)}
        </div>
      </section>
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">أحدث العروض</h2>
          <Link href="/deals" className="text-brand-600">كل العروض</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topDeals.map(deal => (
            <div key={deal.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-2 text-xs text-slate-500">{deal.brand}</p>
              <h3 className="mb-3 font-bold">{deal.title}</h3>
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">خصم {deal.discount}%</span>
                <span className="text-sm text-slate-500">{deal.views} مشاهدة</span>
              </div>
              {deal.code && <p className="text-sm text-slate-600">الكود: {deal.code}</p>}
            </div>
          ))}
        </div>
      </section>
      <NewsletterForm />
    </div>
  );
}
EOF

cat > src/app/apps/page.tsx << 'EOF'
import { AppsDirectory } from "@/components/apps-directory";
import { apps } from "@/data/apps";
export default function AppsPage() { return <AppsDirectory apps={apps} />; }
EOF

cat > "src/app/apps/[slug]/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { apps } from "@/data/apps";
import { countryLabels } from "@/lib/constants";
import { formatMoney, getCheapestCountry } from "@/lib/helpers";
import { buildMeta } from "@/lib/seo";
import { ReviewsSection } from "@/components/reviews-section";
import { AffiliateButton } from "@/components/affiliate-button";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = apps.find(a => a.slug === params.slug);
  if (!app) return {};
  return buildMeta({ title: `${app.name} — مراجعة وتقييم`, description: app.description, url: `https://apphub.eg/apps/${app.slug}`, keywords: app.tags });
}
export async function generateStaticParams() { return apps.map(app => ({ slug: app.slug })); }

export default function AppDetailsPage({ params }: Props) {
  const app = apps.find(a => a.slug === params.slug);
  if (!app) return notFound();
  const cheapest = getCheapestCountry(app);
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">{app.icon}</div>
          <div>
            <h1 className="text-3xl font-extrabold">{app.name}</h1>
            <p className="text-slate-500">{app.shortDescription}</p>
          </div>
        </div>
        <p className="mb-4 text-slate-700">{app.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {app.tags.map(tag => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{tag}</span>)}
        </div>
        <AffiliateButton appSlug={app.slug} />
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">المميزات</h2>
          <ul className="space-y-2">{app.pros.map(item => <li key={item} className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">✅ {item}</li>)}</ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">العيوب</h2>
          <ul className="space-y-2">{app.cons.map(item => <li key={item} className="rounded-xl bg-rose-50 px-4 py-3 text-rose-800">❌ {item}</li>)}</ul>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">مقارنة الأسعار حسب البلد</h2>
          {cheapest && <span className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-800">🏆 الأرخص: {countryLabels[cheapest.country]}</span>}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {app.pricing.map(price => (
            <div key={price.country} className="rounded-2xl border border-slate-200 p-4">
              <p className="mb-2 font-bold">{countryLabels[price.country]}</p>
              <p className="text-sm text-slate-500">شهري: {formatMoney(price.monthly, price.currency)}</p>
              <p className="text-sm text-slate-500">سنوي: {formatMoney(price.yearly, price.currency)}</p>
              {price.note && <p className="mt-2 text-xs text-slate-400">{price.note}</p>}
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">الدول المتاحة</h2>
        <div className="flex flex-wrap gap-3">
          {app.countries.map(country => <span key={country} className="rounded-full bg-blue-50 px-4 py-2 text-blue-700">{countryLabels[country]}</span>)}
        </div>
      </section>
      <ReviewsSection appSlug={app.slug} />
    </div>
  );
}
EOF

cat > src/app/compare/page.tsx << 'EOF'
"use client";
import { useMemo, useState } from "react";
import { apps } from "@/data/apps";
import { countryLabels } from "@/lib/constants";
import { formatMoney, getPriceForCountry } from "@/lib/helpers";
import { CountryCode } from "@/lib/types";
export default function ComparePage() {
  const [first, setFirst] = useState(apps[0].slug);
  const [second, setSecond] = useState(apps[1].slug);
  const [country, setCountry] = useState<CountryCode>("EG");
  const app1 = useMemo(() => apps.find(a => a.slug === first), [first]);
  const app2 = useMemo(() => apps.find(a => a.slug === second), [second]);
  if (!app1 || !app2) return null;
  const price1 = getPriceForCountry(app1, country);
  const price2 = getPriceForCountry(app2, country);
  const winner = app1.rating > app2.rating ? app1.name : app2.rating > app1.rating ? app2.name : "تعادل";
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-extrabold">مقارنة بين تطبيقين</h1>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded-2xl border px-4 py-3" value={first} onChange={e => setFirst(e.target.value)}>
            {apps.map(app => <option key={app.id} value={app.slug}>{app.name}</option>)}
          </select>
          <select className="rounded-2xl border px-4 py-3" value={second} onChange={e => setSecond(e.target.value)}>
            {apps.map(app => <option key={app.id} value={app.slug}>{app.name}</option>)}
          </select>
          <select className="rounded-2xl border px-4 py-3" value={country} onChange={e => setCountry(e.target.value as CountryCode)}>
            <option value="EG">{countryLabels.EG}</option>
            <option value="SA">{countryLabels.SA}</option>
            <option value="AE">{countryLabels.AE}</option>
          </select>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-amber-800">🏆 الأفضل حاليًا: {winner}</p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-right">
            <tbody>
              {[
                ["العنصر", app1.name, app2.name],
                ["التقييم", `⭐ ${app1.rating}`, `⭐ ${app2.rating}`],
                ["الوصف", app1.shortDescription, app2.shortDescription],
                [`السعر في ${countryLabels[country]}`, formatMoney(price1?.monthly, price1?.currency ?? "EGP"), formatMoney(price2?.monthly, price2?.currency ?? "EGP")],
                ["متاح في البلد؟", app1.countries.includes(country)?"نعم":"لا", app2.countries.includes(country)?"نعم":"لا"],
                ["أبرز ميزة", app1.pros[0], app2.pros[0]],
                ["أبرز عيب", app1.cons[0], app2.cons[0]]
              ].map((row, i) => (
                <tr key={i} className={i===0?"bg-slate-50":"bg-white"}>
                  {row.map((cell, j) => <td key={j} className={`px-4 py-3 ${j===0?"font-bold":""} ${i>0?"border":""}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/app/deals/page.tsx << 'EOF'
"use client";
import { useMemo, useState, useEffect } from "react";
import { deals as initialDeals } from "@/data/deals";
import { ReportDealButton } from "@/components/report-deal-button";
import { DealItem } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
export default function DealsPage() {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [category, setCategory] = useState("all");
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
      if (data?.length) setDeals(data.map((row: any) => ({ id:row.id, title:row.title, brand:row.brand, category:row.category, discount:row.discount, views:row.views, expiresAt:row.expires_at, code:row.code??undefined })));
    }
    load();
  }, []);
  const filtered = useMemo(() => deals.filter(d => category==="all" || d.category===category), [deals, category]);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-extrabold">العروض والخصومات</h1>
        <select className="rounded-2xl border px-4 py-3" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">كل الفئات</option>
          <option value="tech">تكنولوجيا</option>
          <option value="food">أكل</option>
          <option value="beauty">جمال</option>
          <option value="fashion">ملابس</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(deal => (
          <div key={deal.id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">خصم {deal.discount}%</span>
              <span className="text-sm text-slate-500">{deal.views} مشاهدة</span>
            </div>
            <h3 className="text-lg font-bold">{deal.title}</h3>
            <p className="text-sm text-slate-600">البراند: {deal.brand}</p>
            <p className="text-sm text-slate-600">ينتهي: {deal.expiresAt}</p>
            {deal.code && <p className="rounded-xl bg-slate-50 px-4 py-2 text-sm">كود الخصم: {deal.code}</p>}
            <ReportDealButton dealId={deal.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

cat > src/app/ai/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { recommendApps } from "@/lib/recommend";
import { CountryCode } from "@/lib/types";
import { AppCard } from "@/components/app-card";
export default function AIPage() {
  const [activity, setActivity] = useState("entertainment");
  const [priority, setPriority] = useState("quality");
  const [country, setCountry] = useState<CountryCode>("EG");
  const [results, setResults] = useState(recommendApps({ activity:"entertainment", priority:"quality", country:"EG" }));
  function handleRecommend() { setResults(recommendApps({ activity, priority, country })); }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-extrabold">الترشيح الذكي</h1>
        <p className="mb-4 text-slate-500">جاوب 3 أسئلة وسنرشح لك أفضل التطبيقات.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded-2xl border px-4 py-3" value={activity} onChange={e => setActivity(e.target.value)}>
            <option value="food">الأكل والتوصيل</option>
            <option value="entertainment">الترفيه</option>
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
EOF

cat > src/app/subscriptions/page.tsx << 'EOF'
"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createSubscription, deleteSubscription, getSubscriptions } from "@/lib/api";
import { SubscriptionItem } from "@/lib/types";
export default function SubscriptionsPage() {
  const [items, setItems] = useState<SubscriptionItem[]>([]);
  const [appName, setAppName] = useState(""); const [plan, setPlan] = useState("");
  const [price, setPrice] = useState(""); const [cycle, setCycle] = useState<"monthly"|"yearly">("monthly");
  const [loading, setLoading] = useState(false); const [message, setMessage] = useState<string|null>(null);
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) { setMessage("سجل دخول عشان تتابع اشتراكاتك"); return; }
      try { const data = await getSubscriptions(authData.user.id); setItems(data); }
      catch (err: any) { setMessage(err.message); }
    }
    load();
  }, []);
  const monthlyTotal = useMemo(() => items.reduce((sum, item) => sum + (item.cycle==="monthly" ? item.price : item.price/12), 0), [items]);
  async function addItem() {
    setLoading(true); setMessage(null);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) { setMessage("سجل دخول الأول"); return; }
      const created = await createSubscription({ userId: authData.user.id, appName, plan, price: Number(price), cycle });
      setItems(p => [created, ...p]); setAppName(""); setPlan(""); setPrice("");
    } catch (err: any) { setMessage(err.message); }
    finally { setLoading(false); }
  }
  async function removeItem(id: string) {
    try { await deleteSubscription(id); setItems(p => p.filter(i => i.id !== id)); }
    catch (err: any) { setMessage(err.message); }
  }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-extrabold">مدير الاشتراكات</h1>
        <p className="mb-4 text-slate-500">ضيف اشتراكاتك وتابع مصاريفك.</p>
        <div className="grid gap-3 md:grid-cols-4">
          <input className="rounded-2xl border px-4 py-3" placeholder="اسم التطبيق" value={appName} onChange={e => setAppName(e.target.value)} />
          <input className="rounded-2xl border px-4 py-3" placeholder="اسم الباقة" value={plan} onChange={e => setPlan(e.target.value)} />
          <input className="rounded-2xl border px-4 py-3" placeholder="السعر" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          <select className="rounded-2xl border px-4 py-3" value={cycle} onChange={e => setCycle(e.target.value as "monthly"|"yearly")}>
            <option value="monthly">شهري</option><option value="yearly">سنوي</option>
          </select>
        </div>
        <button onClick={addItem} disabled={loading} className="mt-4 rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white disabled:opacity-60">{loading?"جاري الإضافة...":"إضافة اشتراك"}</button>
        {message && <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-slate-700">{message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">إجمالي شهري</p><p className="mt-2 text-3xl font-extrabold">{monthlyTotal.toFixed(0)} ج</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">إجمالي سنوي</p><p className="mt-2 text-3xl font-extrabold">{(monthlyTotal*12).toFixed(0)} ج</p></div>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div><h3 className="font-bold">{item.appName}</h3><p className="text-sm text-slate-500">{item.plan} — {item.price} ج — {item.cycle==="monthly"?"شهري":"سنوي"}</p></div>
            <button onClick={() => removeItem(item.id)} className="rounded-xl bg-rose-100 px-4 py-2 text-rose-700">حذف</button>
          </div>
        ))}
        {!items.length && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">مفيش اشتراكات لسه</div>}
      </div>
    </div>
  );
}
EOF

cat > src/app/business/page.tsx << 'EOF'
import { businessStacks } from "@/data/business";
export default function BusinessPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-8 text-white">
        <p className="mb-2 text-sm text-white/70">AppHub for Business</p>
        <h1 className="text-3xl font-extrabold">أفضل Stack جاهز لكل نوع بيزنس</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {businessStacks.map(stack => (
          <div key={stack.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold">{stack.title}</h2>
            <p className="mb-4 text-slate-500">{stack.description}</p>
            <ul className="space-y-2">{stack.apps.map(app => <li key={app} className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700">{app}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

cat > src/app/auth/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/lib/auth";
type Mode = "login"|"signup";
export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string|null>(null); const [message, setMessage] = useState<string|null>(null);
  async function handleEmail() {
    setLoading(true); setError(null); setMessage(null);
    try {
      if (mode==="login") { const { error } = await signInWithEmail(email, password); if (error) throw error; setMessage("تم تسجيل الدخول"); }
      else { const { error } = await signUpWithEmail(email, password, name); if (error) throw error; setMessage("تم التسجيل، فعّل إيميلك"); }
    } catch (err: any) { setError(err.message ?? "حصل خطأ"); }
    finally { setLoading(false); }
  }
  async function handleGoogle() {
    setLoading(true); setError(null);
    try { const { error } = await signInWithGoogle(); if (error) throw error; }
    catch (err: any) { setError(err.message ?? "حصل خطأ"); setLoading(false); }
  }
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-extrabold">{mode==="login"?"تسجيل الدخول":"إنشاء حساب"}</h1>
        <p className="mb-4 text-slate-500">{mode==="login"?"ادخل بإيميلك أو Google":"أنشئ حسابك وابدأ تراكم النقاط"}</p>
        {mode==="signup" && <input className="mb-3 w-full rounded-2xl border px-4 py-3" placeholder="الاسم" value={name} onChange={e => setName(e.target.value)} />}
        <input className="mb-3 w-full rounded-2xl border px-4 py-3" placeholder="البريد الإلكتروني" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="mb-3 w-full rounded-2xl border px-4 py-3" placeholder="كلمة السر" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={loading} onClick={handleEmail} className="mb-3 w-full rounded-2xl bg-brand-600 px-4 py-3 font-bold text-white disabled:opacity-60">{mode==="login"?"دخول":"تسجيل"}</button>
        <button disabled={loading} onClick={handleGoogle} className="w-full rounded-2xl border px-4 py-3 font-bold disabled:opacity-60">متابعة بـ Google</button>
        {error && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-rose-700">{error}</p>}
        {message && <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">{message}</p>}
        <button className="mt-4 text-sm text-brand-600" onClick={() => setMode(mode==="login"?"signup":"login")}>
          {mode==="login"?"مش مسجل؟ أنشئ حساب":"عندك حساب؟ سجل دخول"}
        </button>
      </div>
    </div>
  );
}
EOF

cat > src/app/auth/callback/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  if (code) { const supabase = createClient(); await supabase.auth.exchangeCodeForSession(code); }
  return NextResponse.redirect(`${origin}${next}`);
}
EOF

cat > src/app/api/auth/actions.ts << 'EOF'
"use server";
import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
export async function signOutAction() { await signOut(); redirect("/"); }
EOF

cat > src/app/profile/page.tsx << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/api/auth/actions";
import { ProfileActions } from "@/components/profile-actions";
import { PointsDisplay } from "@/components/points-display";
export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-extrabold">حسابي</h1>
        <p className="mb-1 text-slate-500">{user.email}</p>
        <p className="mb-4 text-slate-500">الاسم: {profile?.full_name ?? "—"}</p>
        <PointsDisplay points={profile?.points ?? 0} />
      </div>
      <ProfileActions signOutAction={signOutAction} />
    </div>
  );
}
EOF

cat > src/app/advertiser/page.tsx << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdvertiserDashboard } from "@/components/advertiser-dashboard";
import Link from "next/link";
export default async function AdvertiserPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  const { data: myDeals } = await supabase.from("deals").select("*").eq("advertiser_id", user.id).order("created_at", { ascending: false });
  const totalViews = (myDeals ?? []).reduce((sum, d: any) => sum + (d.views ?? 0), 0);
  const activeDeals = (myDeals ?? []).filter((d: any) => new Date(d.expires_at) > new Date()).length;
  const chartData = (myDeals ?? []).slice(0,5).map((d: any) => ({ name: d.title, views: d.views ?? 0 }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <Link href="/advertiser/upgrade" className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">ترقية الباقة</Link>
      </div>
      <AdvertiserDashboard
        stats={{ totalViews, activeDeals, estimatedRevenue: totalViews * 0.5, dealCount: myDeals?.length ?? 0 }}
        deals={myDeals ?? []}
        chartData={chartData}
      />
    </div>
  );
}
EOF

cat > src/app/advertiser/upgrade/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { PLANS, PlanKey } from "@/lib/stripe";
import { UpgradePlanCard } from "@/components/upgrade-plan-card";
export default function UpgradePage() {
  const [loading, setLoading] = useState<PlanKey|null>(null);
  const [message, setMessage] = useState<string|null>(null);
  async function handleCheckout(plan: PlanKey) {
    setLoading(plan); setMessage(null);
    try {
      const res = await fetch("/api/payments/create-session", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ plan }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMessage(data.error ?? "حصل خطأ");
    } catch { setMessage("تعذّر الاتصال بالخادم"); }
    finally { setLoading(null); }
  }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-slate-900 p-8 text-white">
        <h1 className="text-3xl font-extrabold">اختر الباقة المناسبة</h1>
        <p className="mt-2 text-white/80">وصّل عرضك لآلاف المستخدمين العرب</p>
      </div>
      {message && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-700">{message}</div>}
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(PLANS) as PlanKey[]).map(key => (
          <UpgradePlanCard key={key} planKey={key} plan={PLANS[key]} loading={loading===key} onSelect={handleCheckout} />
        ))}
      </div>
    </div>
  );
}
EOF

cat > src/app/admin/page.tsx << 'EOF'
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  const { data: reviews } = await supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(10);
  const { data: deals } = await supabase.from("deals").select("*").order("created_at", { ascending: false }).limit(10);
  const { data: subscribers } = await supabase.from("newsletter").select("*").order("created_at", { ascending: false }).limit(10);
  const { data: reports } = await supabase.from("deal_reports").select("*").order("created_at", { ascending: false }).limit(10);
  function StatCard({ title, value }: { title:string; value:number }) {
    return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-2xl font-extrabold">{value}</p></div>;
  }
  function Section({ title, rows }: { title:string; rows:{id:string;label:string;sub:string}[] }) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">{title}</h2>
        <div className="space-y-2">
          {rows.map(row => (
            <div key={row.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-medium">{row.label}</span>
              <span className="text-sm text-slate-500">{row.sub}</span>
            </div>
          ))}
          {!rows.length && <p className="text-slate-500">مفيش بيانات</p>}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">لوحة الأدمن</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="المراجعات" value={reviews?.length ?? 0} />
        <StatCard title="العروض" value={deals?.length ?? 0} />
        <StatCard title="مشتركين النشرة" value={subscribers?.length ?? 0} />
        <StatCard title="التبليغات" value={reports?.length ?? 0} />
      </div>
      <Section title="أحدث المراجعات" rows={(reviews??[]).map((r:any) => ({ id:r.id, label:r.user_name, sub:r.comment }))} />
      <Section title="أحدث العروض" rows={(deals??[]).map((d:any) => ({ id:d.id, label:d.title, sub:`${d.brand} • ${d.discount}%` }))} />
      <Section title="أحدث الاشتراكات" rows={(subscribers??[]).map((s:any) => ({ id:s.id, label:s.email, sub: new Date(s.created_at).toLocaleDateString("ar-EG") }))} />
      <Section title="أحدث التبليغات" rows={(reports??[]).map((r:any) => ({ id:r.id, label:r.comment, sub:r.deal_id }))} />
    </div>
  );
}
EOF

cat > src/app/blog/page.tsx << 'EOF'
import { blogPosts } from "@/data/blog-posts";
import { buildMeta } from "@/lib/seo";
import { BlogCard } from "@/components/blog-card";
import type { Metadata } from "next";
export const metadata: Metadata = buildMeta({ title:"المدونة", description:"مقالات ونصايح عن أفضل التطبيقات والعروض", url:"https://apphub.eg/blog", keywords:["مقالات","تطبيقات","نصايح"] });
export default function BlogPage() {
  const published = blogPosts.filter(p => p.published);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-slate-900 p-8 text-white">
        <h1 className="text-3xl font-extrabold">المدونة</h1>
        <p className="mt-2 text-white/80">مقالات ونصايح عن أفضل التطبيقات والعروض</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {published.map(post => <BlogCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
EOF

cat > "src/app/blog/[slug]/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog-posts";
import { buildMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
type Props = { params: { slug: string } };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) return {};
  return buildMeta({ title: post.title, description: post.excerpt, url: `https://apphub.eg/blog/${post.slug}`, keywords: post.tags });
}
export async function generateStaticParams() { return blogPosts.map(p => ({ slug: p.slug })); }
export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post || !post.published) return notFound();
  const related = blogPosts.filter(p => p.published && p.id !== post.id && p.tags.some(t => post.tags.includes(t))).slice(0,3);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">{post.tags.map(tag => <span key={tag} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-600">{tag}</span>)}</div>
        <h1 className="mb-2 text-3xl font-extrabold">{post.title}</h1>
        <p className="mb-4 text-slate-500">{post.author} — {new Date(post.createdAt).toLocaleDateString("ar-EG")}</p>
        <p className="mb-6 text-lg text-slate-600">{post.excerpt}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <article className="space-y-3">
          {post.content.split("\n").map((line, i) => {
            const t = line.trim();
            if (!t) return null;
            if (t.startsWith("## ")) return <h2 key={i} className="mt-6 text-2xl font-bold">{t.replace("## ","")}</h2>;
            if (t.startsWith("### ")) return <h3 key={i} className="mt-4 text-xl font-bold">{t.replace("### ","")}</h3>;
            if (t.startsWith("- ")) return <li key={i} className="mr-4 list-disc text-slate-700">{t.replace("- ","")}</li>;
            if (t.startsWith("**") && t.endsWith("**")) return <p key={i} className="font-bold">{t.replace(/\*\*/g,"")}</p>;
            return <p key={i} className="text-slate-700">{t}</p>;
          })}
        </article>
      </div>
      {related.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">مقالات ذات صلة</h2>
          <div className="space-y-3">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-brand-300">
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Link href="/blog" className="block text-brand-600">← الرجوع للمدونة</Link>
    </div>
  );
}
EOF

echo "✅ src/app جاهز"

# ── API Routes ─────────────────────────────────────────

cat > src/app/api/scraper/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const SEED_DEALS = [
  { title:"خصم 35% على طلبات أونلاين", brand:"Amazon Egypt", category:"tech", discount:35, source_url:"https://amazon.eg/deals", expires_at: new Date(Date.now()+7*24*60*60*1000).toISOString().split("T")[0] },
  { title:"وفر 20% على سلة البقالة", brand:"Noon", category:"food", discount:20, source_url:"https://noon.com/egypt-ar/deals", expires_at: new Date(Date.now()+3*24*60*60*1000).toISOString().split("T")[0] },
  { title:"خصم 50% على ملابس الشتاء", brand:"Jumia", category:"fashion", discount:50, source_url:"https://jumia.com.eg/fashion", expires_at: new Date(Date.now()+5*24*60*60*1000).toISOString().split("T")[0] }
];
export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  try {
    const { error } = await supabaseAdmin.from("scraped_deals").insert(SEED_DEALS);
    if (error) throw error;
    return NextResponse.json({ success:true, count: SEED_DEALS.length });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status:500 }); }
}
EOF

cat > src/app/api/newsletter/send/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { data: subscribers } = await supabaseAdmin.from("newsletter").select("email");
  const { data: topDeals } = await supabaseAdmin.from("deals").select("*").gt("expires_at", new Date().toISOString().split("T")[0]).order("discount", { ascending:false }).limit(5);
  if (!subscribers?.length) return NextResponse.json({ message:"مفيش مشتركين" });
  return NextResponse.json({ success:true, subscribersCount: subscribers.length, dealsCount: topDeals?.length ?? 0 });
}
EOF

cat > src/app/api/payments/create-session/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, PlanKey } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";
const supabaseAdmin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"غير مسجل" }, { status:401 });
  const { plan } = await request.json() as { plan: PlanKey };
  const selectedPlan = PLANS[plan];
  if (!selectedPlan) return NextResponse.json({ error:"باقة غير صحيحة" }, { status:400 });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: selectedPlan.currency, product_data: { name: selectedPlan.name, description: selectedPlan.description }, unit_amount: selectedPlan.price * 100 }, quantity:1 }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertiser?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertiser/upgrade?canceled=1`,
      metadata: { userId: user.id, plan }
    });
    await supabaseAdmin.from("payments").insert({ user_id:user.id, stripe_session:session.id, plan, amount:selectedPlan.price, currency:selectedPlan.currency, status:"pending" });
    return NextResponse.json({ url: session.url });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status:500 }); }
}
EOF

cat > src/app/api/payments/webhook/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error:"No signature" }, { status:400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch (err: any) { return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status:400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    if (userId && plan) {
      await supabaseAdmin.from("payments").update({ status:"paid" }).eq("stripe_session", session.id);
      await supabaseAdmin.from("profiles").update({ role:"advertiser" }).eq("id", userId);
      await supabaseAdmin.from("notifications").insert({ user_id:userId, title:"تم تفعيل الباقة", body:`تم تفعيل ${plan} بنجاح`, link:"/advertiser" });
    }
  }
  return NextResponse.json({ received:true });
}
EOF

cat > src/app/api/mobile/apps/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { apps } from "@/data/apps";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const country = searchParams.get("country");
  const query = searchParams.get("q");
  const limit = Number(searchParams.get("limit") ?? "20");
  let result = [...apps];
  if (category) result = result.filter(a => a.category === category);
  if (country) result = result.filter(a => a.countries.includes(country as any));
  if (query) { const q = query.toLowerCase(); result = result.filter(a => a.name.toLowerCase().includes(q) || a.shortDescription.toLowerCase().includes(q) || a.tags.join(" ").toLowerCase().includes(q)); }
  return NextResponse.json({ success:true, total:result.length, data:result.slice(0,limit) });
}
EOF

cat > src/app/api/mobile/deals/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { deals as staticDeals } from "@/data/deals";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function GET() {
  const { data: dbDeals } = await supabaseAdmin.from("deals").select("*").gt("expires_at", new Date().toISOString().split("T")[0]).order("created_at", { ascending:false }).limit(20);
  const combined = [...(dbDeals??[]), ...staticDeals.slice(0,5).map(d => ({ ...d, expires_at:d.expiresAt, created_at:new Date().toISOString() }))];
  return NextResponse.json({ success:true, total:combined.length, data:combined });
}
EOF

cat > src/app/api/mobile/user/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"غير مسجل" }, { status:401 });
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: subs } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending:false });
  const { data: reviews } = await supabase.from("reviews").select("*").eq("user_id", user.id);
  return NextResponse.json({ success:true, data: { id:user.id, email:user.email, profile, subscriptions:subs??[], reviews:reviews??[] } });
}
EOF

cat > src/app/api/notifications/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"غير مسجل" }, { status:401 });
  const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending:false }).limit(20);
  return NextResponse.json({ success:true, data: data??[] });
}
export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"غير مسجل" }, { status:401 });
  await supabase.from("notifications").update({ read:true }).eq("user_id", user.id).eq("read", false);
  return NextResponse.json({ success:true });
}
EOF

echo "✅ API Routes جاهزة"
echo ""
echo "╔══════════════════════════════════╗"
echo "║  ✅ AppHub جاهز بالكامل!         ║"
echo "║                                  ║"
echo "║  الخطوات التالية:                ║"
echo "║  1. cp .env.example .env.local   ║"
echo "║  2. اضبط القيم في .env.local     ║"
echo "║  3. npm install                  ║"
echo "║  4. نفّذ SQL في Supabase         ║"
echo "║  5. npm run dev                  ║"
echo "╚══════════════════════════════════╝"