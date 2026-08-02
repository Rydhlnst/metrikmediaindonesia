import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight, Clock, Eye } from "@phosphor-icons/react/dist/ssr";

interface CategorySectionLargeProps {
  title: string;
  categorySlug: string;
  articles: any[];
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
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
      <div className="flex items-center justify-between border-b-2 border-brand pb-2.5">
        <h2 className="text-[14px] font-bold uppercase tracking-wider">{title}</h2>
        <Link
          href={`/${categorySlug}`}
          className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-foreground transition-colors link-underline"
        >
          Lihat Semua <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_280px]">
        {/* Main Article */}
        {mainArticle && (
          <Link
            href={`/${getArticleCategorySlug(mainArticle)}/${mainArticle.slug}`}
            className="group card-hover-lift"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
              <Image
                src={getImageUrl(mainArticle.featuredImage)}
                alt={mainArticle.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover card-image-zoom"
              />
            </div>
            <div className="mt-2.5 flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand">
                {getArticleCategoryName(mainArticle)}
              </span>
              <h3 className="text-[15px] font-bold leading-snug line-clamp-2 group-hover:text-brand transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                {mainArticle.title}
              </h3>
              <div className="mt-0.5 flex items-center gap-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="size-2.5" />
                  {getTimeAgo(mainArticle.publishedAt || new Date().toISOString())}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-2.5" />
                  {(mainArticle.viewCount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Side Articles */}
        <div className="divide-y divide-gray-100">
          {sideArticles.map((article: any) => (
            <Link
              key={article.id}
              href={`/${getArticleCategorySlug(article)}/${article.slug}`}
              className="group flex gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="relative h-14 w-[72px] shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="72px"
                  className="object-cover card-image-zoom"
                />
              </div>
              <div className="flex flex-1 min-w-0 flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand">
                  {getArticleCategoryName(article)}
                </span>
                <h3 className="mt-0.5 text-[12px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand transition-colors">
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
