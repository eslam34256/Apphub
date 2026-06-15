import Link from "next/link";
import { getSiteSettings, getWhatsAppLink } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  const socials = [
    { url: settings.facebook_url, icon: "📘", label: "Facebook" },
    { url: settings.instagram_url, icon: "📷", label: "Instagram" },
    { url: settings.twitter_url, icon: "🐦", label: "Twitter" },
    { url: settings.youtube_url, icon: "📺", label: "YouTube" },
    { url: settings.linkedin_url, icon: "💼", label: "LinkedIn" },
    { url: settings.tiktok_url, icon: "🎵", label: "TikTok" }
  ].filter((s) => s.url && s.url.trim() !== "");

  return (
    <footer className="mt-20 border-t border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-extrabold text-xl">
                A
              </div>
              <div>
                <p className="text-xl font-extrabold bg-gradient-to-l from-brand-600 to-accent-500 bg-clip-text text-transparent">
                  {settings.site_name}
                </p>
                <p className="text-[10px] text-slate-500 -mt-1">
                  دليل التطبيقات العربي
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {settings.site_description}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 hover:text-brand-600 transition"
                >
                  <span>📧</span>
                  <span>{settings.contact_email}</span>
                </a>
              )}
              {settings.whatsapp_number && (
                <a
                  href={getWhatsAppLink(settings.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-600 transition"
                >
                  <span>💬</span>
                  <span>{settings.whatsapp_number}</span>
                </a>
              )}
              {settings.phone_number && settings.phone_number !== settings.whatsapp_number && (
                <a
                  href={`tel:${settings.phone_number}`}
                  className="flex items-center gap-2 hover:text-brand-600 transition"
                >
                  <span>📞</span>
                  <span>{settings.phone_number}</span>
                </a>
              )}
              {settings.address && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{settings.address}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            {socials.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:border-brand-300 hover:scale-110 transition"
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-3 text-slate-900">المنصة</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/apps" label="التطبيقات" />
              <FooterLink href="/compare-hub" label="المقارنات" />
              <FooterLink href="/deals" label="العروض" />
              <FooterLink href="/blog" label="المدونة" />
              <FooterLink href="/ai" label="الترشيحات الذكية" />
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-3 text-slate-900">الشركة</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/about" label="من نحن" />
              <FooterLink href="/contact" label="تواصل معانا" />
              <FooterLink href="/advertise" label="اعلن معانا" />
              <FooterLink href="/business" label="للبيزنس" />
              <FooterLink href="/careers" label="وظائف" />
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-3 text-slate-900">القانونية</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/privacy" label="سياسة الخصوصية" />
              <FooterLink href="/terms" label="الشروط والأحكام" />
              <FooterLink href="/cookies" label="سياسة الكوكيز" />
              <FooterLink href="/disclaimer" label="إخلاء المسؤولية" />
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {settings.site_name}. كل الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>صُنع بـ</span>
            <span className="text-rose-500">❤️</span>
            <span>في مصر</span>
            <span className="text-2xl">🇪🇬</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-slate-600 hover:text-brand-600 transition">
        {label}
      </Link>
    </li>
  );
}