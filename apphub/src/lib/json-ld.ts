/**
 * JSON-LD آمن للحقن في <script type="application/ld+json">.
 * JSON.stringify وحدها مش كافية: `<` في أي نص DB ممكن يقفل الـ script مبكرًا ويحقن كود — بنحوّله لـ \<.
 * القاعدة (SECURITY-AUDIT #2): أي JSON يتوضع inline في DOM يعدّي من هنا.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
