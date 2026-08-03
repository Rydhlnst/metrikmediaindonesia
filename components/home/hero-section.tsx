"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getTimeAgo, formatViews } from "@/lib/article-helpers";
import { Clock, Eye } from "@phosphor-icons/react/dist/ssr";

interface HeroSectionProps {
  articles: any[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayArticles = articles.slice(0, 5);

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
      <div className="lg:hidden">
        {mounted ? (
          <div className="relative" ref={emblaRef}>
            <div className="flex overflow-hidden">
              {displayArticles.map((article: any, index: number) => (
                <div key={article.id} className="min-w-0 flex-[0_0_100%] pl-4 first:pl-0">
                  <Link
                    href={`/${getCategorySlug(article)}/${article.slug}`}
                    className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100"
                  >
                    <Image
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      fill
                      sizes="100vw"
                      className="object-cover card-image-zoom"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-xs font-semibold text-gray-900">
                        {getCategoryName(article)}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h1
                        className="text-lg font-bold leading-tight text-white line-clamp-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {article.title}
                      </h1>
                      <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
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
                </div>
              ))}
            </div>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {displayArticles.map((_: any, index: number) => (
                <button
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-gray-100" />
        )}
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:block">
        {mounted ? (
          <div className="relative" ref={emblaRef}>
            <div className="flex overflow-hidden">
              {displayArticles.map((article: any, index: number) => (
                <div key={article.id} className="min-w-0 flex-[0_0_100%]">
                  <Link
                    href={`/${getCategorySlug(article)}/${article.slug}`}
                    className="group relative block aspect-[21/9] w-full overflow-hidden rounded-xl bg-gray-100"
                  >
                    <Image
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      fill
                      sizes="100vw"
                      className="object-cover card-image-zoom"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-sm font-semibold text-gray-900">
                        {getCategoryName(article)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-sm text-white/80 backdrop-blur-sm">
                        <Eye className="size-3.5" /> {formatViews(article.viewCount || 0)}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h1
                        className="text-2xl font-bold leading-tight text-white line-clamp-2 xl:text-3xl"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {article.title}
                      </h1>
                      <div className="mt-2 flex items-center gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {getTimeAgo(article.publishedAt || new Date().toISOString())}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {displayArticles.map((_: any, index: number) => (
                <button
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === selectedIndex ? "w-6 bg-brand" : "w-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="aspect-[21/9] w-full animate-pulse rounded-xl bg-gray-100" />
        )}
      </div>
    </div>
  );
}
