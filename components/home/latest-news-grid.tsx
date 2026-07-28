import type { Article } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article/article-card";
import { ArticleCardHorizontal } from "@/components/article/article-card-horizontal-alt";
import { SectionHeader } from "@/components/shared/section-header";

interface LatestNewsGridProps {
  articles: Article[];
}

export function LatestNewsGrid({ articles }: LatestNewsGridProps) {
  const [featured, ...rest] = articles;
  const gridArticles = rest.slice(0, 4);
  const listArticles = rest.slice(4, 8);

  return (
    <div>
      <SectionHeader title="Berita Terkini" href="/terkini" />

      {/* Featured + Grid */}
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured && <ArticleCard article={featured} />}
        {gridArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* List */}
      {listArticles.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {listArticles.map((article) => (
            <ArticleCardHorizontal key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
