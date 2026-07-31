import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/home/hero-section";
import { CoverOverlay } from "@/components/home/cover-overlay";
import { TrendingTabs } from "@/components/home/trending-tabs";
import { LiveFromHome } from "@/components/home/live-from-home";
import { TopikTerkini } from "@/components/home/topik-terkini";
import { CategorySectionLarge } from "@/components/home/category-section-large";
import { getArticles, getTrendingArticles } from "@/lib/payload-queries";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight, Clock, Eye, BookmarkSimple } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link href={href} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
        Show all <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

function ArticleListItem({ article }: { article: any }) {
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const authorName = typeof article.author === "object" ? article.author?.name : "";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group flex gap-4 py-4"
    >
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-muted sm:w-28">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 min-w-0 flex-col justify-center">
        <h3 className="text-[15px] font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{authorName}</span>
          <span>·</span>
          <span>{categoryName}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
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
    </Link>
  );
}

function ArticleCardWide({ article }: { article: any }) {
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const authorName = typeof article.author === "object" ? article.author?.name : "";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button className="absolute right-2 top-2 flex size-7 items-center justify-center bg-black/30 text-white backdrop-blur-sm">
          <BookmarkSimple className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-1 pt-3">
        <span className="text-[11px] font-medium text-[#a68a0a]">{categoryName}</span>
        <h3 className="text-base font-semibold leading-snug line-clamp-2">{article.title}</h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{authorName}</span>
          <span>·</span>
          <span>{getTimeAgo(publishedDate)}</span>
        </div>
      </div>
    </Link>
  );
}

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
      
      <div className="p-4 sm:p-6">
        <HeroSection articles={articles} />

        {/* Trending Tabs - Below Hero */}
        <div className="mt-8">
          <TrendingTabs articles={trendingArticles} />
        </div>

        {/* Live From Home Section */}
        <div className="mt-8">
          <LiveFromHome articles={liveArticles} />
        </div>

        {/* Topik Terkini */}
        <div className="mt-8">
          <TopikTerkini topics={topics} />
        </div>

        <div className="my-8 border-t border-border" />

        {/* Category Sections - Tempo Style */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {/* Bisnis Section */}
            <CategorySectionLarge
              title="Bisnis"
              categorySlug="bisnis"
              articles={bisnisArticles}
            />

            {/* Olahraga Section */}
            <CategorySectionLarge
              title="Olahraga"
              categorySlug="olahraga"
              articles={olahragaArticles}
            />
          </div>

          {/* Sidebar - Top Stories */}
          <div className="border-l border-border pl-6">
            <SectionHeader title="Top Stories" href="/pencarian" />
            <div className="mt-4 divide-y divide-border">
              {topArticles.map((article: any) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-border" />

        {/* Pendidikan & Sosial Section */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {/* Pendidikan Section */}
            <CategorySectionLarge
              title="Pendidikan"
              categorySlug="pendidikan"
              articles={pendidikanArticles}
            />

            {/* Sosial & Budaya Section */}
            <CategorySectionLarge
              title="Sosial & Budaya"
              categorySlug="sosial-dan-budaya"
              articles={sosialArticles}
            />
          </div>

          {/* Sidebar - Latest */}
          <div className="border-l border-border pl-6">
            <SectionHeader title="Latest" href="/pencarian" />
            <div className="mt-4 divide-y divide-border">
              {latestArticles.map((article: any) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-border" />

        {/* More Articles Grid */}
        <section>
          <SectionHeader title="Berita Terkini" href="/pencarian" />
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreArticles.map((article: any) => (
              <ArticleCardWide key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
