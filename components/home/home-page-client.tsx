"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { ArrowRight, BookmarkSimple, Clock, Eye, Fire } from "@phosphor-icons/react/dist/ssr";

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

const categoryChips = ["Latest", "Bisnis", "Olahraga", "Pendidikan", "Budaya"];

interface HomePageClientProps {
  articles: any[];
}

export function HomePageClient({ articles }: HomePageClientProps) {
  const [activeChip, setActiveChip] = useState("Latest");

  const filteredArticles = activeChip === "Latest"
    ? articles
    : articles.filter((a: any) => {
        const cat = typeof a.category === "object" ? a.category?.name : "";
        return cat.toLowerCase().includes(activeChip.toLowerCase());
      });

  const featuredArticle = articles[0];
  const listArticles = filteredArticles.slice(0, 8);

  return (
    <div className="space-y-6">
      {featuredArticle && <FeaturedCard article={featuredArticle} />}

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categoryChips.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeChip === chip
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Article List */}
      <div className="space-y-4">
        {listArticles.map((article: any) => (
          <ArticleListCard key={article.id} article={article} />
        ))}
      </div>

      <Link
        href="/pencarian"
        className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
      >
        See More Articles
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function FeaturedCard({ article }: { article: any }) {
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const authorName = typeof article.author === "object" ? article.author?.name : "";

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden bg-muted"
    >
      <Image
        src={getImageUrl(article.featuredImage)}
        alt={article.title}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute left-3 top-3">
        <span className="flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white">
          <Fire className="size-3" />
          Trending
        </span>
      </div>

      <button className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm">
        <BookmarkSimple className="size-5" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h2 className="text-lg font-semibold leading-tight text-white line-clamp-2">
          {article.title}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <AvatarAuthor name={authorName || "Author"} size="sm" />
          <span className="text-xs text-white/80">{authorName}</span>
          <span className="text-xs text-white/50">·</span>
          <span className="text-xs text-white/50">{categoryName}</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleListCard({ article }: { article: any }) {
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const authorName = typeof article.author === "object" ? article.author?.name : "";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group flex gap-3"
    >
      <div className="flex flex-1 min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <AvatarAuthor name={authorName || "Author"} size="sm" />
          <span className="text-xs font-medium text-foreground">{authorName}</span>
          <span className="text-xs text-muted-foreground">· {categoryName}</span>
        </div>
        <h3 className="mt-1.5 text-[15px] font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {getTimeAgo(publishedDate)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3" />
            {(article.viewCount || 0).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden bg-muted sm:w-24">
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
}
