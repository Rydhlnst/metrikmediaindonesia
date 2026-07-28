import { NextRequest, NextResponse } from "next/server";
import { getArticles, getArticleBySlug, getTrendingArticles, searchArticles } from "@/lib/payload-queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const trending = searchParams.get("trending");
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");

  try {
    if (slug) {
      const article = await getArticleBySlug(slug);
      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    if (trending) {
      const articles = await getTrendingArticles(parseInt(trending));
      return NextResponse.json(articles);
    }

    if (search) {
      const result = await searchArticles(search, limit);
      return NextResponse.json(result);
    }

    const result = await getArticles({
      limit,
      page,
      categorySlug: category || undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
