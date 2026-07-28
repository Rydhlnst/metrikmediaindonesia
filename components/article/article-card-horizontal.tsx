import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { Clock } from "@phosphor-icons/react/dist/ssr";

interface ArticleCardHorizontalProps {
  article: any;
  className?: string;
  showThumbnail?: boolean;
}

export function ArticleCardHorizontal({
  article,
  className,
  showThumbnail = true,
}: ArticleCardHorizontalProps) {
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const authorName = typeof article.author === "object" ? article.author?.name : "";

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className={cn(
        "group flex gap-3 py-4 first:pt-0 last:pb-0",
        className
      )}
    >
      {showThumbnail && (
        <div className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden bg-muted sm:w-28">
          <Image
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <AvatarAuthor name={authorName || "Author"} size="sm" />
            <span className="font-medium text-foreground">{authorName}</span>
          </div>
          <span>|</span>
          <span className="font-medium text-brand">{categoryName}</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {getTimeAgo(new Date(article.publishedAt || Date.now()))}
          </span>
        </div>
      </div>
    </Link>
  );
}

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
