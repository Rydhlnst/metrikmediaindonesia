import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articles, categories, readingHistory } from "@/db/schema/index";
import { requireAuth } from "@/lib/server-session";
import { apiError, zodError } from "@/lib/api-response";
import { positiveIdSchema } from "@/lib/validators/cms";
import { paginationQuerySchema } from "@/lib/validators/public";

export async function GET(request: NextRequest) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const parsed = paginationQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return zodError(parsed.error);
  const { page, limit } = parsed.data;
  const db = await getDb();
  const rows = await db
    .select({ id: readingHistory.id, lastReadAt: readingHistory.lastReadAt, article: { id: articles.id, title: articles.title, slug: articles.slug, categorySlug: categories.slug, thumbnail: articles.thumbnail } })
    .from(readingHistory)
    .innerJoin(articles, eq(readingHistory.articleId, articles.id))
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(eq(readingHistory.userId, authGuard.user.id))
    .orderBy(desc(readingHistory.lastReadAt))
    .limit(limit)
    .offset((page - 1) * limit);
  const [total] = await db.select({ count: sql<number>`count(*)::int` }).from(readingHistory).where(eq(readingHistory.userId, authGuard.user.id));
  return NextResponse.json({ data: rows, pagination: { page, limit, total: total?.count || 0, totalPages: Math.ceil((total?.count || 0) / limit) } });
}

export async function POST(request: NextRequest) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const body = await request.json().catch(() => null);
  const articleId = positiveIdSchema.safeParse(body?.articleId);
  if (!articleId.success) return zodError(articleId.error);
  const db = await getDb();
  const [article] = await db.select({ id: articles.id }).from(articles).where(and(eq(articles.id, articleId.data), eq(articles.status, "published"))).limit(1);
  if (!article) return apiError(404, "NOT_FOUND", "Article not found");
  await db.insert(readingHistory).values({ userId: authGuard.user.id, articleId: article.id, lastReadAt: new Date() }).onConflictDoUpdate({ target: [readingHistory.userId, readingHistory.articleId], set: { lastReadAt: new Date() } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const authGuard = await requireAuth(request);
  if (authGuard.error) return authGuard.error;
  const db = await getDb();
  await db.delete(readingHistory).where(eq(readingHistory.userId, authGuard.user.id));
  return NextResponse.json({ ok: true });
}
