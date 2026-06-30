import type { MetadataRoute } from "next";
import { corporateRoutes, siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return corporateRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
