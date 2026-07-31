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
      <div className="border-b-2 border-foreground pb-3">
        <h2 className="text-lg font-semibold">Artikel Terpopuler</h2>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "border-b-2 border-[#a68a0a] text-[#a68a0a]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="mt-4 space-y-0 divide-y divide-border">
        {displayArticles.map((article: any, index: number) => {
          const categorySlug = getCategorySlug(article);
          const categoryName = getCategoryName(article);

          return (
            <Link
              key={article.id}
              href={`/${categorySlug}/${article.slug}`}
              className="group flex gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex flex-1 min-w-0 flex-col justify-center">
                <span className="text-[10px] font-medium text-[#a68a0a]">
                  {categoryName}
                </span>
                <h3 className="mt-0.5 text-[13px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-[#a68a0a] transition-colors">
                  {article.title}
                </h3>
              </div>
              <div className="relative h-16 w-20 shrink-0 overflow-hidden bg-muted">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="80px"
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
