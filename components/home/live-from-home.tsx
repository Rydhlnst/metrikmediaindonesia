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
      <div className="flex items-center justify-between border-b-2 border-brand pb-2.5">
        <h2 className="text-[14px] font-bold uppercase tracking-wider">Live From Home</h2>
        <Link
          href="/pencarian"
          className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-foreground transition-colors"
        >
          Lihat Semua <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="mt-3 -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 scrollbar-hide">
        <div className="flex gap-3">
          {displayArticles.map((article: any) => {
            const categorySlug = getCategorySlug(article);

            return (
              <Link
                key={article.id}
                href={`/${categorySlug}/${article.slug}`}
                className="group relative aspect-[4/3] w-44 shrink-0 overflow-hidden bg-gray-100 sm:w-52"
              >
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="208px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-[12px] font-semibold leading-snug text-white line-clamp-2">
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
