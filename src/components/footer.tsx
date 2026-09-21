"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { createClient } from "@/lib/supabase/client";

export function Footer() {
  const { t, lang } = useLanguage();
  const [settings, setSettings] = useState<any>({
    site_name: "AppHub",
    contact_email: "Eslam34256@gmail.com",
    whatsapp_number: "+201155572676",
    phone_number: "01155572676",
    address: lang === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"
  });

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const map: any = {};
        data.forEach((s: any) => {
          map[s.key] = typeof s.value === "string" ? s.value : JSON.parse(JSON.stringify(s.value));
        });
        setSettings({ ...settings, ...map });
      }
    }
    loadSettings();
  }, []);

  const cleanWhatsApp = settings.whatsapp_number?.replace(/[^0-9]/g, "") || "";

  return (
    <footer className="bg-cream-100 border-t border-cream-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-navy flex items-center justify-center text-white heading-elegant text-2xl">
                A
              </div>
              <div>
                <p className="heading-elegant text-2xl text-brand-900">AppHub</p>
                <p className="text-[10px] text-charcoal-500 tracking-wider">
                  {t("site_tagline")}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-charcoal-500">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 hover:text-accent-600 transition"
                >
                  <span>📧</span>
                  <span>{settings.contact_email}</span>
                </a>
              )}
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  className="flex items-center gap-2 hover:text-accent-600 transition"
                >
                  <span>💬</span>
                  <span>{settings.whatsapp_number}</span>
                </a>
              )}
              {settings.phone_number && (
                <a
                  href={`tel:${settings.phone_number}`}
                  className="flex items-center gap-2 hover:text-accent-600 transition"
                >
                  <span>📞</span>
                  <span>{settings.phone_number}</span>
                </a>
              )}
              {settings.address && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{lang === "ar" ? "القاهرة، مصر" : "Cairo, Egypt"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="heading-elegant text-lg text-brand-900 mb-4">
              {t("footer_platform")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/apps" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_apps")}
                </Link>
              </li>
              <li>
                <Link href="/compare-hub" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_compare")}
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_deals")}
                </Link>
              </li>
              <li>
                <Link href="/price-index" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_price_index")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_shop")}
                </Link>
              </li>
              <li>
                <Link href="/data" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_data")}
                </Link>
              </li>
              <li>
                <Link href="/uc-radar" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_uc")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_blog")}
                </Link>
              </li>
              <li>
                <Link href="/ai" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_ai")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="heading-elegant text-lg text-brand-900 mb-4">
              {t("footer_company")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_contact")}
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_advertise")}
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_business")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_careers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="heading-elegant text-lg text-brand-900 mb-4">
              {t("footer_legal")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_terms")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_cookies")}
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("nav_disclosure")}
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_methodology")}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-charcoal-500 hover:text-accent-600 transition">
                  {t("footer_disclaimer")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-charcoal-500">
            © {new Date().getFullYear()} AppHub. {t("footer_rights")}
          </p>
          <p className="text-sm text-charcoal-500">{t("footer_made_in")}</p>
        </div>
      </div>
    </footer>
  );
}