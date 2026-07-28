import Link from "next/link";
import Image from "next/image";
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

interface ArticleCardSideProps {
  article: any;
}

export function ArticleCardSide({ article }: ArticleCardSideProps) {
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  const timeStr = publishedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group flex gap-3"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-muted sm:w-28 lg:w-32">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 min-w-0 flex-col justify-center">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{timeStr}</span>
        </div>
      </div>
    </Link>
  );
}
