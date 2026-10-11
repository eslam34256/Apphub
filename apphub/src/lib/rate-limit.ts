/**
 * Rate limiter خفيف في الذاكرة (per-instance).
 * كافي يكسر سكربتات السبام الأولى على الـ POSTs العامة؛
 * الترقية الحقيقية بعد الإطلاق: Upstash/Redis موزّع عبر الإنستانسز.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

/** true لو المفتاح عدّى الحد — المفروض يرجع 429 */
export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  b.count += 1;
  // سقف للخريطة عشان الذاكرة
  if (buckets.size > 5000) buckets.clear();
  return b.count > limit;
}

export function getClientIp(req: Request): string {
  const h = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  return h || req.headers.get("x-real-ip") || "anon";
}
