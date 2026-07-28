import { ArticleCardCompact } from "@/components/article/article-card-compact";
import { SectionHeader } from "@/components/shared/section-header";
import { getTrendingArticles } from "@/lib/payload-queries";

export async function TrendingSidebar() {
  const { docs: trendingArticles } = await getTrendingArticles(5);

  if (!trendingArticles || trendingArticles.length === 0) return null;

  return (
    <div className="border border-border p-4">
      <SectionHeader title="Trending" />
      <div className="mt-2 divide-y divide-border">
        {trendingArticles.map((article: any, index: number) => (
          <ArticleCardCompact
            key={article.id}
            article={article}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
