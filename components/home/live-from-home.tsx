"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getTimeAgo } from "@/lib/article-helpers";
import { SectionHeader } from "@/components/shared/section-header";
import { CategoryBadge } from "@/components/shared/category-badge";

interface LiveFromHomeProps {
  articles: any[];
}

export function LiveFromHome({ articles }: LiveFromHomeProps) {
  const displayArticles = articles.slice(0, 6);
  if (!displayArticles || displayArticles.length === 0) return null;

  return (
    <div>
      <SectionHeader title="Live From Home" href="/pencarian" />
      <div className="mt-4 -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {displayArticles.map((article: any) => (
            <Link
              key={article.id}
              href={`/${getCategorySlug(article)}/${article.slug}`}
              className="group relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-xl bg-surface-container sm:w-48"
            >
              <Image
                src={getImageUrl(article.featuredImage)}
                alt={article.title}
                fill
                sizes="192px"
                className="object-cover card-image-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-2 left-2">
                <CategoryBadge variant="pill" className="text-[11px]">
                  {getCategoryName(article)}
                </CategoryBadge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">
                  {article.title}
                </h3>
                <span className="mt-1 block text-[11px] text-white/60">
                  {getTimeAgo(article.publishedAt || new Date().toISOString())}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
