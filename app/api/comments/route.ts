import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { comments, articles, users } from "@/db/schema/index";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const articleId = searchParams.get("articleId");

    let whereClause = status ? eq(comments.status, status) : undefined;
    if (articleId) {
      whereClause = eq(comments.articleId, parseInt(articleId));
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
  } catch (error: any) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json({ message: "Gagal mengambil data komentar" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { articleId, content, authorName, authorEmail, parentId } = body;

    if (!articleId || !content) {
      return NextResponse.json(
        { message: "articleId dan content wajib diisi" },
        { status: 400 }
      );
    }

    const [comment] = await db
      .insert(comments)
      .values({
        articleId: parseInt(articleId),
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
  } catch (error: any) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { message: "Gagal mengirim komentar" },
      { status: 500 }
    );
  }
}
