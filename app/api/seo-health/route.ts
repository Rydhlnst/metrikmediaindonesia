import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { articles, categories, authors } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();

    // Ambil semua artikel beserta relasi untuk audit SEO
    const allArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        thumbnail: articles.thumbnail,
        status: articles.status,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        seoKeywords: articles.seoKeywords,
        focusKeyword: articles.focusKeyword,
        canonicalUrl: articles.canonicalUrl,
        seoScore: articles.seoScore,
        content: articles.content,
        categoryId: articles.categoryId,
        categoryName: categories.name,
        authorId: articles.authorId,
        authorName: authors.name,
        publishedAt: articles.publishedAt,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id));

    const total = allArticles.length;
    if (total === 0) {
      return NextResponse.json({
        score: 100,
        summary: {
          totalArticles: 0,
          missingSeoTitle: 0,
          missingSeoDescription: 0,
          missingThumbnail: 0,
          missingCategory: 0,
          missingAuthor: 0,
          missingCanonical: 0,
          missingKeywords: 0,
          missingContent: 0,
        },
        checklist: [],
        problematicArticles: [],
      });
    }

    // Hitung masalah SEO
    const missingSeoTitle = allArticles.filter((a) => !a.seoTitle).length;
    const missingSeoDescription = allArticles.filter(
      (a) => !a.seoDescription || a.seoDescription.length < 50
    ).length;
    const missingThumbnail = allArticles.filter((a) => !a.thumbnail).length;
    const missingCategory = allArticles.filter((a) => !a.categoryId).length;
    const missingAuthor = allArticles.filter((a) => !a.authorId).length;
    const missingCanonical = allArticles.filter((a) => !a.canonicalUrl).length;
    const missingKeywords = allArticles.filter(
      (a) => !a.seoKeywords && !a.focusKeyword
    ).length;
    const missingContent = allArticles.filter(
      (a) => !a.content || a.content.length < 200
    ).length;
    const dirtySlugs = allArticles.filter((a) =>
      a.slug !== a.slug.toLowerCase() || /\s/.test(a.slug)
    ).length;

    // Skor: rata-rata kelengkapan 8 faktor
    const factors = [
      total - missingSeoTitle,
      total - missingSeoDescription,
      total - missingThumbnail,
      total - missingCategory,
      total - missingAuthor,
      total - missingKeywords,
      total - missingContent,
      total - dirtySlugs,
    ];
    const score = Math.round(
      (factors.reduce((s, v) => s + v, 0) / (factors.length * total)) * 100
    );

    const pct = (missing: number) => Math.round(((total - missing) / total) * 100);

    const checklist = [
      {
        label: "SEO Title terisi di semua artikel",
        status: missingSeoTitle === 0 ? "passed" : pct(missingSeoTitle) >= 80 ? "warning" : "failed",
        detail: `${missingSeoTitle} artikel belum memiliki SEO title`,
      },
      {
        label: "Meta description unik (min. 50 karakter)",
        status: missingSeoDescription === 0 ? "passed" : pct(missingSeoDescription) >= 80 ? "warning" : "failed",
        detail: `${missingSeoDescription} artikel belum memiliki meta description yang valid`,
      },
      {
        label: "Thumbnail & gambar utama tersedia",
        status: missingThumbnail === 0 ? "passed" : pct(missingThumbnail) >= 80 ? "warning" : "failed",
        detail: `${missingThumbnail} artikel belum memiliki thumbnail`,
      },
      {
        label: "Kategori terhubung ke artikel",
        status: missingCategory === 0 ? "passed" : pct(missingCategory) >= 80 ? "warning" : "failed",
        detail: `${missingCategory} artikel belum memiliki kategori`,
      },
      {
        label: "Profil penulis terasosiasi",
        status: missingAuthor === 0 ? "passed" : pct(missingAuthor) >= 80 ? "warning" : "failed",
        detail: `${missingAuthor} artikel belum memiliki penulis`,
      },
      {
        label: "Keywords / focus keyword terisi",
        status: missingKeywords === 0 ? "passed" : pct(missingKeywords) >= 80 ? "warning" : "failed",
        detail: `${missingKeywords} artikel belum memiliki keywords`,
      },
      {
        label: "Konten artikel memadai (min. 200 karakter)",
        status: missingContent === 0 ? "passed" : pct(missingContent) >= 80 ? "warning" : "failed",
        detail: `${missingContent} artikel memiliki konten terlalu pendek`,
      },
      {
        label: "Slug URL bersih (lowercase, hyphen-separated)",
        status: dirtySlugs === 0 ? "passed" : "warning",
        detail: `${dirtySlugs} artikel memiliki slug tidak bersih`,
      },
    ];

    // Artikel bermasalah terburah (sort by jumlah masalah)
    const problematicArticles = allArticles
      .map((a) => {
        const issues: string[] = [];
        if (!a.seoTitle) issues.push("SEO title kosong");
        if (!a.seoDescription || a.seoDescription.length < 50) issues.push("Meta description kurang");
        if (!a.thumbnail) issues.push("Thumbnail kosong");
        if (!a.categoryId) issues.push("Tanpa kategori");
        if (!a.authorId) issues.push("Tanpa penulis");
        if (!a.seoKeywords && !a.focusKeyword) issues.push("Tanpa keywords");
        if (!a.content || a.content.length < 200) issues.push("Konten pendek");
        return {
          id: a.id,
          title: a.title,
          slug: a.slug,
          status: a.status,
          seoScore: a.seoScore || 0,
          categoryName: a.categoryName,
          issues,
        };
      })
      .filter((a) => a.issues.length > 0)
      .sort((x, y) => y.issues.length - x.issues.length)
      .slice(0, 20);

    return NextResponse.json({
      score,
      summary: {
        totalArticles: total,
        missingSeoTitle,
        missingSeoDescription,
        missingThumbnail,
        missingCategory,
        missingAuthor,
        missingCanonical,
        missingKeywords,
        missingContent,
      },
      checklist,
      problematicArticles,
    });
  } catch (error) {
    console.error("GET /api/seo-health error:", error);
    return NextResponse.json({ message: "Gagal mengambil data SEO health" }, { status: 500 });
  }
}
