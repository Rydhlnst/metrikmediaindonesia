"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { articles } from "@/lib/mock-data";
import { ArticleCardHero } from "@/components/article/article-card-hero";
import { ArticleCardSide } from "@/components/article/article-card-side";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const featuredArticles = articles.filter((a) => a.isFeatured).slice(0, 4);
  const sideArticles = articles.filter((a) => !a.isFeatured).slice(0, 3);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Main Slider */}
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {featuredArticles.map((article) => (
            <div key={article.id} className="min-w-0 flex-[0_0_100%]">
              <ArticleCardHero article={article} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
        >
          <CaretLeft className="size-4" weight="bold" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
        >
          <CaretRight className="size-4" weight="bold" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {featuredArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-1 transition-all duration-300 ${
                index === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side Articles */}
      <div className="hidden flex-col gap-5 divide-y divide-border lg:flex">
        {sideArticles.map((article) => (
          <div key={article.id} className="pt-5 first:pt-0">
            <ArticleCardSide article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
