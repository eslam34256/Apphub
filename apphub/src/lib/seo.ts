import type { Metadata } from "next";

/** v34: الدومين بييجي من الـ env — نفس الكود يشتغل على apphub-eight.vercel.app وأي دومين مخصص من غير تعديل ٢٩ ملف */
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-eight.vercel.app").replace(/\/+$/, "");

type SEOProps = { title: string; description: string; url?: string; image?: string; keywords?: string[] };

export function buildMeta({ title, description, url = "/", image = "/og.png", keywords = [] }: SEOProps): Metadata {
  const path = url.replace(/^https?:\/\/[^/]+\/?/, "/").replace(/^\/+$/, "") || "";
  const imgPath = image.replace(/^https?:\/\/[^/]+/, "");
  const canonical = `${SITE}${path}`;
  const fullTitle = `${title} | AppHub`;
  return {
    title: fullTitle, description,
    keywords: ["تطبيقات", "عروض", "خصومات", "مصر", "السعودية", ...keywords].join(", "),
    openGraph: { title: fullTitle, description, url: canonical, siteName: "AppHub", images: [{ url: `${SITE}${imgPath}`, width: 1200, height: 630 }], locale: "ar_EG", type: "website" },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [`${SITE}${imgPath}`] },
    alternates: { canonical },
    robots: { index: true, follow: true }
  };
}
