import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getAuthorName, getTimeAgo, formatViews } from "@/lib/article-helpers";
import { Clock, Eye, BookmarkSimple } from "@phosphor-icons/react/dist/ssr";
import { CategoryBadge } from "@/components/shared/category-badge";

interface ArticleCardProps {
  article: any;
  className?: string;
  variant?: "vertical" | "horizontal" | "featured";
  size?: "sm" | "md" | "lg";
  showExcerpt?: boolean;
  showViews?: boolean;
  showBookmark?: boolean;
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
  showBookmark = false,
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
        className={cn("group flex gap-3.5 py-3 first:pt-0 last:pb-0", className)}
      >
        {rank !== undefined && (
          <span
            className={cn(
              "flex shrink-0 items-start font-headline-lg text-headline-lg font-bold ranking-number",
              rank < 3 ? "text-on-secondary-container" : "text-outline-variant"
            )}
          >
            {String(rank + 1).padStart(2, "0")}
          </span>
        )}
        <div className="relative h-[72px] w-[100px] shrink-0 overflow-hidden bg-surface-container">
          <Image
            src={getImageUrl(article.featuredImage, "thumbnail")}
            alt={article.title}
            fill
            sizes="100px"
            className="object-cover card-image-zoom"
          />
        </div>
        <div className="flex flex-1 min-w-0 flex-col justify-center gap-1">
          <CategoryBadge>{categoryName}</CategoryBadge>
          <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-on-surface group-hover:text-secondary transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            {authorName && <span>{authorName}</span>}
            {authorName && <span>·</span>}
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

  if (variant === "featured") {
    return (
      <Link
        href={`/${categorySlug}/${article.slug}`}
        className={cn("group overflow-hidden border border-outline-variant", className)}
      >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
            <Image
              src={getImageUrl(article.featuredImage, "card")}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover card-image-zoom"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <CategoryBadge variant="pill">{categoryName}</CategoryBadge>
            {showBookmark && (
              <button className="flex size-8 items-center justify-center bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-secondary-container hover:text-on-secondary-container">
                <BookmarkSimple className="size-4" />
              </button>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3
              className="font-headline-lg text-headline-lg font-bold leading-snug text-white line-clamp-2"
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
                  <span>{formatViews(article.viewCount || 0)} views</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default: vertical
  const titleSize = size === "lg" ? "text-lg" : size === "sm" ? "text-[15px]" : "text-[15px]";

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className={cn("group overflow-hidden border border-outline-variant", className)}
    >
      <div className={cn("relative overflow-hidden bg-surface-container", size === "lg" ? "aspect-[16/10]" : "aspect-[16/10]")}>
        <Image
          src={getImageUrl(article.featuredImage, "card")}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover card-image-zoom"
          priority={priority}
        />
        {showBookmark && (
          <button className="absolute right-2 top-2 flex size-8 items-center justify-center bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-secondary-container hover:text-on-secondary-container">
            <BookmarkSimple className="size-4" />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <CategoryBadge>{categoryName}</CategoryBadge>
        <h3 className={cn("font-semibold leading-snug line-clamp-2 group-hover:text-secondary transition-colors", titleSize)}>
          {article.title}
        </h3>
        {showExcerpt && article.excerpt && (
          <p className="text-sm leading-relaxed text-on-surface-variant line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
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
