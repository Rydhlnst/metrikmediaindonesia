import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/home/hero-section";
import { CoverOverlay } from "@/components/home/cover-overlay";
import { TrendingTabs } from "@/components/home/trending-tabs";
import { LiveFromHome } from "@/components/home/live-from-home";
import { TopikTerkini } from "@/components/home/topik-terkini";
import { CategorySectionLarge } from "@/components/home/category-section-large";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { getArticles, getTrendingArticles } from "@/lib/payload-queries";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight, Clock, Eye, BookmarkSimple, Fire, TrendUp } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function SectionHeader({ title, href, icon }: { title: string; href: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-brand pb-2.5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-[14px] font-bold uppercase tracking-wider">{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-foreground transition-colors link-underline">
        Lihat Semua <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

function ArticleListItem({ article }: { article: any }) {
  const categorySlug = typeof article.category === "object" ? article.category?.slug : "berita";
  const categoryName = typeof article.category === "object" ? article.category?.name : "";
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <Link
      href={`/${categorySlug}/${article.slug}`}
      className="group flex gap-3 py-2.5 first:pt-0 transition-colors"
    >
      <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden bg-gray-100 sm:w-24">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="96px"
          className="object-cover card-image-zoom"
        />
      </div>
      <div className="flex flex-1 min-w-0 flex-col justify-center">
        <span className="text-[9px] font-bold uppercase tracking-wider text-brand">{categoryName}</span>
        <h3 className="mt-0.5 text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {article.title}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="size-2.5" />
            {getTimeAgo(publishedDate)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-2.5" />
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
      className="group flex flex-col card-hover-lift"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover card-image-zoom"
        />
        <button className="absolute right-2 top-2 flex size-7 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-brand hover:scale-110">
          <BookmarkSimple className="size-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-1 pt-2.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-brand">{categoryName}</span>
        <h3 className="text-[14px] font-semibold leading-snug line-clamp-2 group-hover:text-brand transition-colors">{article.title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span>{authorName}</span>
          <span className="text-gray-300">|</span>
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

      <div className="py-5 sm:py-6">
        {/* Hero */}
        <AnimateOnScroll animation="fade-in">
          <HeroSection articles={articles} />
        </AnimateOnScroll>

        {/* Trending Tabs */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <TrendingTabs articles={trendingArticles} />
          </div>
        </AnimateOnScroll>

        {/* Live From Home */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <LiveFromHome articles={liveArticles} />
          </div>
        </AnimateOnScroll>

        {/* Topik Terkini */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="mt-8">
            <TopikTerkini topics={topics} />
          </div>
        </AnimateOnScroll>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Category Sections */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <AnimateOnScroll animation="slide-left">
            <div className="space-y-8">
              <CategorySectionLarge
                title="Bisnis"
                categorySlug="bisnis"
                articles={bisnisArticles}
              />
              <CategorySectionLarge
                title="Olahraga"
                categorySlug="olahraga"
                articles={olahragaArticles}
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-right" delay={200}>
            <div className="border-l border-gray-200 pl-5">
              <SectionHeader title="Top Stories" href="/pencarian" icon={<Fire className="size-4 text-brand" weight="fill" />} />
              <div className="mt-3 divide-y divide-gray-100">
                {topArticles.map((article: any) => (
                  <ArticleListItem key={article.id} article={article} />
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Pendidikan & Sosial */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <AnimateOnScroll animation="slide-left">
            <div className="space-y-8">
              <CategorySectionLarge
                title="Pendidikan"
                categorySlug="pendidikan"
                articles={pendidikanArticles}
              />
              <CategorySectionLarge
                title="Sosial & Budaya"
                categorySlug="sosial-dan-budaya"
                articles={sosialArticles}
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-right" delay={200}>
            <div className="border-l border-gray-200 pl-5">
              <SectionHeader title="Terbaru" href="/pencarian" icon={<TrendUp className="size-4 text-brand" />} />
              <div className="mt-3 divide-y divide-gray-100">
                {latestArticles.map((article: any) => (
                  <ArticleListItem key={article.id} article={article} />
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* More Articles Grid */}
        <AnimateOnScroll animation="fade-up">
          <section>
            <SectionHeader title="Berita Terkini" href="/pencarian" />
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {moreArticles.map((article: any, index: number) => (
                <AnimateOnScroll key={article.id} animation="scale-in" delay={(index * 100) as 0 | 100 | 200}>
                  <ArticleCardWide article={article} />
                </AnimateOnScroll>
              ))}
            </div>
          </section>
        </AnimateOnScroll>
      </div>
    </>
  );
}
