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

interface TwoColumnSectionProps {
  articles: any[];
}

export function TwoColumnSection({ articles }: TwoColumnSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {articles.map((article: any) => {
        const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
        const authorName = typeof article.author === "object" ? article.author?.name : "";
        const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

        const dateStr = publishedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const timeStr = publishedDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <Link
            key={article.id}
            href={`/${categorySlug}/${article.slug}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <Image
                src={getImageUrl(article.featuredImage)}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-1 pt-3">
              <h3 className="text-base font-semibold leading-snug line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{authorName}</span>
                <span>·</span>
                <span>{dateStr} {timeStr}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
