import { createClient } from "@/lib/supabase/server";

export type SiteSettings = {
  site_name: string;
  site_description: string;
  contact_email: string;
  whatsapp_number: string;
  phone_number: string;
  address: string;
  working_hours: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  linkedin_url: string;
  tiktok_url: string;
};

const defaultSettings: SiteSettings = {
  site_name: "AppHub",
  site_description: "دليل التطبيقات العربي الأول",
  contact_email: "info@apphub.eg",
  whatsapp_number: "+201000000000",
  phone_number: "+201000000000",
  address: "القاهرة، مصر",
  working_hours: "الأحد - الخميس: 9 ص - 6 م",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  youtube_url: "",
  linkedin_url: "",
  tiktok_url: ""
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("*");

    if (!data || data.length === 0) return defaultSettings;

    const settings: any = { ...defaultSettings };
    data.forEach((item: any) => {
      if (item.key in settings) {
        settings[item.key] = typeof item.value === "string"
          ? item.value
          : JSON.parse(JSON.stringify(item.value));
      }
    });

    return settings as SiteSettings;
  } catch (err) {
    return defaultSettings;
  }
}

// دالة مساعدة لتنظيف رقم الواتساب من الرموز
export function cleanWhatsAppNumber(number: string): string {
  return number.replace(/[^0-9]/g, "");
}

// دالة لإنشاء رابط واتساب
export function getWhatsAppLink(number: string, message?: string): string {
  const cleaned = cleanWhatsAppNumber(number);
  const url = `https://wa.me/${cleaned}`;
  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }
  return url;
}