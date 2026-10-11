import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { AI_REVIEW_DATE_AR, fetchUsdEgpRate } from "@/lib/ai-radar-data";
import { AiRadarContent } from "@/components/radars/ai-content";

export const metadata: Metadata = buildMeta({
  title: "رادار اشتراكات AI — سعر ChatGPT وClaude وGemini بالجنيه المصري لايف",
  description:
    "أسعار اشتراكات الذكاء الاصطناعي بالدولار الرسمي وبالجنيه بسعر الصرف الحقيقي لايف: ChatGPT Go $8، Plus $20، Claude Pro $20، Gemini AI Plus $4.99 — مراجعة بتاريخ معلن.",
  url: "https://apphub.eg/ai-radar",
  keywords: ["سعر ChatGPT في مصر", "اشتراك ChatGPT بالجنيه", "سعر Claude مصر", "Gemini سعر"]
});

export const dynamic = "force-dynamic"; // عشان سعر الصرف يفضل طازة

export default async function AiRadarPage() {
  const { rate, source } = await fetchUsdEgpRate();
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">🤖</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">رادار اشتراكات AI</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          الأسعار الرسمية العالمية بالدولار — <strong>وبالجنيه بسعر الصرف الحقيقي لايف</strong>،
          عشان تعرف الاشتراك بيخصم من كارتك كام قبل ما تعملها.
        </p>
        <p className="mt-3 text-xs text-white/60">
          المراجعة: {AI_REVIEW_DATE_AR} · سعر الصرف: {rate != null ? `${rate} ج/دولار (${source})` : "غير متاح لحظيًا — الدولار معروض فقط بصدق"} ·
          جزء من <Link href="/price-radar" className="underline">مركز الرادارات</Link>
        </p>
      </div>
      <AiRadarContent rate={rate} source={source} />
    </div>
  );
}
