import { DealItem } from "./types";

/**
 * منطق صلاحية العروض مشترك بين صفحة /deals والرئيسية.
 * العرض صالح حتى نهاية يوم انتهاءه (بتوقيت المستخدم).
 */

export function isDealExpired(deal: DealItem): boolean {
  const end = new Date(`${deal.expiresAt}T23:59:59`);
  return end.getTime() < Date.now();
}

/** كام يوم فاضل — سالب لو منتهي */
export function getDaysLeft(deal: DealItem): number {
  const end = new Date(`${deal.expiresAt}T23:59:59`);
  return Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/** العروض الصالحة فقط — مرتبة بالأقرب انتهاءً (urgency أولاً) */
export function getActiveDeals(deals: DealItem[]): DealItem[] {
  return deals
    .filter((d) => !isDealExpired(d))
    .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
}

/** العروض المنتهية — الأحدث انتهاءً أولاً */
export function getExpiredDeals(deals: DealItem[]): DealItem[] {
  return deals
    .filter(isDealExpired)
    .sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime());
}

/** ليبل الصلاحية: «ينتهي خلال 3 أيام ⏳» / «آخر يوم🔥» */
export function getExpiryLabel(deal: DealItem): { text: string; urgent: boolean } {
  const days = getDaysLeft(deal);
  if (days <= 0) return { text: "آخر يوم! 🔥", urgent: true };
  if (days === 1) return { text: "فاضل يوم واحد", urgent: true };
  if (days <= 7) return { text: `فاضل ${days} أيام ⏳`, urgent: true };
  return { text: `ينتهي ${deal.expiresAt}`, urgent: false };
}
