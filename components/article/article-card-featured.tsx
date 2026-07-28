import Link from "next/link";
import Image from "next/image";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import { getImageUrl } from "@/lib/utils";

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

interface ArticleCardFeaturedProps {
  article: any;
  className?: string;
}

export function ArticleCardFeatured({ article, className }: ArticleCardFeaturedProps) {
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const authorName = typeof article.author === "object" ? article.author?.name : "";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className={`group flex flex-col ${className ?? ""}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <AvatarAuthor name={authorName || "Author"} size="sm" />
            <span className="font-medium text-foreground">{authorName}</span>
          </div>
          <span>|</span>
          <span className="font-medium text-brand">{categoryName}</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {getTimeAgo(publishedDate)}
          </span>
        </div>
        <h2 className="text-xl font-semibold leading-tight line-clamp-3 sm:text-2xl">
          {article.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {article.excerpt}
        </p>
        <span className="mt-1 text-xs font-semibold uppercase underline underline-4 text-brand">
          read more
        </span>
      </div>
    </Link>
  );
}
