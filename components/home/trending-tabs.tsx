"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { Eye } from "@phosphor-icons/react/dist/ssr";

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

  const displayArticles = articles.slice(0, 8);

  if (!displayArticles || displayArticles.length === 0) return null;

  const getCategorySlug = (article: any) =>
    typeof article.category === "object" ? article.category?.slug : "berita";
  const getCategoryName = (article: any) =>
    typeof article.category === "object" ? article.category?.name : "";

  const formatViews = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div>
      <div className="border-b-2 border-brand pb-2.5">
        <h2 className="text-[14px] font-bold uppercase tracking-wider flex items-center gap-2">
          <svg className="size-4 text-brand" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
          </svg>
          Artikel Terpopuler
        </h2>
      </div>

      {/* Tabs */}
      <div className="mt-3 flex gap-0 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "relative px-4 py-2 text-[12px] font-semibold tracking-wide transition-colors",
              activeTab === tab.value
                ? "text-brand"
                : "text-gray-400 hover:text-foreground"
            )}
          >
            {tab.label.toUpperCase()}
            {activeTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand" />
            )}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="mt-2 divide-y divide-gray-100">
        {displayArticles.map((article: any, index: number) => {
          const categorySlug = getCategorySlug(article);
          const categoryName = getCategoryName(article);
          const isTop3 = index < 3;

          return (
            <Link
              key={article.id}
              href={`/${categorySlug}/${article.slug}`}
              className="group flex gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center text-[14px] font-bold ranking-number",
                  isTop3
                    ? "bg-brand text-white"
                    : "text-gray-300"
                )}
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {index + 1}
              </span>
              <div className="flex flex-1 min-w-0 flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand">
                  {categoryName}
                </span>
                <h3 className="mt-0.5 text-[12px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand transition-colors">
                  {article.title}
                </h3>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[9px] text-gray-400">
                  <Eye className="size-2" />
                  {formatViews(article.viewCount || 0)} views
                </span>
              </div>
              <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="64px"
                  className="object-cover card-image-zoom"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
