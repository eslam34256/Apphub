/**
 * v42 — إدارة موافقة الكوكيز/التتبع (privacy-first):
 * - مفيش أي تتبع غير ضروري قبل الموافقة الصريحة (الافتراضي = مرفوض)
 * - الاختيار بيتحفظ محليًا وقابل للتغيير في أي وقت من الفوتر
 * - مفيش أدوات تحليلات طرف-تالت أصلًا — التتبع الموجود first-party لأغراض
 *   نسب العمولة، وبيتصنف «اختياري» وبيتوقف لو المستخدم رفض
 */
const KEY = "apphub-consent";

export type ConsentState = { analytics: boolean; ts: string };

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ analytics, ts: new Date().toISOString() }));
  } catch { /* تخزين مش متاح — نكمل بدون حفظ */ }
  window.dispatchEvent(new CustomEvent("apphub:consent-changed"));
}

/** هل التتبع غير الضروري (beacons نسب العمولة) مسموح؟ الافتراضي: لأ */
export function consentAllowsTracking(): boolean {
  return getConsent()?.analytics === true;
}

export function clearConsent() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
  window.dispatchEvent(new CustomEvent("apphub:consent-open"));
}
