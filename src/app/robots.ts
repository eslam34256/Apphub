import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/profile", "/advertiser-dashboard"]
      }
    ],
    sitemap: "https://apphub.eg/sitemap.xml",
    host: "https://apphub.eg"
  };
}