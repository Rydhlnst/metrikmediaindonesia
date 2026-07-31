"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface LiveFromHomeProps {
  articles: any[];
}

export function LiveFromHome({ articles }: LiveFromHomeProps) {
  const displayArticles = articles.slice(0, 6);

  if (!displayArticles || displayArticles.length === 0) return null;

  const getCategorySlug = (article: any) =>
    typeof article.category === "object" ? article.category?.slug : "berita";

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
        <h2 className="text-lg font-semibold">Live From Home</h2>
        <Link
          href="/pencarian"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Show all <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="mt-4 -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 scrollbar-hide">
        <div className="flex gap-4">
          {displayArticles.map((article: any) => {
            const categorySlug = getCategorySlug(article);

            return (
              <Link
                key={article.id}
                href={`/${categorySlug}/${article.slug}`}
                className="group relative aspect-[4/3] w-48 shrink-0 overflow-hidden bg-muted sm:w-56"
              >
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="224px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-[13px] font-semibold leading-snug text-white line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
