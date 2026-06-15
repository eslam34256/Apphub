import type { Metadata } from "next";
type SEOProps = { title: string; description: string; url?: string; image?: string; keywords?: string[] };
export function buildMeta({ title, description, url = "https://apphub.eg", image = "https://apphub.eg/og.png", keywords = [] }: SEOProps): Metadata {
  const fullTitle = `${title} | AppHub`;
  return {
    title: fullTitle, description,
    keywords: ["تطبيقات", "عروض", "خصومات", "مصر", "السعودية", ...keywords].join(", "),
    openGraph: { title: fullTitle, description, url, siteName: "AppHub", images: [{ url: image, width: 1200, height: 630 }], locale: "ar_EG", type: "website" },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    alternates: { canonical: url },
    robots: { index: true, follow: true }
  };
}
