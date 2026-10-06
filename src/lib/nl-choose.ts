import { apps } from "@/data/apps";
import { activityToScope } from "./recommend";
import { subcategoryOf } from "@/data/subcategories";
import { getMonthlyPrice } from "./helpers";
import { AppItem, CountryCode } from "./types";

/**
 * v37 — «🤖 ساعدني أختار»: محرك قرار بفهم العامية.
 * المستخدم يكتب طلبه حر → بنستخرج البلد + النشاط + الأولوية + الميزانية + «مجاني» + كلمة مفتاحية،
 * وبنرجع 🥇🥉 بأسباب واضحة — كله فوق الداتا الموجودة، بدون أي API خارجي.
 */

export type NlIntent = {
  country: CountryCode;
  activity?: string;
  priority: "price" | "quality" | "business";
  freeOnly: boolean;
  budget?: number;
  keyword?: string;
};

export type MedalResult = {
  medal: "🥇" | "🥈" | "🥉";
  title: string;
  app: AppItem;
  price: number;
  reasons: string[];
};

export type ChooseResult = { intent: NlIntent; medals: MedalResult[]; poolSize: number };

const norm = (s: string) =>
  s.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ـ/g, "");

const ACTIVITY_WORDS: [RegExp, string][] = [
  [/(انجليزي|لغه|لغات|تعلم|كورس|ذاكر|تعليم|دورات)/, "learning"],
  [/(افلام|مسلسل|نتفليكس|شاهد|مشاهده|تفرج|سينما)/, "watch"],
  [/(موسيقي|اغاني|انغامي|بودكاست)/, "music"],
  [/(اكل|توصيل|مطعم|طعام|بيتزا|فطور)/, "food"],
  [/(تسوق|شوبينج|متجر|اشتري)/, "shopping"],
  [/(صحه|رياضه|دايت|تمارين|جيم)/, "health"],
  [/(مواصلات|تاكسي|اوبر|كابتن)/, "mobility"],
  [/(بنك|فلوس|محفظه|استثمار|تمويل|محاسبه)/, "finance"],
  [/(عقار|شقه|ارض|ايجار)/, "home"],
  [/(قران|اذكار|صلاه|دين)/, "religious"],
  [/(اطفال|كرتون|ولادي)/, "kids"],
  [/(سفر|طيران|حجز|فندق)/, "travel"],
  [/(فريلانس|شغل حر)/, "freelance"],
  [/(شدات|شحن|العاب|لعبه|جيمز|ببجي)/, "gaming"],
  [/(vpn|pdf|تصميم|canva|مونتاج|انتاجيه|حمايه|خصوصيه)/, "tools"]
];

export function parseIntent(raw: string): NlIntent {
  const q = norm(raw);
  const country: CountryCode = /سعود/.test(q) ? "SA" : /(امارات|دبي|ابوظبي)/.test(q) ? "AE" : "EG";
  const freeOnly = /(مجاني|ببلاش|بلاش|free)/.test(q);
  const budgetMatch = q.match(/(\d{1,5})\s*(جنيه|جنيه|ج\b)/);
  const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : undefined;
  const priority: NlIntent["priority"] = /(ارخص|رخيص|اوفر|توفير|ميزانيه|cheap)/.test(q)
    ? "price"
    : /(شركه|بيزنس|business|crm)/.test(q)
      ? "business"
      : "quality";
  let activity: string | undefined;
  for (const [re, act] of ACTIVITY_WORDS) {
    if (re.test(q)) { activity = act; break; }
  }
  const latin = raw.match(/[a-zA-Z][a-zA-Z0-9-]{2,}/);
  return { country, activity, priority, freeOnly, budget, keyword: latin ? latin[0].toLowerCase() : undefined };
}

const priceLine = (p: number) => (p === 0 ? "مجاني تمامًا" : `حوالي ${p} ج/شهر`);

function reasonsFor(app: AppItem, price: number): string[] {
  const r = [`تقييم ${app.rating}⭐`, priceLine(price)];
  if (app.tags?.length) r.push(`قوي في: ${app.tags.slice(0, 2).join("، ")}`);
  return r;
}

export function choose(raw: string): ChooseResult {
  const intent = parseIntent(raw);
  const scope = intent.activity ? activityToScope[intent.activity] : undefined;

  let pool = apps.filter(a => a.countries.includes(intent.country));
  if (scope) {
    pool = pool.filter(a =>
      scope.sub ? scope.sub.includes(subcategoryOf(a)) : scope.cats ? scope.cats.includes(a.category) : true
    );
  }
  if (intent.keyword) {
    const k = norm(intent.keyword);
    const kw = pool.filter(a => norm(a.name).includes(k) || a.tags.some(t => norm(t).includes(k)) || norm(a.description).includes(k));
    if (kw.length) pool = kw;
  }

  const priced = pool.map(app => ({ app, price: getMonthlyPrice(app, intent.country) }));
  const budgetCap = intent.budget;
  let candidates = priced;
  if (intent.freeOnly) candidates = priced.filter(p => p.price === 0);
  else if (budgetCap !== undefined) candidates = priced.filter(p => p.price <= budgetCap);
  if (!candidates.length) candidates = priced;

  const score = ({ app, price }: { app: AppItem; price: number }) => {
    let s = app.rating;
    if (intent.priority === "price") s += price === 0 ? 4 : price <= 50 ? 3 : price <= 150 ? 2 : 1;
    if (intent.priority === "business") s += app.businessUse?.length ? 3 : 0;
    return s;
  };

  const sorted = [...candidates].sort((a, b) => score(b) - score(a));
  const medals: MedalResult[] = [];

  if (sorted[0]) medals.push({ medal: "🥇", title: "أفضل اختيار ليك", app: sorted[0].app, price: sorted[0].price, reasons: reasonsFor(sorted[0].app, sorted[0].price) });

  const rest = sorted.slice(1);
  const cheapest = [...rest].sort((a, b) => a.price - b.price)[0];
  if (cheapest) medals.push({ medal: "🥈", title: "البديل الأرخص", app: cheapest.app, price: cheapest.price, reasons: reasonsFor(cheapest.app, cheapest.price) });

  const freeBest =
    [...rest].filter(p => p.app.id !== cheapest?.app.id && p.price === 0).sort((a, b) => b.app.rating - a.app.rating)[0] ??
    rest.filter(p => p.app.id !== cheapest?.app.id).sort((a, b) => b.app.rating - a.app.rating)[0];
  if (freeBest) medals.push({ medal: "🥉", title: freeBest.price === 0 ? "أفضل خيار مجاني" : "أعلى تقييم", app: freeBest.app, price: freeBest.price, reasons: reasonsFor(freeBest.app, freeBest.price) });

  return { intent, medals, poolSize: candidates.length };
}
