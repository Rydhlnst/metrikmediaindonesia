import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendUp } from "@phosphor-icons/react/dist/ssr";
import { getImageUrl } from "@/lib/utils";

interface TrendingNewsProps {
  articles: any[];
}

export function TrendingNews({ articles }: TrendingNewsProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
        <div className="flex items-center gap-2">
          <TrendUp className="size-5 text-brand" />
          <h2 className="text-lg font-semibold">Trending News</h2>
        </div>
        <Link href="/trending" className="text-muted-foreground transition-colors hover:text-foreground">
          <ArrowRight className="size-5" />
        </Link>
      </div>
      <div className="mt-4 space-y-4">
        {articles.map((article: any) => {
          const categoryName = typeof article.category === "object" ? article.category?.name : "";
          const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";

          return (
            <Link
              key={article.id}
              href={`/${categorySlug}/${article.slug}`}
              className="group flex gap-3"
            >
              <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <span className="text-xs font-medium text-brand">{categoryName}</span>
                <h3 className="mt-0.5 text-sm font-semibold leading-snug line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
