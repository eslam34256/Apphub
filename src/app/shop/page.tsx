import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { WaitlistForm } from "@/components/waitlist-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMeta({
  title: "المتجر الرقمي — بطاقات وشحن بإيصال موثق",
  description:
    "بطاقات جوجل بلاي، شحن ألعاب، واشتراكات رقمية — بإيصال موثق وسعر معلن. افتح بقائمة انتظار — سجّل إيميلك وخليك أول من يعرف.",
  url: "https://apphub.eg/shop",
  keywords: ["متجر رقمي", "بطاقات جوجل بلاي", "شحن ألعاب", "قائمة انتظار"]
});

// بذور معروضة لو جدول المتجر لسه فاضي — بلا أسعار مختلقة: السعر مع التشغيل
const SEED_PRODUCTS = [
  { slug: "gplay-10", title: "بطاقة جوجل بلاي $10", kind: "card", icon: "🎮", face_value: 10, currency: "USD", description: "شحن رصيد متجر جوجل بلاي الأمريكي — كود رقمي يوصلك فورًا." },
  { slug: "gplay-25", title: "بطاقة جوجل بلاي $25", kind: "card", icon: "🎮", face_value: 25, currency: "USD", description: "أشهر فئة — كود رقمي بإيصال موثق." },
  { slug: "uc-660", title: "شدات ببجي 660 UC", kind: "topup", icon: "🔋", face_value: 660, currency: "USD", description: "شحن مباشر على حسابك في اللعبة — الموافقة الرسمية (Midasbuy وشكالها)." },
  { slug: "shahid-1m", title: "اشتراك شاهد VIP شهر", kind: "subscription", icon: "📺", face_value: null, currency: "EGP", description: "اشتراك رسمي لمدة شهر — إهداء رقمي أو تفعيل مباشر." }
];

type Product = {
  slug: string; title: string; description: string | null;
  kind: string; face_value: number | null; currency: string | null;
  icon: string | null; status?: string;
};

export default async function ShopPage() {
  let products: Product[] = SEED_PRODUCTS;
  let fromDb = false;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("shop_products")
      .select("slug, title, description, kind, face_value, currency, icon, status")
      .neq("status", "off")
      .order("created_at", { ascending: true });
    if (data && data.length > 0) {
      products = data as Product[];
      fromDb = true;
    }
  } catch { /* fallback للبذور */ }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-6xl mb-3">🏪</div>
        <h1 className="text-4xl font-extrabold mb-2">المتجر الرقمي</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          بطاقات وشحن واشتراكات بإيصال موثّق وسعر معلن — بنفس فلسفة «الرقم له تاريخ».
          حاليًا في وضع <strong>قائمة الانتظار</strong> قبل تشغيل البيع الفعلي.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <div key={p.slug} className="rounded-3xl bg-white p-6 shadow-soft space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>{p.icon ?? "🛒"}</span>
              <div className="flex-1">
                <h3 className="font-extrabold text-brand-900">{p.title}</h3>
                <p className="text-xs text-charcoal-500">
                  {p.kind === "card" ? "بطاقة" : p.kind === "topup" ? "شحن" : "اشتراك"}
                  {p.face_value != null && ` — ${p.face_value} ${p.currency ?? ""}`}
                </p>
              </div>
              <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-700">
                قريبًا
              </span>
            </div>
            <p className="text-sm text-charcoal-600 leading-relaxed">{p.description}</p>
            <p className="text-xs text-charcoal-400">
              السعر النهائي هيتحدد مع التشغيل — ممنوع نعلن رقم قبل ما نلتزم بيه.
            </p>
          </div>
        ))}
      </div>

      {/* قائمة الانتظار — الأصل الحقيقي قبل التشغيل */}
      <div className="rounded-3xl bg-white p-8 shadow-soft text-center space-y-4">
        <h2 className="heading-elegant text-3xl text-brand-900">خلّيك أول من يعرف</h2>
        <p className="text-charcoal-500 max-w-xl mx-auto">
          أول دفعة بيع هتتفتح لقائمة الانتظار بس. سجّل بريدك — وهنوصّلك دعوة الشراء بسعر التشغيل الافتتاحي.
        </p>
        <WaitlistForm interest="shop" />
        {!fromDb && (
          <p className="text-xs text-charcoal-400">
            {`(أدمن: المنتجات دي معروضة من بذور الداتا — الجدول shop_products يتحكم فيها لما يتعبّى)`}
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-brand-50 p-5 text-sm text-charcoal-600 text-center">
        💳 بوابة الدفع (Paymob) بتتفعّل مع تشغيل المتجر — مستندة إلى ملف /api/paymob/intention جاهز لاستقبال المفاتيح.
      </div>
    </div>
  );
}
