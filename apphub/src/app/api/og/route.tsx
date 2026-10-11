import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "AppHub";
    const subtitle = searchParams.get("subtitle") || "دليل التطبيقات العربي";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
          }}
        >
          <div style={{ fontSize: 100, marginBottom: 20 }}>📱</div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "white",
              textAlign: "center"
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.9)",
              marginTop: 20
            }}
          >
            {subtitle}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );
  } catch (e) {
    return new Response("Failed to generate image", { status: 500 });
  }
}