import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { articles, categories, authors } from "@/db/schema/index";
import { desc, eq, like, count, or, and } from "drizzle-orm";
import { revalidateAllArticles } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category");
    const status = searchParams.get("status");
    const slug = searchParams.get("slug");
    const offset = (page - 1) * limit;

    if (slug) {
      const [article] = await db
        .select()
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

      if (!article) {
        return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(article);
    }

    const conditions = [];

    if (search) {
      conditions.push(
        or(like(articles.title, `%${search}%`), like(articles.excerpt, `%${search}%`))
      );
    }

    if (status) {
      conditions.push(eq(articles.status, status));
    }

    if (categorySlug) {
      const [cat] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);

      if (cat) {
        conditions.push(eq(articles.categoryId, cat.id));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        thumbnail: articles.thumbnail,
        status: articles.status,
        viewCount: articles.viewCount,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        seoKeywords: articles.seoKeywords,
        focusKeyword: articles.focusKeyword,
        seoScore: articles.seoScore,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        categoryId: articles.categoryId,
        categoryName: categories.name,
        categoryColor: categories.color,
        categorySlug: categories.slug,
        authorName: authors.name,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(whereClause)
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalCountResult] = await db
      .select({ count: count() })
      .from(articles)
      .where(whereClause);

    const total = totalCountResult?.count || 0;

    return NextResponse.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ message: "Gagal mengambil data artikel" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();

    const {
      title,
      slug,
      content,
      excerpt,
      thumbnail,
      status = "published",
      categoryId,
      seoTitle,
      seoDescription,
      seoKeywords,
      focusKeyword,
      seoScore,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { message: "Judul dan slug artikel wajib diisi" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { message: "Slug artikel sudah digunakan, gunakan judul lain" },
        { status: 400 }
      );
    }

    const [newArticle] = await db
      .insert(articles)
      .values({
        title,
        slug,
        content: content || null,
        excerpt: excerpt || null,
        thumbnail: thumbnail || null,
        status,
        categoryId: categoryId ? parseInt(categoryId) : null,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt || null,
        seoKeywords: seoKeywords || null,
        focusKeyword: focusKeyword || null,
        seoScore: seoScore ? parseInt(seoScore) : 0,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    revalidateAllArticles();

    return NextResponse.json(
      { message: "Artikel berhasil dibuat", data: newArticle },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json({ message: "Gagal membuat artikel" }, { status: 500 });
  }
}
