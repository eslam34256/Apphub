import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/settings";

// خط Cairo محسّن من Next.js
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL("https://apphub.eg"),
    title: {
      default: `${settings.site_name} — دليل التطبيقات العربي الأول`,
      template: `%s | ${settings.site_name}`
    },
    description: settings.site_description,
    keywords: [
      "تطبيقات", "عروض", "خصومات", "مصر", "السعودية",
      "الإمارات", "مقارنة أسعار", "AppHub"
    ],
    openGraph: {
      type: "website",
      locale: "ar_EG",
      url: "https://apphub.eg",
      siteName: settings.site_name,
      title: settings.site_name,
      description: settings.site_description
    },
    twitter: {
      card: "summary_large_image",
      title: settings.site_name,
      description: settings.site_description
    },
    robots: {
      index: true,
      follow: true
    },
    icons: {
      icon: "/favicon.svg"
    }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366f1"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main id="main-content" className="flex-1 mx-auto max-w-7xl w-full px-3 sm:px-4 py-4 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}