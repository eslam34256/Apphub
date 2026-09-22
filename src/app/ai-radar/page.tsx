import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { AI_TOOLS, AI_REVIEW_DATE_AR, fetchUsdEgpRate, egp, type AiTool } from "@/lib/ai-radar-data";

export const metadata: Metadata = buildMeta({
  title: "رادار اشتراكات AI — سعر ChatGPT وClaude وGemini بالجنيه المصري لايف",
  description:
    "أسعار اشتراكات الذكاء الاصطناعي بالدولار الرسمي وبالجنيه بسعر الصرف الحقيقي لايف: ChatGPT Go $8، Plus $20، Claude Pro $20، Gemini AI Plus $4.99 — مراجعة بتاريخ معلن.",
  url: "https://apphub.eg/ai-radar",
  keywords: ["سعر ChatGPT في مصر", "اشتراك ChatGPT بالجنيه", "سعر Claude مصر", "Gemini سعر"]
});

export const dynamic = "force-dynamic"; // عشان سعر الصرف يفضل طازة

const fmtUsd = (n: number) => `$${n}`;

function ToolCard({ tool, rate }: { tool: AiTool; rate: number | null }) {
  const cheapestPaid = tool.tiers[0];
  const egpCheapest = cheapestPaid ? egp(cheapestPaid.usd, rate) : null;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft space-y-4">
      <div className="flex items-center gap-3">
        <span className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl ${tool.color}`}>
          {tool.icon}
        </span>
        <div className="flex-1">
          <h3 className="font-extrabold text-brand-900 text-lg">{tool.name}</h3>
          <p className="text-xs text-charcoal-500">{tool.bestFor}</p>
        </div>
        {cheapestPaid ? (
          <div className="text-end">
            <div className="font-extrabold text-accent-600 text-lg">{fmtUsd(cheapestPaid.usd)}</div>
            <div className="text-[11px] text-charcoal-500">
              {egpCheapest != null ? `≈ ${egpCheapest.toLocaleString("ar-EG")} ج` : "بالدولار"}
            </div>
          </div>
        ) : (
          <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-sage-700">مجاني 💚</span>
        )}
      </div>

      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-cream-100">
            <td className="py-2 font-bold text-sage-700">مجاني</td>
            <td className="py-2 text-charcoal-600" colSpan={2}>{tool.free}</td>
          </tr>
          {tool.tiers.map((t) => {
            const e = egp(t.usd, rate);
            return (
              <tr key={t.name} className="border-b border-cream-100">
                <td className="py-2.5 w-1/4">
                  <span className="font-bold text-brand-900">{t.name}</span>
                </td>
                <td className="py-2.5 w-1/4 whitespace-nowrap">
                  <span className="font-extrabold">{fmtUsd(t.usd)}</span>
                  {e != null && (
                    <span className="text-xs text-charcoal-500"> ≈ {e.toLocaleString("ar-EG")} ج</span>
                  )}
                </td>
                <td className="py-2.5 text-xs text-charcoal-500">{t.tag}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function AiRadarPage() {
  const { rate, source } = await fetchUsdEgpRate();
  const cheapest = AI_TOOLS
    .flatMap((t) => t.tiers.map((tier) => ({ tool: t.name, ...tier })))
    .sort((a, b) => a.usd - b.usd)[0];
  const allIn = AI_TOOLS
    .map((t) => t.tiers.find((x) => x.usd >= 19.99 && x.usd <= 21))
    .filter(Boolean)
    .reduce((s, x) => s + (x?.usd ?? 0), 0);
  const egpCheapest = egp(cheapest.usd, rate);
  const egpAllIn = rate != null ? Math.round(allIn * rate) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl gradient-brand p-8 sm:p-10 text-white text-center">
        <div className="text-6xl mb-3">🤖</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">رادار اشتراكات AI</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          الأسعار الرسمية العالمية بالدولار — <strong>وبالجنيه بسعر الصرف الحقيقي لايف</strong>،
          عشان تعرف الاشتراك بيخصم من كارتك كام قبل ما تعملها.
        </p>
        <p className="mt-3 text-xs text-white/60">
          المراجعة: {AI_REVIEW_DATE_AR} · سعر الصرف: {rate != null ? `${rate} ج/دولار (${source})` : "غير متاح لحظيًا — الدولار معروض فقط بصدق"}
        </p>
      </div>

      {/* الرقم الكبير */}
      <div className="grid gap-4 md:grid-cols-3 text-center">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-sm text-charcoal-500 mb-1">أرخص AI مدفوع</div>
          <div className="text-2xl font-extrabold text-brand-900">
            {fmtUsd(cheapest.usd)}
            {egpCheapest != null && <span className="text-lg"> ≈ {egpCheapest.toLocaleString("ar-EG")} ج</span>}
          </div>
          <div className="text-xs text-charcoal-400 mt-1">{cheapest.tool} {cheapest.name}/شهر</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-sm text-charcoal-500 mb-1">السعر المعياري للسوق</div>
          <div className="text-2xl font-extrabold text-brand-900">
            $20{rate != null && <span className="text-lg"> ≈ {Math.round(20 * rate).toLocaleString("ar-EG")} ج</span>}
          </div>
          <div className="text-xs text-charcoal-400 mt-1">ChatGPT Plus = Claude Pro ≈ Gemini AI Pro</div>
        </div>
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-6 shadow-soft">
          <div className="text-sm text-red-700 mb-1">فخ «كلهم مع بعض»</div>
          <div className="text-2xl font-extrabold text-red-800">
            ≈ ${allIn}{egpAllIn != null && <span className="text-lg"> ≈ {egpAllIn.toLocaleString("ar-EG")} ج</span>}
          </div>
          <div className="text-xs text-red-600 mt-1">في الشهر — ٧٠٪ منهم نفس الحاجة بصراحة</div>
        </div>
      </div>

      {/* الأدوات */}
      <div className="grid gap-5 md:grid-cols-2">
        {AI_TOOLS.map((t) => (
          <ToolCard key={t.id} tool={t} rate={rate} />
        ))}
      </div>

      {/* أجندة اختيار ذكي */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft space-y-3">
        <h2 className="heading-elegant text-2xl sm:text-3xl text-brand-900">🧭 اختار بذكاء — في ٣ قواعد</h2>
        <ol className="text-sm text-charcoal-600 space-y-2 list-decimal mr-5">
          <li><strong>ابدأ ببلاش</strong> — المستوى المجاني عند ChatGPT وGemini كافي للتجربة الحقيقية. لو بتوصل للحد يوميًا ساعتها بس فكر في الدفع.</li>
          <li><strong>اشتراك واحد يكفي ٩٥٪</strong> — $20 في أي من الكبار التلاتة بينجز نفس الشغل تقريبًا؛ الاشتراك الثاني بيبقى فخ «التخصص الوهمي» إلا لو محتاج مهمة محددة (سياق ضخم = Gemini؛ كود ثقيل = Claude؛ كل حاجة مع بعض = ChatGPT).</li>
          <li><strong>بكارت مصري بالدولار</strong> — البنك بيحاسبك بسعر الصرف وقت الخصم + ممكن رسوم إضافية بنسبة بسيطة؛ الجنيه الظاهر فوق استرشادي لحظي من {source ?? "المصدر"}.</li>
        </ol>
      </div>

      {/* بيانات مفتوحة */}
      <div className="rounded-2xl bg-brand-50 p-5 text-sm text-charcoal-600 text-center">
        📡 نفس الداتا JSON: <code dir="ltr" className="rounded bg-white px-2 py-0.5">/api/ai-radar</code>
        {" — "}
        <Link href="/disclosure" className="font-bold underline">عقد الأرقام عندنا</Link>
      </div>
    </div>
  );
}
