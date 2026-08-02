import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getAuthorName, getTimeAgo, formatViews } from "@/lib/article-helpers";
import { Clock, Eye, BookmarkSimple } from "@phosphor-icons/react/dist/ssr";

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
        className={cn("group flex gap-3 py-2.5 first:pt-0 last:pb-0", className)}
      >
        {rank !== undefined && (
          <span
            className={cn(
              "flex shrink-0 items-start pt-1 text-[18px] font-bold ranking-number",
              rank < 3 ? "text-brand-text" : "text-gray-200"
            )}
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {String(rank + 1).padStart(2, "0")}
          </span>
        )}
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
          <span className="text-[9px] font-bold uppercase tracking-wider text-brand-text">
            {categoryName}
          </span>
          <h3 className="mt-0.5 text-[12px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand-text transition-colors">
            {article.title}
          </h3>
          <div className="mt-0.5 flex items-center gap-2 text-[9px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="size-2" />
              {getTimeAgo(publishedDate)}
            </span>
            {showViews && (
              <span className="flex items-center gap-1">
                <Eye className="size-2" />
                {formatViews(article.viewCount || 0)}
              </span>
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
        className={cn("group card-hover-lift", className)}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover card-image-zoom"
            priority={priority}
          />
          {showBookmark && (
            <button className="absolute right-2 top-2 flex size-7 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-brand hover:text-gray-900 hover:scale-110">
              <BookmarkSimple className="size-3.5" />
            </button>
          )}
        </div>
        <div className="mt-2.5 flex flex-col gap-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-brand-text">
            {categoryName}
          </span>
          <h3
            className="text-[15px] font-bold leading-snug line-clamp-2 group-hover:text-brand-text transition-colors"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {article.title}
          </h3>
          {showExcerpt && article.excerpt && (
            <p className="mt-1 text-[12px] leading-relaxed text-gray-500 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <div className="mt-0.5 flex items-center gap-3 text-[10px] text-gray-400">
            {authorName && <span>{authorName}</span>}
            <span className="flex items-center gap-1">
              <Clock className="size-2.5" />
              {getTimeAgo(publishedDate)}
            </span>
            {showViews && (
              <span className="flex items-center gap-1">
                <Eye className="size-2.5" />
                {formatViews(article.viewCount || 0)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default: vertical
  const imageAspect = size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]";
  const titleSize = size === "lg" ? "text-base" : size === "sm" ? "text-[12px]" : "text-[13px]";

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className={cn("group flex flex-col transition-all duration-300", className)}
    >
      <div className={cn("relative overflow-hidden bg-gray-100", imageAspect)}>
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover card-image-zoom"
          priority={priority}
        />
        {showBookmark && (
          <button className="absolute right-2 top-2 flex size-7 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-brand hover:scale-110">
            <BookmarkSimple className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-brand-text">{categoryName}</span>
          <span className="text-gray-300">|</span>
          <span className="text-[10px] text-gray-400">{getTimeAgo(publishedDate)}</span>
        </div>
        <h3 className={cn("font-semibold leading-snug line-clamp-2 group-hover:text-brand-text transition-colors", titleSize)}>
          {article.title}
        </h3>
        {showExcerpt && article.excerpt && (
          <p className="text-[11px] leading-relaxed text-gray-500 line-clamp-2 mt-0.5">
            {article.excerpt}
          </p>
        )}
        {showViews && (
          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Eye className="size-2.5" />
              {formatViews(article.viewCount || 0)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
