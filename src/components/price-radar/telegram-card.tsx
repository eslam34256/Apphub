import Link from "next/link";

/**
 * 📡 كارت قناة «رادار AppHub» على تيليجرام.
 * سيرفر كومبوننت خفيف بيقرا NEXT_PUBLIC_TELEGRAM_CHANNEL —
 * لو القناة لسه مش متفعلة بيبقى شارة «قريبًا» بدل ما يخفي الكارت،
 * عشان الصفحة متتكسرش قبل ما يتعمل الـ setup اليدوي.
 */
export function TelegramCard() {
  const channel = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL?.trim() ?? "";
  const url = channel ? `https://t.me/${channel.replace(/^@/, "")}` : null;

  return (
    <section className="card-elegant overflow-hidden border-r-4 border-r-[#229ED9] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <span className="w-14 h-14 shrink-0 rounded-2xl bg-[#229ED9]/10 flex items-center justify-center text-4xl">
          📡
        </span>
        <div className="flex-1">
          <h2 className="heading-elegant text-xl text-brand-900">
            عايز يوصلك أي تغيّر سعر أول بأول؟
          </h2>
          <p className="mt-1 text-sm leading-6 text-charcoal-500">
            قناة «رادار AppHub» على تيليجرام: كل حركة سعر موثّقة بتتبعت رسالة
            فورية — وفيها 🥇 <b>أوفر بديل من نفس النوع</b> تلقائيًا.
            من غير تسجيل ولا إيميلات ولا حاجة تشغل بالك.
          </p>
        </div>
        {url ? (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[#229ED9] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            ✈️ تابع القناة ←
          </Link>
        ) : (
          <span className="shrink-0 rounded-full bg-cream-100 border border-cream-200 px-6 py-3 text-sm font-bold text-charcoal-500">
            القناة بتتمّ تجهيزها 🚧
          </span>
        )}
      </div>
    </section>
  );
}
