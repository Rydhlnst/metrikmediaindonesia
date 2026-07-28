"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { BookmarkSimple } from "@phosphor-icons/react/dist/ssr";

function getImageUrl(image: any): string {
  if (!image) return "https://picsum.photos/seed/placeholder/1200/675";
  if (typeof image === "string") return image;
  if (image.url) return image.url;
  return "https://picsum.photos/seed/placeholder/1200/675";
}

interface HeroSectionProps {
  articles: any[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayArticles = articles.slice(0, 5);

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

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayArticles.map((article: any, index: number) => {
            const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
            const authorName = typeof article.author === "object" ? article.author?.name : "";
            const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

            const dateStr = publishedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = publishedDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
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

                  <button className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm sm:right-4 sm:top-4">
                    <BookmarkSimple className="size-5" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <div className="mb-2 text-xs text-white/70">
                      {dateStr} · {timeStr}
                    </div>
                    <h1 className="text-lg font-semibold leading-tight text-white line-clamp-2 sm:text-2xl xl:text-3xl">
                      {article.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-2 sm:mt-3">
                      <AvatarAuthor name={authorName || "Author"} size="sm" />
                      <span className="text-sm font-medium text-white">{authorName}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
          {displayArticles.map((_: any, index: number) => (
            <button
              key={index}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
