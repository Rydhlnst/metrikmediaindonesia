import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { comments, articles, users } from "@/db/schema/index";
import { and, desc, eq } from "drizzle-orm";
import { commentCreateSchema, commentStatusSchema, positiveIdSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const articleIdParam = searchParams.get("articleId");
    const parsedStatus = statusParam ? commentStatusSchema.safeParse(statusParam) : null;
    if (parsedStatus && !parsedStatus.success) return zodError(parsedStatus.error);
    const parsedArticleId = articleIdParam ? positiveIdSchema.safeParse(articleIdParam) : null;
    if (parsedArticleId && !parsedArticleId.success) return zodError(parsedArticleId.error);
    const status = parsedStatus?.data;
    const articleId = parsedArticleId?.data;

    let whereClause = status ? eq(comments.status, status) : undefined;
    if (articleId) {
      whereClause = eq(comments.articleId, articleId);
    }

    const items = await db
      .select({
        id: comments.id,
        content: comments.content,
        status: comments.status,
        parentId: comments.parentId,
        authorName: comments.authorName,
        authorEmail: comments.authorEmail,
        createdAt: comments.createdAt,
        articleId: comments.articleId,
        articleTitle: articles.title,
        userName: users.name,
      })
      .from(comments)
      .leftJoin(articles, eq(comments.articleId, articles.id))
      .leftJoin(users, eq(comments.userId, users.id))
      .where(whereClause)
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json({ message: "Gagal mengambil data komentar" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await enforceRateLimit(request, "comments", 10, 600);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const db = await getDb();
    const parsed = commentCreateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { articleId, content, authorName, authorEmail, parentId } = parsed.data;

    const [article] = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.id, articleId), eq(articles.status, "published")))
      .limit(1);
    if (!article) return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });

    if (parentId) {
      const [parent] = await db
        .select({ id: comments.id, articleId: comments.articleId })
        .from(comments)
        .where(eq(comments.id, parentId))
        .limit(1);
      if (!parent || parent.articleId !== articleId) {
        return NextResponse.json({ message: "Komentar induk tidak valid" }, { status: 422 });
      }
    }

    const [comment] = await db
      .insert(comments)
      .values({
        articleId,
        content,
        authorName: authorName || null,
        authorEmail: authorEmail || null,
        parentId: parentId || null,
        status: "pending",
      })
      .returning();

    return NextResponse.json(
      { message: "Komentar berhasil dikirim", data: comment },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { message: "Gagal mengirim komentar" },
      { status: 500 }
    );
  }
}
