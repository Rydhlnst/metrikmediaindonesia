import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { Clock } from "@phosphor-icons/react/dist/ssr";

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
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-2.5">
        <div className="flex items-center gap-2">
          <AvatarAuthor name={authorName || "Author"} size="sm" />
          <span className="text-[10px] text-gray-400">
            {getTimeAgo(new Date(article.publishedAt || Date.now()))}
          </span>
        </div>
        <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="font-semibold text-brand uppercase text-[9px] tracking-wider">{categoryName}</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <Clock className="size-2.5" />
            {article.readingTime || 5} min
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
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}
