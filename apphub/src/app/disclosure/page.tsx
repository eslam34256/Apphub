import Link from "next/link";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "الإفصاح والشفافية — عمولات وإعلانات واستقلالية التقييم",
  description:
    "بشفافية كاملة: إمتى بناخد عمولة، الإعلانات المدفوعة بتظهر إزاي، وليه تقييماتنا ورصد الأسعار مش قابلة للشراء.",
  url: "https://apphub.eg/disclosure",
  keywords: ["إفصاح", "شفافية", "عمولات", "إعلانات"]
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-extrabold text-brand-900">{title}</h2>
      <div className="text-charcoal-700 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function DisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-6xl mb-3">🤲</div>
        <h1 className="text-4xl font-extrabold mb-2">الإفصاح والشفافية</h1>
        <p className="text-white/90">آخر مراجعة: سبتمبر 2026</p>
      </div>

      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-soft space-y-8">

        <Section title="1. روابط العمولة (الأفيليات)">
          <p>
            بعض الروابط على المنصة — موسومة دائمًا بشارة <strong>«رابط بعمولة»</strong> —
            بتجيب لنا نسبة صغيرة لو اشتريت أو اشتركت من خلالها.
          </p>
          <ul className="space-y-2 mr-6 list-disc">
            <li>مش بتدفع أي قرش زيادة — العمولة من طرف التاجر مش منك.</li>
            <li>الشارة موجودة جنب كل رابط بعمولة — ممنوع رابط عمولة من غيرها.</li>
            <li>العمولة <strong>لا تؤثر</strong> على الترتيب ولا النجوم ولا البدائل المقترحة.</li>
          </ul>
        </Section>

        <Section title="2. الإعلانات برعاية">
          <p>
            لو وصلنا إعلان مدفوع على صفحة، هيظهر داخل إطار منفصل وبشارة <strong>«إعلان»</strong>
            واضحة قبل أي محتوى — زي اللي بتشوفه في وسائل الإعلام المحترمة.
          </p>
          <p>
            محتوى صفحات «الأفضل» ورادار الأسعار والمقارنات <strong>مش قابل للتأجير ولا للتعديل بالفلوس</strong> —
            الإعلان بيحط في خانته بس، مش جوه الحكم التحريري.
          </p>
        </Section>

        <Section title="3. استقلالية التقييم عقد مع الجمهور">
          <p>
            النجوم والترتيبات والبدائل الأوفر والرادار والمؤشر — كلها بمقاييسنا المعلنة في
            <Link href="/methodology" className="text-brand-600 font-semibold hover:underline"> صفحة المنهجية</Link> فقط.
            لا يوجد «تقييم مدفوع» ولا «ترتيب بالاتفاق». أي تاجر بيعرض فلوس مقابل ترتيب بيتقال له لأ —
            وده مدوّن في سياساتنا التجارية كمان.
          </p>
        </Section>

        <Section title="4. بيانات المجتمع والرصد">
          <p>
            بلاغات المجتمع («تجربة المجتمع») بتظهر موسومة <strong>«قيد المراجعة»</strong>
            ومش بتتحول لرقم رسمي إلا بعد تحققنا. ورادار الأسعار لا ينشر إلا التغييرات المؤكدة —
            بنفس قواعد الأمان اللي فوق.
          </p>
        </Section>

        <Section title="5. أسئلة؟">
          <p>
            لو عندك سؤال عن أي مصدر دخل عندنا أو شكك في حياد رقم، كلمنا من
            <Link href="/contact" className="text-brand-600 font-semibold hover:underline"> صفحة التواصل</Link> —
            الشفافية دي مش ديكور، دي آلية الشغل.
          </p>
        </Section>

        <div className="rounded-2xl bg-brand-50 p-6 text-sm text-charcoal-600 leading-relaxed">
          <strong className="text-brand-900">المعادلة ببساطة:</strong> بنكسب من الشفافية نفسها —
          لأن اللي بيخلي الناس تثق في أرقامنا هو نفسه اللي بيخليهم يرجعوا تاني.
        </div>

      </div>
    </div>
  );
}
