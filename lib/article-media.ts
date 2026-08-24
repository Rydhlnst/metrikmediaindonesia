import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articleMedia, media } from "@/db/schema/index";
import { articles } from "@/db/schema/index";
import { getArticles } from "@/lib/queries";

export async function getArticleMedia(articleId: number, type?: "image" | "video") {
  const db = await getDb();
  const filters = [eq(articleMedia.articleId, articleId), type ? eq(media.type, type) : undefined].filter(Boolean);
  return db.select({ id: media.id, url: media.url, altText: media.alt, caption: articleMedia.caption, type: media.type, role: articleMedia.role, sortOrder: articleMedia.sortOrder }).from(articleMedia).innerJoin(media, eq(articleMedia.mediaId, media.id)).where(and(...filters)).orderBy(asc(articleMedia.sortOrder));
}

export async function getArticlesWithMedia(type: "image" | "video", limit = 24) {
  const db = await getDb();
  const rows = await db
    .selectDistinct({ articleId: articleMedia.articleId })
    .from(articleMedia)
    .innerJoin(media, eq(articleMedia.mediaId, media.id))
    .innerJoin(articles, eq(articleMedia.articleId, articles.id))
    .where(and(eq(media.type, type), eq(articles.status, "published")))
    .orderBy(asc(articleMedia.articleId))
    .limit(limit);
  return getArticles({ ids: rows.map((row) => row.articleId), limit });
}
