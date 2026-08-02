"use client";

import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { TrendUp, Fire } from "@phosphor-icons/react/dist/ssr";

interface Article {
  slug: string;
  title: string;
  category?: { slug: string; name: string } | string | null;
  thumbnail?: { url: string } | string | null;
}

interface TrendingSection {
  name: string;
  articles: number;
  trend: "up" | "down" | "neutral";
}

const trendingSections: TrendingSection[] = [
  { name: "Bisnis", articles: 245, trend: "up" },
  { name: "Teknologi", articles: 189, trend: "up" },
  { name: "Olahraga", articles: 312, trend: "neutral" },
  { name: "Hiburan", articles: 156, trend: "down" },
  { name: "Dunia", articles: 278, trend: "up" },
  { name: "Sosial & Budaya", articles: 98, trend: "neutral" },
];

export function RightSidebar({
  trendingArticles,
}: {
  trendingArticles: Article[];
}) {
  return (
    <aside className="hidden w-[280px] shrink-0 xl:block">
      <div className="sticky top-20 space-y-6">
        {/* Trending News */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Fire className="size-4 text-brand" weight="fill" />
            <h3 className="text-sm font-bold text-foreground">Trending News</h3>
          </div>
          <div className="space-y-3">
            {trendingArticles.slice(0, 5).map((article, index) => {
              const categoryName =
                typeof article.category === "object" && article.category
                  ? article.category.name
                  : typeof article.category === "string"
                  ? article.category
                  : "Umum";
              const categorySlug =
                typeof article.category === "object" && article.category
                  ? article.category.slug
                  : typeof article.category === "string"
                  ? article.category.toLowerCase().replace(/\s+/g, "-")
                  : "umum";
              const imageUrl = getImageUrl(article.thumbnail);

              return (
                <Link
                  key={article.slug}
                  href={`/${categorySlug}/${article.slug}`}
                  className="group flex gap-3"
                >
                  {imageUrl && (
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-brand">
                      {categoryName}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-foreground group-hover:text-brand transition-colors">
                      {article.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trending Sections */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <TrendUp className="size-4 text-brand" weight="fill" />
            <h3 className="text-sm font-bold text-foreground">Trending Sections</h3>
          </div>
          <div className="space-y-2">
            {trendingSections.map((section) => (
              <Link
                key={section.name}
                href={`/${section.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                  {section.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{section.articles} articles</span>
                  {section.trend === "up" && (
                    <TrendUp className="size-3.5 text-green-500" weight="fill" />
                  )}
                  {section.trend === "down" && (
                    <TrendUp className="size-3.5 rotate-180 text-red-400" weight="fill" />
                  )}
                  {section.trend === "neutral" && (
                    <div className="h-0.5 w-3.5 rounded bg-gray-300" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
