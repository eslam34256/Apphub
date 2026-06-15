import { ContactForm } from "@/components/contact-form";
import { getSiteSettings, getWhatsAppLink } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معانا — AppHub",
  description: "تواصل مع فريق AppHub. نحن هنا لمساعدتك في أي وقت"
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1 text-sm mb-3">
          💬 تواصل معانا
        </div>
        <h1 className="text-4xl font-extrabold mb-3">
          عايز تكلمنا؟ احنا هنا
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          فريقنا جاهز للرد على كل استفساراتك واقتراحاتك
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4">
          {settings.contact_email && (
            <ContactCard
              icon="📧"
              title="البريد الإلكتروني"
              value={settings.contact_email}
              link={`mailto:${settings.contact_email}`}
              color="from-brand-500 to-brand-700"
            />
          )}
          {settings.whatsapp_number && (
            <ContactCard
              icon="💬"
              title="الواتساب"
              value={settings.whatsapp_number}
              link={getWhatsAppLink(settings.whatsapp_number, "أهلاً، عايز أستفسر عن AppHub")}
              color="from-emerald-500 to-emerald-700"
            />
          )}
          {settings.phone_number && (
            <ContactCard
              icon="📞"
              title="الهاتف"
              value={settings.phone_number}
              link={`tel:${settings.phone_number}`}
              color="from-amber-500 to-orange-600"
            />
          )}
          {settings.address && (
            <ContactCard
              icon="📍"
              title="العنوان"
              value={settings.address}
              color="from-accent-500 to-pink-600"
            />
          )}

          {settings.working_hours && (
            <div className="rounded-2xl bg-white p-5 shadow-soft">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>🕐</span>
                <span>ساعات العمل</span>
              </h3>
              <p className="text-sm text-slate-600">{settings.working_hours}</p>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="rounded-3xl bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-extrabold mb-2">ابعتلنا رسالة</h2>
            <p className="text-slate-500 mb-6">هنرد عليك في أقرب وقت</p>
            <ContactForm />
          </div>
        </div>
      </div>

      <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-brand-50 p-8">
        <h2 className="text-2xl font-extrabold mb-6 text-center">أسئلة شائعة 🤔</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              q: "إزاي أقدر أضيف تطبيق جديد على المنصة؟",
              a: "تقدر تتواصل معانا عبر النموذج أو الواتساب وتقترح إضافة التطبيق."
            },
            {
              q: "هل الخدمة مجانية؟",
              a: "أيوه، كل خدمات AppHub مجانية تمامًا للمستخدمين."
            },
            {
              q: "إزاي أعلن على AppHub؟",
              a: "روح صفحة 'اعلن معانا' هتلاقي كل التفاصيل والباقات المتاحة."
            },
            {
              q: "هل بياناتي آمنة؟",
              a: "أيوه، بياناتك آمنة 100% ومش بنشاركها مع أي طرف ثالث."
            }
          ].map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl bg-white p-5 shadow-soft cursor-pointer"
            >
              <summary className="font-bold list-none flex items-center justify-between">
                <span>{item.q}</span>
                <span className="text-2xl group-open:rotate-180 transition">⌄</span>
              </summary>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon, title, value, link, color
}: {
  icon: string; title: string; value: string; link?: string; color: string;
}) {
  const content = (
    <div className="card-hover rounded-2xl bg-white p-5 shadow-soft flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{title}</p>
        <p className="font-bold truncate">{value}</p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
}