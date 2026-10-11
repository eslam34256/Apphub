import Link from "next/link";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { affiliateLinks } from "@/lib/affiliate";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = buildMeta({
  title: "برنامج الشراكة — حوّل اكتشافك للتطبيقات إلى فرص ربح",
  description:
    "اكتشف التطبيقات والخدمات الرقمية المناسبة لك، وتعرّف على العروض وروابط الشراء المتاحة من خلال AppHub — بإفصاح كامل وشفافية.",
  url: "/affiliate",
  keywords: ["أفيليات", "عمولة", "عروض", "شراكات", "AppHub"]
});

export const dynamic = "force-dynamic";

export default async function AffiliatePage() {
  // العروض المعتمدة فقط: ستاتيك active + DB active (لو متاح)
  const staticActive = Object.values(affiliateLinks).filter(l => l.status === "active");
  let dbActive: { destination: string; provider: string | null; app_slug: string | null }[] = [];
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin.from("affiliate_links").select("destination, provider, app_slug").eq("status", "active").limit(12);
    dbActive = (data ?? []) as typeof dbActive;
  }
  const hasActive = staticActive.length + dbActive.length > 0;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1) Hero */}
      <section className="rounded-3xl gradient-brand p-10 sm:p-14 text-white text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-snug">حوّل اكتشافك للتطبيقات إلى فرص ربح</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
          اكتشف التطبيقات والخدمات الرقمية المناسبة لك، وتعرّف على العروض وروابط الشراء المتاحة من خلال AppHub.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/deals" className="rounded-2xl bg-white px-7 py-3.5 font-extrabold text-brand-700 hover:scale-105 transition">اكتشف العروض</Link>
          <Link href="/advertise" className="rounded-2xl border border-white/40 bg-white/10 px-7 py-3.5 font-extrabold text-white hover:bg-white/20 transition">للشركات والشركاء</Link>
        </div>
      </section>

      {/* 2) How it works */}
      <section className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-center text-3xl font-extrabold">إزاي يشتغل؟</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ["🔍", "اكتشف", "تطبيق أو خدمة رقمية تناسبك"],
            ["📊", "قارن", "المميزات والأسعار والعروض المتاحة"],
            ["↗", "زُر المزوّد", "عبر الرابط الرسمي المعروض"],
            ["🤝", "عمولة محتملة", "AppHub قد يكسب عمولة لو اكتمل شراء أو اشتراك مؤهل"]
          ].map(([icon, t, d], i) => (
            <div key={t} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-3xl">{icon}</p>
              <p className="mt-2 font-extrabold">{i + 1}. {t}</p>
              <p className="mt-1 text-sm text-slate-500">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3) Disclosure */}
      <section className="mx-auto max-w-4xl rounded-3xl border-2 border-accent-300 bg-accent-50 p-7">
        <h2 className="text-xl font-extrabold text-accent-900">📣 إفصاح الأفيليات</h2>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
          <li>• بعض الروابط في AppHub قد تكسبنا عمولة <strong>بدون أي تكلفة إضافية عليك</strong>.</li>
          <li>• العمولة <strong>لا تحدد تلقائيًا</strong> ترتيبنا أو ترشيحاتنا — التقييم التحريري مستقل.</li>
          <li>• <strong>ليس كل الروابط عمولة</strong> — معظمها روابط رسمية عادية، وروابط العمولة موسومة بشارة «رابط بعمولة».</li>
          <li>• الشارة بتظهر جنب الرابط المعني، والتفاصيل الكاملة في <Link className="font-bold underline" href="/disclosure">صفحة الإفصاح</Link>.</li>
        </ul>
      </section>

      {/* 4) Featured offers — معتمد فقط، وصفر اختلاق */}
      <section className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-center text-3xl font-extrabold">عروض مميزة</h2>
        {hasActive ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {staticActive.map(l => (
              <div key={l.appSlug} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-extrabold">{l.appSlug}</p>
                <p className="mt-1 text-xs text-slate-500">المزوّد: {l.provider ?? l.source} · حالة: معتمد</p>
              </div>
            ))}
            {dbActive.map((l, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-extrabold">{l.app_slug ?? l.provider}</p>
                <p className="mt-1 text-xs text-slate-500">المزوّد: {l.provider}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-lg font-extrabold">لا توجد روابط عمولة معتمدة حاليًا</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              بنعرض روابط العمولة فقط بعد الاعتماد الرسمي من الشبكات. لحد ساعتها، كل روابطنا خارجية عادية
              والعروض التحريرية المراجعة بتلاقيها في <Link href="/deals" className="font-bold text-brand-600 underline">صفحة العروض</Link>.
            </p>
          </div>
        )}
      </section>

      {/* 5) For businesses */}
      <section className="rounded-3xl bg-slate-900 p-9 text-white text-center">
        <h2 className="text-2xl font-extrabold">للشركات ومزوّدي الخدمات</h2>
        <p className="mx-auto mt-2 max-w-2xl text-white/80">
          عندك خدمة رقمية وعايز توصل لجمهور بيقارن ويقرر فعلًا؟ بنشتغل بشراكات معلنة وواضحة —
          من الرعاية لبرامج العمولة الرسمية.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("أهلًا، مهتمين بشراكة أفيليات مع AppHub")}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#25D366] px-6 py-3 font-extrabold text-white hover:opacity-90 transition">تواصل معنا للشراكة</a>
          <Link href="/advertise" className="rounded-2xl border border-white/30 px-6 py-3 font-extrabold text-white hover:bg-white/10 transition">باقات الإعلان</Link>
        </div>
      </section>

      {/* 6) FAQ */}
      <section className="mx-auto max-w-3xl space-y-3">
        <h2 className="mb-5 text-center text-3xl font-extrabold">أسئلة شائعة</h2>
        {[
          ["هل يدفع المستخدم مقابل الوصول للعروض؟", "لا — كل المحتوى والمقارنات والعروض مجانية بالكامل."],
          ["كيف يكسب AppHub عمولات؟", "عبر برامج شراكة رسمية: لو اشتريت أو اشتركت من رابط عمولة معتمد، قد نحصل على نسبة من المزوّد بدون زيادة في سعرك."],
          ["هل كل الروابط روابط عمولة؟", "لا — أغلب الروابط رسمية عادية. روابط العمولة فقط هي الموسومة بشارة «رابط بعمولة»."],
          ["كيف تُتحقق العروض؟", "بمراجعة يدوية بتاريخ معلن ومصدر رسمي، والعروض منتهية الصلاحية بتترشح تلقائيًا."],
          ["هل تؤثر العمولة على ترشيحات AppHub؟", "لا — التقييم التحريري مستقل، والعمولة لا تحدد الترتيب."],
          ["كيف يطلب مزوّد شراكة؟", "من زر «تواصل معنا للشراكة» أعلاه أو صفحة الإعلان — بنرد خلال يوم عمل."]
        ].map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer list-none font-extrabold text-slate-800 marker:hidden">❓ {q}</summary>
            <p className="mt-2 text-sm leading-7 text-slate-600">{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
