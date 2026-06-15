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
