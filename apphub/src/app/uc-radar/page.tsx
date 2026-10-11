import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { UC_REVIEW_DATE_AR } from "@/lib/uc-data";
import { UcRadarContent } from "@/components/radars/uc-content";

export const metadata: Metadata = buildMeta({
  title: "رادار شدات ببجي — سعر UC في مصر بالجنيه (رسمي vs سوق)",
  description:
    "جدول أسعار شدات ببجي UC في مصر من Midasbuy الرسمي + سعر الوحدة لكل باقة + حاسبة أرخص تشكيلة شحن — مراجعة بتاريخ معلن، مفيش أرقام مختلقة.",
  url: "https://apphub.eg/uc-radar",
  keywords: ["سعر شدات ببجي", "UC price Egypt", "شدات ببجي بالجنيه", "Midasbuy", "شحن UC"]
});

// صفحة مستقلة (SEO + مشاركة) — المحتوى نفسه بيتشارك مع مركز الرادارات
export default function UcRadarPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">🎮</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">رادار شدات ببجي</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          سعر UC في مصر <strong>بسعر الوحدة</strong> (جنيه لكل 100 شدة) — عشان تعرف أي باقة أرخص فعلًا،
          وأي «عرض» في السوق بيوفّر فلوس ولا مجرد شكل.
        </p>
        <p className="mt-3 text-xs text-white/60">
          المراجعة: {UC_REVIEW_DATE_AR} · المصدر الرسمي: Midasbuy (الشريك الرسمي لببجي) ·
          جزء من <a href="/price-radar" className="underline">مركز الرادارات</a>
        </p>
      </div>
      <UcRadarContent />
    </div>
  );
}
