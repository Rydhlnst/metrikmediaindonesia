import { and, desc, eq, gte } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articles, categories } from "@/db/schema/index";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const db = await getDb();
  const latestNews = await db
    .select({ title: articles.title, slug: articles.slug, publishedAt: articles.publishedAt, categorySlug: categories.slug })
    .from(articles)
    .innerJoin(categories, eq(articles.categoryId, categories.id))
    .where(and(eq(articles.status, "published"), gte(articles.publishedAt, cutoff)))
    .orderBy(desc(articles.publishedAt))
    .limit(1_000);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${latestNews.map((article) => `<url><loc>${SITE_CONFIG.url}/${article.categorySlug}/${article.slug}</loc><news:news><news:publication><news:name>${escapeXml(SITE_CONFIG.name)}</news:name><news:language>id</news:language></news:publication><news:publication_date>${article.publishedAt?.toISOString() ?? new Date().toISOString()}</news:publication_date><news:title>${escapeXml(article.title)}</news:title></news:news></url>`).join("")}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59" } });
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);
}
