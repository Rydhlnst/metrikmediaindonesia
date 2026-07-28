import { ArticleCardGrid } from "@/components/article/article-card-grid";
import { SectionHeader } from "@/components/shared/section-header";

interface LatestArticlesProps {
  articles: any[];
}

export function LatestArticles({ articles }: LatestArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div>
      <SectionHeader title="Latest Articles" href="/terkini" />
      <div className="mt-4 space-y-4">
        {articles.map((article: any) => (
          <ArticleCardGrid key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
