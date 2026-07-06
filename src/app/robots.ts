import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/portal",
        "/doctor",
        "/api",
      ],
    },
    sitemap: "https://udaancare.in/sitemap.xml",
  };
}
