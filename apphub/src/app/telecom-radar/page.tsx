import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { TELECOM_REVIEW_DATE_AR } from "@/lib/telecom-data";
import { TelecomRadarContent } from "@/components/radars/telecom-content";

export const metadata: Metadata = buildMeta({
  title: "رادار الباقات — أرخص جيجابايت في مصر (فودافون/أورنج/WE)",
  description:
    "مقارنة باقات الإنترنت في مصر بسعر الجيجا الحقيقي: هوائي فودافون وWE وأورنج + باقات النت الموبايل والمشتركة — مراجعة بتاريخ معلن وحاسبة «أحسن باقة لاستخدامك».",
  url: "https://apphub.eg/telecom-radar",
  keywords: ["باقات الإنترنت مصر", "أرخص باقة نت", "باقات فودافون", "باقات WE", "أنظمة أورنج"]
});

export default function TelecomRadarPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">📶</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">رادار الباقات</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          باقات الإنترنت في مصر بزيادة مستمرة والأسماء متلخبطة على قصد —
          إحنا بنوحّدها بمقياس واحد: <strong>الجنيه لكل جيجابايت</strong>، زي سعر اللتر في البنزين.
        </p>
        <p className="mt-3 text-xs text-white/60">
          المراجعة: {TELECOM_REVIEW_DATE_AR} · المصادر: قوائم الشركات + تغطيات صحفية موثّقة ·
          جزء من <a href="/price-radar" className="underline">مركز الرادارات</a>
        </p>
      </div>
      <TelecomRadarContent />
    </div>
  );
}
