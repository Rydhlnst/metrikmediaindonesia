import { MetadataRoute } from "next";
import { articles, authors } from "@/lib/mock-data";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const staticRoutes = [
    "",
    "/category/nasional",
    "/category/politik",
    "/category/bisnis",
    "/category/teknologi",
    "/category/lifestyle",
    "/category/entertainment",
    "/category/sports",
    "/category/daerah",
    "/video",
    "/foto",
    "/tentang-kami",
    "/tim-editorial",
    "/hubungi-kami",
    "/business-publication",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const categoryRoutes = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const authorRoutes = authors.map((author) => ({
    url: `${baseUrl}/author/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...authorRoutes];
}
