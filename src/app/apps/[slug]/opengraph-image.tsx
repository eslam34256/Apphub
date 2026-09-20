import { ImageResponse } from "next/og";
import { getAppBySlug } from "@/lib/app-data";
import { ArabicShaper } from "arabic-persian-reshaper";
import { ALMARAI_B64 } from "@/lib/og-font";

export const runtime = "nodejs";
export const alt = "AppHub — تقييم وأسعار";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori مش بيعمل لا shaping ولا bidi reordering — فللنصوص العربية الخالصة:
// نشكّل الحروف لأشكال العرض المتصلة + نعكس ترتيب الكودبوينتس (عشان الرسم LTR)
function arS(text: string) {
  try {
    return Array.from(ArabicShaper.convertArabic(text)).reverse().join("");
  } catch {
    return text;
  }
}

const BRAND_NAVY = "#0f1b2d";
const GOLD = "#c9a227";
const TAGLINE_AR = "التقييم والأسعار والبدائل الأوفر بتاريخ تحقق";
const RATING_LABEL_AR = "التقييم العام";
const GENERIC_TITLE_AR = "كل اشتراكاتك بسعرها الحقيقي";

export default async function AppOgImage({ params }: { params: { slug: string } }) {
  // الخط من موديول base64 — مش fs — علشان Vercel serverless مبتتتبعش ملفات المشروع
  const font = Buffer.from(ALMARAI_B64, "base64");

  const app = await getAppBySlug(params.slug);
  const isArabicName = app ? /[؀-ۿ]/.test(app.name) : true;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: BRAND_NAVY,
          position: "relative"
        }}
      >
        {/* الشريط الذهبي */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: 16,
            backgroundColor: GOLD,
            display: "flex"
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            flex: 1,
            padding: "70px 90px",
            textAlign: "right"
          }}
        >
          <div style={{ display: "flex", color: GOLD, fontSize: 30, marginBottom: 26 }}>
            AppHub · apphub.eg
          </div>
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.25
            }}
          >
            {app ? (isArabicName ? arS(app.name) : app.name) : arS(GENERIC_TITLE_AR)}
          </div>
          {app && (
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 30 }}>
              <div style={{ display: "flex", color: "#ffc94d", fontSize: 44, fontWeight: 800 }}>
                {`${app.rating.toFixed(1)} / 5`}
              </div>
              <div style={{ display: "flex", color: "#b9c4d4", fontSize: 30 }}>
                {arS(RATING_LABEL_AR)}
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              color: "#8fa2bd",
              fontSize: 30,
              lineHeight: 1.5,
              marginTop: 40
            }}
          >
            {arS(TAGLINE_AR)}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Almarai", data: font, weight: 800, style: "normal" }]
    }
  );
}
