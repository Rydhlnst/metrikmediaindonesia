"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getTimeAgo, formatViews } from "@/lib/article-helpers";
import { Clock, Eye, Fire } from "@phosphor-icons/react/dist/ssr";

interface HeroSectionProps {
  articles: any[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayArticles = articles.slice(0, 5);
  const mainArticle = articles[0];
  const subArticles = articles.slice(1, 4);
  const sideArticles = articles.slice(4, 9);

  useEffect(() => { setMounted(true); }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !mounted) return;
    emblaApi.on("select", onSelect);
    onSelect();
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => { emblaApi.off("select", onSelect); clearInterval(interval); };
  }, [emblaApi, onSelect, mounted]);

  if (!displayArticles || displayArticles.length === 0) return null;

  return (
    <div className="w-full">
      {/* MOBILE CAROUSEL */}
      <div className="sm:hidden">
        {mounted ? (
          <div className="relative w-full overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {displayArticles.map((article: any, index: number) => (
                <div key={article.id} className="min-w-0 flex-[0_0_100%]">
                  <Link
                    href={`/${getCategorySlug(article)}/${article.slug}`}
                    className="group relative block aspect-[16/10] w-full overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      fill
                      sizes="100vw"
                      className="object-cover card-image-zoom"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        <Fire className="size-2.5" weight="fill" /> Trending
                      </span>
                      <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 text-[9px] text-white/80">
                        <Eye className="size-2.5" /> {formatViews(article.viewCount || 0)}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="mb-1.5 inline-block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {getCategoryName(article)}
                      </span>
                      <h1 className="text-lg font-bold leading-tight text-white line-clamp-2" style={{ fontFamily: "var(--font-playfair)" }}>
                        {article.title}
                      </h1>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-white/60">
                        <span className="size-1 rounded-full bg-green-400 animate-live-pulse" />
                        <Clock className="size-3" />
                        <span>{getTimeAgo(article.publishedAt || new Date().toISOString())}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {displayArticles.map((_: any, index: number) => (
                <button key={index} className={cn("h-1 rounded-full transition-all duration-300", index === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/40")} />
              ))}
            </div>
          </div>
        ) : (
          <div className="aspect-[16/10] w-full animate-pulse bg-gray-100" />
        )}
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden gap-6 sm:grid sm:grid-cols-[1fr_300px] lg:grid-cols-[1fr_340px]">
        <div>
          {mainArticle && (
            <Link
              href={`/${getCategorySlug(mainArticle)}/${mainArticle.slug}`}
              className="group relative block aspect-[16/9] w-full overflow-hidden bg-gray-100"
            >
              <Image
                src={getImageUrl(mainArticle.featuredImage)}
                alt={mainArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover card-image-zoom"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Fire className="size-3" weight="fill" /> Berita Utama
                </span>
                <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 text-[10px] text-white/80">
                  <Eye className="size-3" /> {formatViews(mainArticle.viewCount || 0)} views
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {getCategoryName(mainArticle)}
                </span>
                <h1 className="text-xl font-bold leading-tight text-white line-clamp-2 sm:text-2xl lg:text-[28px] lg:leading-[1.2]" style={{ fontFamily: "var(--font-playfair)" }}>
                  {mainArticle.title}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-white/60">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-green-400 animate-live-pulse" />
                    Baru saja
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {getTimeAgo(mainArticle.publishedAt || new Date().toISOString())}
                  </span>
                </div>
              </div>
            </Link>
          )}
          <div className="mt-3 grid grid-cols-3 gap-4">
            {subArticles.map((article: any) => (
              <Link
                key={article.id}
                href={`/${getCategorySlug(article)}/${article.slug}`}
                className="group border-t-2 border-gray-200 pt-3 transition-all hover:border-brand hover:pl-1"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand">{getCategoryName(article)}</span>
                <h3 className="mt-1 text-[13px] font-semibold leading-snug line-clamp-3 text-foreground group-hover:text-brand transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-l border-gray-200 pl-5">
          <div className="border-b-2 border-brand pb-2.5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-green-500 animate-live-pulse" />
              Terbaru
            </h2>
          </div>
          <div className="mt-3 divide-y divide-gray-100">
            {sideArticles.map((article: any, index: number) => (
              <Link
                key={article.id}
                href={`/${getCategorySlug(article)}/${article.slug}`}
                className="group flex gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="flex shrink-0 items-start pt-1 text-[18px] font-bold text-gray-200 ranking-number" style={{ fontFamily: "var(--font-playfair)" }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 min-w-0 flex-col justify-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand">{getCategoryName(article)}</span>
                  <h3 className="mt-0.5 text-[12px] font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand transition-colors">
                    {article.title}
                  </h3>
                  <span className="mt-0.5 text-[9px] text-gray-400 flex items-center gap-1">
                    <Clock className="size-2" />
                    {getTimeAgo(article.publishedAt || new Date().toISOString())}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
