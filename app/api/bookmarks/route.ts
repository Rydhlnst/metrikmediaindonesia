import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articles, bookmarks, categories } from "@/db/schema/index";
import { requireAuth } from "@/lib/server-session";

const createBookmarkSchema = z.object({ articleId: z.coerce.number().int().positive() });

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult.error;
  const sessionUser = authResult.user;

  const db = await getDb();
  const saved = await db
    .select({
      id: bookmarks.id,
      createdAt: bookmarks.createdAt,
      article: {
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        thumbnail: articles.thumbnail,
        publishedAt: articles.publishedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      },
    })
    .from(bookmarks)
    .innerJoin(articles, eq(bookmarks.articleId, articles.id))
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(and(eq(bookmarks.userId, sessionUser.id), eq(articles.status, "published")))
    .orderBy(desc(bookmarks.createdAt));

  return NextResponse.json({
    data: saved.map(({ article, ...bookmark }) => ({
      ...bookmark,
      article: {
        ...article,
        category: article.categoryName
          ? { name: article.categoryName, slug: article.categorySlug }
          : null,
      },
    })),
  });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult.error;
  const sessionUser = authResult.user;

  const payload = createBookmarkSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json({ message: "Invalid article id" }, { status: 400 });
  }

  const db = await getDb();
  const [article] = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.id, payload.data.articleId), eq(articles.status, "published")))
    .limit(1);
  if (!article) return NextResponse.json({ message: "Article not found" }, { status: 404 });

  const [bookmark] = await db
    .insert(bookmarks)
    .values({ userId: sessionUser.id, articleId: article.id })
    .onConflictDoNothing()
    .returning();

  return NextResponse.json({ data: bookmark ?? null, alreadySaved: !bookmark }, { status: bookmark ? 201 : 200 });
}
