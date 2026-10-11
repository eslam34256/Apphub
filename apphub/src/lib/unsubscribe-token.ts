import { createHmac, timingSafeEqual } from "crypto";

/**
 * v42 — توكن إلغاء اشتراك آمن (HMAC) بدل الاعتماد على الـ id وحده.
 * مشتق من الـ id فمفيش عمود جديد في الداتابيز — وأي id بيتحقق منه stateless.
 * المفتاح: CRON_SECRET أو SERVICE_ROLE (متوفرين في الإنتاج — موثق في AUDIT).
 */
const keyMaterial = () => process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function makeUnsubscribeToken(id: string): string | null {
  const key = keyMaterial();
  if (!key) return null;
  return createHmac("sha256", key).update(`watchlist:${id}`).digest("hex").slice(0, 32);
}

export function verifyUnsubscribeToken(id: string, token: string): boolean {
  const key = keyMaterial();
  const raw = String(token ?? "");
  if (!key || !/^[0-9a-f]{32}$/.test(raw)) return false;
  const expected = Buffer.from(makeUnsubscribeToken(id)!, "hex");
  const got = Buffer.from(raw, "hex");
  return expected.length === got.length && timingSafeEqual(expected, got);
}

export const SITE_BASE = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app").replace(/\/+$/, "");
