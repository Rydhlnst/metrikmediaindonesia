import { ArticleCardGrid } from "@/components/article/article-card-grid";
import { SectionHeader } from "@/components/shared/section-header";

interface CategorySectionProps {
  title: string;
  categorySlug: string;
  articles: any[];
}

export function CategorySection({ title, categorySlug, articles }: CategorySectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div>
      <SectionHeader title={title} href={`/${categorySlug}`} />
      <div className="mt-4 space-y-4">
        {articles.map((article: any) => (
          <ArticleCardGrid key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
