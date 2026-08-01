"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";

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

  return (
    <div>
      <div className="border-b-2 border-brand pb-2.5">
        <h2 className="text-[14px] font-bold uppercase tracking-wider">Artikel Terpopuler</h2>
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
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />
            )}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="mt-2 divide-y divide-gray-100">
        {displayArticles.map((article: any, index: number) => {
          const categorySlug = getCategorySlug(article);
          const categoryName = getCategoryName(article);

          return (
            <Link
              key={article.id}
              href={`/${categorySlug}/${article.slug}`}
              className="group flex gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[13px] font-bold text-gray-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-1 min-w-0 flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand">
                  {categoryName}
                </span>
                <h3 className="mt-0.5 text-[12px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand transition-colors">
                  {article.title}
                </h3>
              </div>
              <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-gray-100">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
