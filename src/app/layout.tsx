import type { Metadata, Viewport } from "next";
import { Cairo, Playfair_Display, Almarai } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/settings";
import { LanguageProvider } from "@/contexts/language-context";
import { PwaRegister } from "@/components/pwa-register";
import { InstallPrompt } from "@/components/install-prompt";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair"
});

/* خط عرض عربي حقيقي — Playfair مفيهوش أحرف عربية فاللقمة العربية
   كانت بتنزل بخط النظام (تصميم مش مقصود). Almarai أنيق وجاد، ببيِّن بالوزن */
const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
  variable: "--font-almarai"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL("https://apphub-eight.vercel.app"),
    title: {
      default: `${settings.site_name} — دليل التطبيقات العربي الأول`,
      template: `%s | ${settings.site_name}`
    },
    description: settings.site_description,
    keywords: ["تطبيقات", "عروض", "خصومات", "مصر", "السعودية", "الإمارات"],
    openGraph: {
      type: "website",
      locale: "ar_EG",
      siteName: settings.site_name,
      title: settings.site_name,
      description: settings.site_description
    },
    robots: { index: true, follow: true },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      title: "AppHub",
      statusBarStyle: "black-translucent"
    },
    icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a2942"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${playfair.variable} ${almarai.variable}`}>
      <body className={`${cairo.className} min-h-screen flex flex-col bg-cream-50`}>
        {/* منع وميض الثيم: يقرأ التفضيل قبل أول رسم */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("apphub-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}`
          }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <LanguageProvider>
          <PwaRegister />
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
          <InstallPrompt />
        </LanguageProvider>
      </body>
    </html>
  );
}