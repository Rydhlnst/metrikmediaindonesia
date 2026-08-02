import Link from "next/link";
import { HeroSection } from "@/components/home/hero-section";
import { CoverOverlay } from "@/components/home/cover-overlay";
import { TrendingTabs } from "@/components/home/trending-tabs";
import { LiveFromHome } from "@/components/home/live-from-home";
import { TopikTerkini } from "@/components/home/topik-terkini";
import { CategorySectionLarge } from "@/components/home/category-section-large";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { SectionHeader } from "@/components/shared/section-header";
import { ArticleCard } from "@/components/article/article-card";
import { getArticles, getTrendingArticles } from "@/lib/payload-queries";
import { Fire, TrendUp } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latestRes, trendingRes] = await Promise.all([
    getArticles({ limit: 30 }),
    getTrendingArticles(10),
  ]);
  const articles = latestRes.docs;
  const trendingArticles = trendingRes.docs;

  const topArticles = articles.slice(0, 3);
  const moreArticles = articles.slice(9, 12);
  const latestArticles = articles.slice(0, 5);
  const liveArticles = articles.slice(12, 18);

  const bisnisArticles = articles.filter((a: any) => typeof a.category === "object" && a.category?.slug === "bisnis").slice(0, 4);
  const olahragaArticles = articles.filter((a: any) => typeof a.category === "object" && a.category?.slug === "olahraga").slice(0, 4);
  const pendidikanArticles = articles.filter((a: any) => typeof a.category === "object" && a.category?.slug === "pendidikan").slice(0, 4);
  const sosialArticles = articles.filter((a: any) => typeof a.category === "object" && a.category?.slug === "sosial-dan-budaya").slice(0, 4);

  const topics = [
    { name: "Korupsi", slug: "korupsi" },
    { name: "Politik", slug: "politik" },
    { name: "Ekonomi", slug: "ekonomi" },
    { name: "Olahraga", slug: "olahraga" },
    { name: "Teknologi", slug: "teknologi" },
    { name: "Pendidikan", slug: "pendidikan" },
    { name: "Kesehatan", slug: "kesehatan" },
    { name: "Hukum", slug: "hukum" },
  ];

  return (
    <>
      <CoverOverlay />
      <div className="py-5 sm:py-6">
        <AnimateOnScroll animation="fade-in">
          <HeroSection articles={articles} />
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <TrendingTabs articles={trendingArticles} />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <LiveFromHome articles={liveArticles} />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <TopikTerkini topics={topics} />
          </div>
        </AnimateOnScroll>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <AnimateOnScroll animation="slide-left">
            <div className="space-y-8">
              <CategorySectionLarge title="Bisnis" categorySlug="bisnis" articles={bisnisArticles} />
              <CategorySectionLarge title="Olahraga" categorySlug="olahraga" articles={olahragaArticles} />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-right" delay={200}>
            <div className="border-l border-gray-200 pl-5">
              <SectionHeader title="Top Stories" href="/pencarian" icon={<Fire className="size-4 text-brand" weight="fill" />} />
              <div className="mt-3 divide-y divide-gray-100">
                {topArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <AnimateOnScroll animation="slide-left">
            <div className="space-y-8">
              <CategorySectionLarge title="Pendidikan" categorySlug="pendidikan" articles={pendidikanArticles} />
              <CategorySectionLarge title="Sosial & Budaya" categorySlug="sosial-dan-budaya" articles={sosialArticles} />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-right" delay={200}>
            <div className="border-l border-gray-200 pl-5">
              <SectionHeader title="Terbaru" href="/pencarian" icon={<TrendUp className="size-4 text-brand" />} />
              <div className="mt-3 divide-y divide-gray-100">
                {latestArticles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <AnimateOnScroll animation="fade-up">
          <section>
            <SectionHeader title="Berita Terkini" href="/pencarian" />
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {moreArticles.map((article: any, index: number) => (
                <AnimateOnScroll key={article.id} animation="scale-in" delay={(index * 100) as 0 | 100 | 200}>
                  <ArticleCard article={article} variant="vertical" showViews showBookmark />
                </AnimateOnScroll>
              ))}
            </div>
          </section>
        </AnimateOnScroll>
      </div>
    </>
  );
}
