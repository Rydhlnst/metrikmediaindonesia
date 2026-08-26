import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getAuthorName, getTimeAgo, formatViews } from "@/lib/article-helpers";
import { Clock, Eye } from "@phosphor-icons/react/dist/ssr";
import { CategoryBadge } from "@/components/shared/category-badge";
import { ArticleImage } from "@/components/shared/article-image";

interface ArticleCardData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
  viewCount?: number | null;
  category?: { id?: number; name?: string | null; slug?: string | null; color?: string | null } | null;
  author?: { name?: string | null } | null;
}

interface ArticleCardProps {
  article: ArticleCardData;
  className?: string;
  variant?: "vertical" | "horizontal" | "featured";
  size?: "sm" | "md" | "lg";
  showExcerpt?: boolean;
  showViews?: boolean;
  priority?: boolean;
  rank?: number;
}

export function ArticleCard({
  article,
  className,
  variant = "vertical",
  size = "md",
  showExcerpt = false,
  showViews = false,
  priority = false,
  rank,
}: ArticleCardProps) {
  const categorySlug = getCategorySlug(article);
  const categoryName = getCategoryName(article);
  const authorName = getAuthorName(article);
  const publishedDate = article.publishedAt || new Date().toISOString();

  if (variant === "horizontal") {
    return (
      <Link
        href={`/${categorySlug}/${article.slug}`}
        className={cn(
          "group flex min-w-0 max-w-full items-start gap-3 overflow-hidden py-4 first:pt-0 last:pb-0",
          className
        )}
      >
        {rank !== undefined && (
          <span
            className={cn(
              "flex w-8 shrink-0 items-start font-serif text-2xl font-bold leading-none ranking-number",
              rank < 3 ? "text-gold" : "text-black/20"
            )}
          >
            {String(rank + 1).padStart(2, "0")}
          </span>
        )}
        <div className="relative aspect-[4/3] w-1/4 min-w-[72px] max-w-28 shrink-0 overflow-hidden bg-surface-container">
          <ArticleImage
            src={article.featuredImage}
            alt={article.title}
            sizes="100px"
            className="object-cover card-image-zoom"
          />
        </div>
        <div className="min-w-0 self-stretch">
          <CategoryBadge>{categoryName}</CategoryBadge>
          <h3 className="mt-1 text-[15px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-gold-deep transition-colors">
            {article.title}
          </h3>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {authorName && <span className="max-w-[9rem] truncate">{authorName}</span>}
            {authorName && <span>·</span>}
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
              <Clock className="size-3" />
              {getTimeAgo(publishedDate)}
            </span>
            {showViews && (
              <>
                <span>·</span>
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
                  <Eye className="size-3" />
                  {formatViews(article.viewCount || 0)}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/${categorySlug}/${article.slug}`}
        className={cn("group min-w-0 max-w-full overflow-hidden border border-black/10 bg-white", className)}
      >
          <div className="relative aspect-[16/10] w-full min-w-0 max-w-full overflow-hidden bg-surface-container">
            <ArticleImage
              src={article.featuredImage}
            alt={article.title}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover card-image-zoom"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <CategoryBadge variant="pill">{categoryName}</CategoryBadge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3
              className="font-serif text-3xl font-bold leading-snug text-white line-clamp-2"
            >
              {article.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
              {authorName && <span>{authorName}</span>}
              <span>·</span>
              <span>{getTimeAgo(publishedDate)}</span>
              {showViews && (
                <>
                  <span>·</span>
                  <span>{formatViews(article.viewCount || 0)} dibaca</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default: vertical
  const titleSize = size === "lg" ? "text-lg" : "text-[15px]";

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className={cn("group min-w-0 max-w-full overflow-hidden border border-black/10 bg-white", className)}
    >
      <div className={cn("relative min-w-0 max-w-full overflow-hidden bg-surface-container", "aspect-[16/10]")}>
        <ArticleImage
          src={article.featuredImage}
          alt={article.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover card-image-zoom"
          priority={priority}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <CategoryBadge>{categoryName}</CategoryBadge>
        <h3 className={cn("font-semibold leading-snug line-clamp-2 group-hover:text-gold-deep transition-colors", titleSize)}>
          {article.title}
        </h3>
        {showExcerpt && article.excerpt && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {authorName && <span>{authorName}</span>}
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {getTimeAgo(publishedDate)}
          </span>
          {showViews && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                {formatViews(article.viewCount || 0)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
