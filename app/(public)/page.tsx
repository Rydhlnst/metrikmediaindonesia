import { HeroSection } from "@/components/home/hero-section";
import { CoverOverlay } from "@/components/home/cover-overlay";
import { TrendingTabs } from "@/components/home/trending-tabs";
import { LiveFromHome } from "@/components/home/live-from-home";
import { TopikTerkini } from "@/components/home/topik-terkini";
import { CategorySectionLarge } from "@/components/home/category-section-large";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { SectionHeader } from "@/components/shared/section-header";
import { ArticleCard } from "@/components/article/article-card";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { getArticles, getTrendingArticles } from "@/lib/payload-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latestRes, trendingRes] = await Promise.all([
    getArticles({ limit: 30 }),
    getTrendingArticles(10),
  ]);
  const articles = latestRes.docs;
  const trendingArticles = trendingRes.docs;

  const moreArticles = articles.slice(9, 12);

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
      <div className="py-6">
        {/* Hero */}
        <AnimateOnScroll animation="fade-in">
          <HeroSection articles={articles} />
        </AnimateOnScroll>

        {/* Trending */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <TrendingTabs articles={trendingArticles} />
          </div>
        </AnimateOnScroll>

        {/* Live From Home */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <LiveFromHome articles={articles.slice(12, 18)} />
          </div>
        </AnimateOnScroll>

        {/* Topik Terkini */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <TopikTerkini topics={topics} />
          </div>
        </AnimateOnScroll>

        {/* Divider */}
        <div className="my-10 h-px bg-gray-100" />

        {/* 3-column: Main content + Right sidebar */}
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-10">
              <AnimateOnScroll animation="fade-up">
                <CategorySectionLarge title="Bisnis" categorySlug="bisnis" articles={bisnisArticles} />
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-up">
                <CategorySectionLarge title="Olahraga" categorySlug="olahraga" articles={olahragaArticles} />
              </AnimateOnScroll>
            </div>

            <div className="my-10 h-px bg-gray-100" />

            <div className="space-y-10">
              <AnimateOnScroll animation="fade-up">
                <CategorySectionLarge title="Pendidikan" categorySlug="pendidikan" articles={pendidikanArticles} />
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-up">
                <CategorySectionLarge title="Sosial & Budaya" categorySlug="sosial-dan-budaya" articles={sosialArticles} />
              </AnimateOnScroll>
            </div>

            <div className="my-10 h-px bg-gray-100" />

            {/* Berita Terkini */}
            <AnimateOnScroll animation="fade-up">
              <section>
                <SectionHeader title="Berita Terkini" href="/pencarian" />
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {moreArticles.map((article: any, index: number) => (
                    <AnimateOnScroll key={article.id} animation="scale-in" delay={(index * 100) as 0 | 100 | 200}>
                      <ArticleCard article={article} variant="vertical" showViews showBookmark />
                    </AnimateOnScroll>
                  ))}
                </div>
              </section>
            </AnimateOnScroll>
          </div>

          {/* Right Sidebar */}
          <AnimateOnScroll animation="slide-right" delay={200}>
            <RightSidebar articles={articles.slice(3, 9)} />
          </AnimateOnScroll>
        </div>
      </div>
    </>
  );
}
