import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { articles, articleViewRollups, categories, authors, comments } from "@/db/schema/index";
import { and, count, sum, desc, eq, gte, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();

    // 1. Total Articles
    const [articlesCount] = await db.select({ count: count() }).from(articles);

    // 2. Total Views
    const [viewsSum] = await db.select({ totalViews: sum(articles.viewCount) }).from(articles);

    // 3. Active Authors
    const [authorsCount] = await db.select({ count: count() }).from(authors);

    // 4. Categories count
    const [categoriesCount] = await db.select({ count: count() }).from(categories);

    // 5. Recent Articles (Top 5)
    const recentArticlesList = await db
      .select({
        id: articles.id,
        title: articles.title,
        status: articles.status,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        categoryName: categories.name,
        categoryColor: categories.color,
        authorName: authors.name,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .orderBy(desc(articles.createdAt))
      .limit(5);

    // 6. Recent Comments (Top 5)
    const recentCommentsList = await db
      .select({
        id: comments.id,
        content: comments.content,
        status: comments.status,
        createdAt: comments.createdAt,
        authorName: comments.authorName,
        articleTitle: articles.title,
      })
      .from(comments)
      .leftJoin(articles, eq(comments.articleId, articles.id))
      .orderBy(desc(comments.createdAt))
      .limit(5);

    // 7. Top Articles by Views (Top 5)
    const trendingCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const trendingCounts = db
      .select({ articleId: articleViewRollups.articleId, views: sql<number>`sum(${articleViewRollups.viewCount})`.as("views") })
      .from(articleViewRollups)
      .where(and(gte(articleViewRollups.bucketStart, trendingCutoff), eq(articleViewRollups.bucketType, "hour")))
      .groupBy(articleViewRollups.articleId)
      .as("dashboard_trending_counts");
    const topArticlesList = await db
      .select({
        id: articles.id,
        title: articles.title,
        viewCount: sql<number>`coalesce(${trendingCounts.views}, 0)`,
        slug: articles.slug,
        categoryName: categories.name,
        categoryColor: categories.color,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(trendingCounts, eq(articles.id, trendingCounts.articleId))
      .where(eq(articles.status, "published"))
      .orderBy(desc(sql`coalesce(${trendingCounts.views}, 0)`), desc(articles.viewCount))
      .limit(5);

    // 8. Monthly stats for charts (last 12 months)
    const monthlyCutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const monthlyStats = await db
      .select({
        month: articles.publishedAt,
        viewCount: articles.viewCount,
      })
      .from(articles)
      .where(and(eq(articles.status, "published"), gte(articles.publishedAt, monthlyCutoff)))
      .orderBy(desc(articles.publishedAt));

    // Process monthly stats
    const monthMap: Record<string, { articles: number; views: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    for (const row of monthlyStats) {
      if (!row.month) continue;
      const d = new Date(row.month);
      const key = monthNames[d.getMonth()];
      if (!monthMap[key]) monthMap[key] = { articles: 0, views: 0 };
      monthMap[key].articles += 1;
      monthMap[key].views += row.viewCount || 0;
    }
    const chartData = monthNames.slice(0, 6).map((m) => ({
      month: m,
      articles: monthMap[m]?.articles || 0,
      views: monthMap[m]?.views || 0,
    }));

    // 9. Category stats for charts
    const categoryStats = await db
      .select({
        name: categories.name,
        color: categories.color,
        count: count(articles.id),
      })
      .from(categories)
      .leftJoin(articles, eq(articles.categoryId, categories.id))
      .groupBy(categories.id, categories.name, categories.color)
      .orderBy(desc(count(articles.id)));

    return NextResponse.json({
      stats: {
        totalArticles: articlesCount?.count || 0,
        totalViews: Number(viewsSum?.totalViews || 0),
        activeAuthors: authorsCount?.count || 0,
        totalCategories: categoriesCount?.count || 0,
      },
      recentArticles: recentArticlesList,
      recentComments: recentCommentsList,
      topArticles: topArticlesList,
      chartData,
      categoryStats,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ message: "Gagal mengambil statistik dashboard" }, { status: 500 });
  }
}
