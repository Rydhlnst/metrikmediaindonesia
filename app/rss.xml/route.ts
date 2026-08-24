import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articles, authors, categories } from "@/db/schema/index";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const rows = await db
    .select({ title: articles.title, slug: articles.slug, excerpt: articles.excerpt, publishedAt: articles.publishedAt, updatedAt: articles.updatedAt, categorySlug: categories.slug, authorName: authors.name })
    .from(articles)
    .innerJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(authors, eq(articles.authorId, authors.id))
    .where(and(eq(articles.status, "published"), eq(categories.isActive, true)))
    .orderBy(desc(articles.publishedAt))
    .limit(100);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${escapeXml(SITE_CONFIG.name)}</title><link>${SITE_CONFIG.url}</link><description>${escapeXml(SITE_CONFIG.description)}</description><language>id-ID</language>
${rows.map((row) => `<item><title>${escapeXml(row.title)}</title><link>${SITE_CONFIG.url}/${row.categorySlug}/${row.slug}</link><guid isPermaLink="true">${SITE_CONFIG.url}/${row.categorySlug}/${row.slug}</guid><description>${escapeXml(row.excerpt || row.title)}</description><pubDate>${(row.publishedAt || row.updatedAt || new Date()).toUTCString()}</pubDate>${row.authorName ? `<author>${escapeXml(row.authorName)}</author>` : ""}</item>`).join("")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=59" } });
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);
}
