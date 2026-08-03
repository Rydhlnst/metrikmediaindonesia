"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getTimeAgo, formatViews } from "@/lib/article-helpers";
import { SectionHeader } from "@/components/shared/section-header";
import { Clock, Eye, TrendUp } from "@phosphor-icons/react/dist/ssr";

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
      <SectionHeader
        title="Artikel Terpopuler"
        icon={<TrendUp className="size-5 text-brand-text" weight="bold" />}
      />

      {/* Tabs */}
      <div className="mt-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.value
                ? "bg-brand text-gray-900 font-semibold shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
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
            className="group flex gap-4 rounded-xl p-3 transition-all hover:bg-gray-50"
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-28">
              <Image
                src={getImageUrl(article.featuredImage)}
                alt={article.title}
                fill
                sizes="112px"
                className="object-cover card-image-zoom"
              />
              {index < 3 && (
                <div className="absolute top-1.5 left-1.5 flex size-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-gray-900">
                  {index + 1}
                </div>
              )}
            </div>
            <div className="flex flex-1 min-w-0 flex-col justify-center gap-1">
              <span className="text-xs font-semibold text-brand-text">{getCategoryName(article)}</span>
              <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand-text transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
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
