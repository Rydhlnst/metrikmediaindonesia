import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface CategorySectionLargeProps {
  title: string;
  categorySlug: string;
  articles: any[];
}

export function CategorySectionLarge({ title, categorySlug, articles }: CategorySectionLargeProps) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  const getArticleCategorySlug = (article: any) =>
    typeof article.category === "object" ? article.category?.slug : categorySlug;
  const getArticleCategoryName = (article: any) =>
    typeof article.category === "object" ? article.category?.name : title;

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link
          href={`/${categorySlug}`}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Show all <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_320px]">
        {/* Main Article */}
        {mainArticle && (
          <Link
            href={`/${getArticleCategorySlug(mainArticle)}/${mainArticle.slug}`}
            className="group"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <Image
                src={getImageUrl(mainArticle.featuredImage)}
                alt={mainArticle.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <span className="text-[11px] font-medium text-[#a68a0a]">
                {getArticleCategoryName(mainArticle)}
              </span>
              <h3 className="text-base font-semibold leading-snug line-clamp-2">
                {mainArticle.title}
              </h3>
            </div>
          </Link>
        )}

        {/* Side Articles */}
        <div className="divide-y divide-border">
          {sideArticles.map((article: any) => (
            <Link
              key={article.id}
              href={`/${getArticleCategorySlug(article)}/${article.slug}`}
              className="group flex gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden bg-muted">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 min-w-0 flex-col justify-center">
                <span className="text-[10px] font-medium text-[#a68a0a]">
                  {getArticleCategoryName(article)}
                </span>
                <h3 className="mt-0.5 text-[13px] font-semibold leading-snug line-clamp-2 text-foreground">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
