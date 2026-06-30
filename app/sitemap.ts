import type { MetadataRoute } from "next";
import { getAllPageSlugs } from "@/lib/comparisons";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = getAllPageSlugs().map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: slug.includes("-vs-") ? 0.8 : 0.9,
  }));

  return [...staticPages, ...dynamicPages];
}
