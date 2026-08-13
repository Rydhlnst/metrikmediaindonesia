import { ArticleCard } from "@/components/article/article-card";
import { SectionHeader } from "@/components/shared/section-header";

interface CategorySectionLargeProps {
  title: string;
  categorySlug: string;
  articles: any[];
}

export function CategorySectionLarge({ title, categorySlug, articles }: CategorySectionLargeProps) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <div>
      <SectionHeader title={title} href={`/${categorySlug}`} />
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_280px]">
        <ArticleCard article={mainArticle} variant="featured" showViews />
        <div className="flex flex-col divide-y divide-outline-variant rounded-xl">
          {sideArticles.map((article: any) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      </div>
    </div>
  );
}
