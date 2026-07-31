"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";

interface HeroSectionProps {
  articles: any[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayArticles = articles.slice(0, 5);
  const mainArticle = articles[0];
  const subArticles = articles.slice(1, 4);
  const sideArticles = articles.slice(4, 9);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  if (!displayArticles || displayArticles.length === 0) return null;

  const getCategorySlug = (article: any) =>
    typeof article.category === "object" ? article.category?.slug : "berita";
  const getCategoryName = (article: any) =>
    typeof article.category === "object" ? article.category?.name : "";

  return (
    <div className="w-full">
      {/* ========== MOBILE CAROUSEL ========== */}
      <div className="sm:hidden">
        <div className="relative w-full overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {displayArticles.map((article: any, index: number) => {
              const categorySlug = getCategorySlug(article);
              const dateStr = new Date(article.publishedAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={article.id} className="min-w-0 flex-[0_0_100%]">
                  <Link
                    href={`/${categorySlug}/${article.slug}`}
                    className="group relative block aspect-video w-full overflow-hidden bg-muted"
                  >
                    <Image
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="mb-2 text-xs text-white/70">{dateStr}</div>
                      <h1 className="text-lg font-semibold leading-tight text-white line-clamp-2">
                        {article.title}
                      </h1>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {displayArticles.map((_: any, index: number) => (
              <button
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT (Tempo-style) ========== */}
      <div className="hidden gap-8 sm:grid sm:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px]">
        {/* Left: Main Featured + Sub Articles */}
        <div>
          {/* Main Featured Article */}
          {mainArticle && (
            <Link
              href={`/${getCategorySlug(mainArticle)}/${mainArticle.slug}`}
              className="group relative block aspect-[16/10] w-full overflow-hidden bg-muted"
            >
              <Image
                src={getImageUrl(mainArticle.featuredImage)}
                alt={mainArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <h1 className="text-xl font-bold leading-tight text-white line-clamp-2 sm:text-2xl lg:text-3xl">
                  {mainArticle.title}
                </h1>
              </div>
            </Link>
          )}

          {/* Sub Articles Row */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {subArticles.map((article: any) => (
              <Link
                key={article.id}
                href={`/${getCategorySlug(article)}/${article.slug}`}
                className="group"
              >
                <h3 className="text-[13px] font-semibold leading-snug line-clamp-3 text-foreground group-hover:text-[#a68a0a] transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Artikel Terbaru Sidebar */}
        <div className="border-l border-border pl-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Artikel Terbaru
          </h2>
          <div className="mt-4 divide-y divide-border">
            {sideArticles.map((article: any) => {
              const categorySlug = getCategorySlug(article);
              const categoryName = getCategoryName(article);
              return (
                <Link
                  key={article.id}
                  href={`/${categorySlug}/${article.slug}`}
                  className="group flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 min-w-0 flex-col justify-center">
                    <span className="text-[10px] font-medium text-[#a68a0a]">
                      {categoryName}
                    </span>
                    <h3 className="mt-0.5 text-[13px] font-semibold leading-snug line-clamp-2 text-foreground">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
