import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { Clock, Eye } from "@phosphor-icons/react/dist/ssr";

interface ArticleCardProps {
  article: any;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const authorName = typeof article.author === "object" ? article.author?.name : "";

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className={cn("group flex flex-col transition-all duration-300", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        <div className="flex items-center gap-2">
          <AvatarAuthor name={authorName || "Author"} size="sm" />
          <span className="text-[11px] text-muted-foreground">
            {getTimeAgo(new Date(article.publishedAt || Date.now()))}
          </span>
        </div>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-brand">{categoryName}</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {article.readingTime || 5} min read
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
