import Link from "next/link";
import Image from "next/image";
import { Clock } from "@phosphor-icons/react/dist/ssr";

function getImageUrl(image: any): string {
  if (!image) return "https://picsum.photos/seed/placeholder/800/450";
  if (typeof image === "string") return image;
  if (image.url) return image.url;
  return "https://picsum.photos/seed/placeholder/800/450";
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

interface ArticleCardHorizontalAltProps {
  article: any;
}

export function ArticleCardHorizontalAlt({ article }: ArticleCardHorizontalAltProps) {
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const authorName = typeof article.author === "object" ? article.author?.name : "";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1.5 pt-3">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-brand">{categoryName}</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {getTimeAgo(publishedDate)}
          </span>
        </div>
        <h3 className="text-base font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">{authorName}</span>
        </div>
      </div>
    </Link>
  );
}
