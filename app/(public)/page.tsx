import { HeroSection } from "@/components/home/hero-section";
import { TrendingTabs } from "@/components/home/trending-tabs";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { ArticleCard } from "@/components/article/article-card";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { getArticles, getTrendingArticles } from "@/lib/payload-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latestRes, trendingRes] = await Promise.all([
    getArticles({ limit: 20 }),
    getTrendingArticles(10),
  ]);
  const articles = latestRes.docs;
  const trendingArticles = trendingRes.docs;

  return (
    <div className="py-6">
      {/* Hero — full width, no arrows */}
      <AnimateOnScroll animation="fade-in">
        <HeroSection articles={articles} />
      </AnimateOnScroll>

      {/* Trending + 2-col grid with Right Sidebar */}
      <div className="mt-8 flex gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Trending Tabs */}
          <AnimateOnScroll animation="fade-up" delay={100}>
            <TrendingTabs articles={trendingArticles} />
          </AnimateOnScroll>

          {/* Latest Articles — 2-col grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Berita Terkini</h2>
              <a href="/pencarian" className="text-xs font-medium text-brand hover:underline">
                Lihat Semua
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {articles.slice(0, 12).map((article: any, index: number) => (
                <AnimateOnScroll key={article.id} animation="scale-in" delay={(index * 50) as 0 | 100 | 200}>
                  <ArticleCard article={article} variant="horizontal" showViews />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <AnimateOnScroll animation="slide-right" delay={200}>
          <RightSidebar trendingArticles={trendingArticles} />
        </AnimateOnScroll>
      </div>
    </div>
  );
}
