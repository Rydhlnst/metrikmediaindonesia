import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { articles, categories, authors } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { revalidateAllArticles } from "@/lib/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const articleId = parseInt(id);

    const [article] = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        subtitle: articles.subtitle,
        content: articles.content,
        excerpt: articles.excerpt,
        thumbnail: articles.thumbnail,
        imageCaption: articles.imageCaption,
        status: articles.status,
        viewCount: articles.viewCount,
        featured: articles.featured,
        breaking: articles.breaking,
        readingTime: articles.readingTime,
        scheduledAt: articles.scheduledAt,
        authorId: articles.authorId,
        locationId: articles.locationId,
        sponsoredLabel: articles.sponsoredLabel,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        seoKeywords: articles.seoKeywords,
        focusKeyword: articles.focusKeyword,
        seoScore: articles.seoScore,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        categoryId: articles.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: authors.name,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!article) {
      return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error("GET /api/articles/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data artikel" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const articleId = parseInt(id);
    const body = await request.json();

    const {
      title,
      slug,
      subtitle,
      content,
      excerpt,
      thumbnail,
      imageCaption,
      status,
      categoryId,
      authorId,
      locationId,
      featured,
      breaking,
      readingTime,
      scheduledAt,
      seoTitle,
      seoDescription,
      seoKeywords,
      focusKeyword,
      seoScore,
      sponsoredLabel,
    } = body;

    const [existing] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, articleId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(articles)
        .where(and(eq(articles.slug, slug), ne(articles.id, articleId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json(
          { message: "Slug artikel sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const [updated] = await db
      .update(articles)
      .set({
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
        content: content !== undefined ? content : existing.content,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        thumbnail: thumbnail !== undefined ? thumbnail : existing.thumbnail,
        imageCaption: imageCaption !== undefined ? imageCaption : existing.imageCaption,
        status: status ?? existing.status,
        categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : existing.categoryId,
        authorId: authorId !== undefined ? (authorId ? parseInt(authorId) : null) : existing.authorId,
        locationId: locationId !== undefined ? (locationId ? parseInt(locationId) : null) : existing.locationId,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        breaking: breaking !== undefined ? Boolean(breaking) : existing.breaking,
        readingTime: readingTime !== undefined ? parseInt(readingTime) : existing.readingTime,
        scheduledAt: scheduledAt !== undefined ? (scheduledAt ? new Date(scheduledAt) : null) : existing.scheduledAt,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : existing.seoKeywords,
        focusKeyword: focusKeyword !== undefined ? focusKeyword : existing.focusKeyword,
        seoScore: seoScore !== undefined ? parseInt(seoScore) : existing.seoScore,
        sponsoredLabel: sponsoredLabel !== undefined ? sponsoredLabel : existing.sponsoredLabel,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, articleId))
      .returning();

    revalidateAllArticles();

    return NextResponse.json({ message: "Artikel berhasil diperbarui", data: updated });
  } catch (error: any) {
    console.error("PUT /api/articles/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const articleId = parseInt(id);

    await db.delete(articles).where(eq(articles.id, articleId));

    revalidateAllArticles();

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus artikel" }, { status: 500 });
  }
}
