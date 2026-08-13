"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getTimeAgo, formatViews } from "@/lib/article-helpers";
import { Clock, Eye, TrendUp } from "@phosphor-icons/react/dist/ssr";
import { CategoryBadge } from "@/components/shared/category-badge";
import { SectionHeading } from "@/components/shared/section-heading";

interface TrendingTabsProps {
  articles: any[];
}

const tabs = [
  { label: "Harian", value: "daily" },
  { label: "Mingguan", value: "weekly" },
  { label: "Bulanan", value: "monthly" },
];

export function TrendingTabs({ articles }: TrendingTabsProps) {
  const [activeTab, setActiveTab] = useState("daily");
  const displayArticles = articles.slice(0, 5);

  if (!displayArticles || displayArticles.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendUp className="size-5 text-secondary" weight="bold" />
        <SectionHeading size="md">Artikel Terpopuler</SectionHeading>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.value
                ? "bg-secondary text-on-secondary font-semibold"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trending Cards */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {displayArticles.map((article: any, index: number) => (
          <Link
            key={article.id}
            href={`/${getCategorySlug(article)}/${article.slug}`}
            className="group flex gap-4 p-3 transition-all hover:bg-surface-container-low"
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-surface-container sm:h-24 sm:w-28">
              <Image
                src={getImageUrl(article.featuredImage)}
                alt={article.title}
                fill
                sizes="112px"
                className="object-cover card-image-zoom"
              />
              {index < 3 && (
                <div className="absolute top-1.5 left-1.5 flex size-7 items-center justify-center bg-secondary-container text-xs font-bold text-on-secondary-container">
                  {index + 1}
                </div>
              )}
            </div>
            <div className="flex flex-1 min-w-0 flex-col justify-center gap-1">
              <CategoryBadge>{getCategoryName(article)}</CategoryBadge>
              <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-on-surface group-hover:text-secondary transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {getTimeAgo(article.publishedAt || new Date().toISOString())}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {formatViews(article.viewCount || 0)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
