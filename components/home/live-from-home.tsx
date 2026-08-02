"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { getCategorySlug } from "@/lib/article-helpers";
import { SectionHeader } from "@/components/shared/section-header";

interface LiveFromHomeProps {
  articles: any[];
}

export function LiveFromHome({ articles }: LiveFromHomeProps) {
  const displayArticles = articles.slice(0, 6);
  if (!displayArticles || displayArticles.length === 0) return null;

  return (
    <div>
      <SectionHeader title="Live From Home" href="/pencarian" />
      <div className="mt-3 -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 scrollbar-hide">
        <div className="flex gap-3">
          {displayArticles.map((article: any) => (
            <Link
              key={article.id}
              href={`/${getCategorySlug(article)}/${article.slug}`}
              className="group relative aspect-[4/3] w-44 shrink-0 overflow-hidden bg-gray-100 sm:w-52"
            >
              <Image
                src={getImageUrl(article.featuredImage)}
                alt={article.title}
                fill
                sizes="208px"
                className="object-cover card-image-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-[12px] font-semibold leading-snug text-white line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
