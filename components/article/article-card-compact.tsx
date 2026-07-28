import Link from "next/link";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { Clock } from "@phosphor-icons/react/dist/ssr";

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

interface ArticleCardCompactProps {
  article: any;
  rank?: number;
}

export function ArticleCardCompact({ article, rank }: ArticleCardCompactProps) {
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const authorName = typeof article.author === "object" ? article.author?.name : "";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group flex items-start gap-3 py-4 first:pt-0 last:pb-0"
    >
      {rank !== undefined && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded bg-brand text-[11px] font-semibold text-brand-foreground">
          {rank}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 transition-colors">
          {article.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
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
      </div>
    </Link>
  );
}
