import { MetadataRoute } from "next";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articles, authors, categories } from "@/db/schema/index";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const staticRoutes: MetadataRoute.Sitemap = ["", "/latest", "/video", "/foto", "/tentang-kami", "/tim-editorial", "/hubungi-kami", "/business-publication", "/submit"]
    .map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.6 }));

  try {
    const db = await getDb();
    const [categoryRows, authorRows, articleRows] = await Promise.all([
      db.select({ slug: categories.slug, updatedAt: categories.updatedAt }).from(categories).where(eq(categories.isActive, true)),
      db.select({ slug: authors.slug, updatedAt: authors.updatedAt }).from(authors).where(eq(authors.status, "active")),
      db.select({ slug: articles.slug, publishedAt: articles.publishedAt, updatedAt: articles.updatedAt, categorySlug: categories.slug })
        .from(articles)
        .innerJoin(categories, eq(articles.categoryId, categories.id))
        .where(and(eq(articles.status, "published"), eq(categories.isActive, true)))
        .orderBy(desc(articles.publishedAt)),
    ]);

    return [
      ...staticRoutes,
      ...categoryRows.map((category) => ({ url: `${baseUrl}/${category.slug}`, lastModified: category.updatedAt, changeFrequency: "hourly" as const, priority: 0.8 })),
      ...articleRows.map((article) => ({ url: `${baseUrl}/${article.categorySlug}/${article.slug}`, lastModified: article.updatedAt ?? article.publishedAt ?? new Date(), changeFrequency: "daily" as const, priority: 0.9 })),
      ...authorRows.map((author) => ({ url: `${baseUrl}/author/${author.slug}`, lastModified: author.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
    ];
  } catch {
    return staticRoutes;
  }
}
