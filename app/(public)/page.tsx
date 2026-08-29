import Link from "next/link";
import { getArticles, getTrendingArticles } from "@/lib/queries";
import type { Article } from "@/lib/types";
import { MediaImage } from "@/components/shared/media-image";
import {
  getCategorySlug,
  getCategoryName,
  getAuthorName,
  getTimeAgo,
  formatViews,
} from "@/lib/article-helpers";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { LoadMoreArticles } from "@/components/home/load-more-articles";
import { AdvertisementSlot } from "@/components/advertising/advertisement-slot";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { Lightning, Play, TrendUp, Newspaper, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Media Berita Digital Profesional Indonesia`,
  description: SITE_CONFIG.description,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} - Media Berita Digital Profesional Indonesia`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    type: "website",
  },
};

export const revalidate = 60;

export default async function HomePage() {
  let latestArticles: Article[] = [];
  let trendingArticles: Article[] = [];
  let editorsChoiceArticles: Article[] = [];

  try {
    [latestArticles, trendingArticles, editorsChoiceArticles] = await Promise.all([
      getArticles({ limit: 20 }),
      getTrendingArticles(8),
      getArticles({ editorsChoice: true, limit: 4 }),
    ]);
  } catch (err) {
    console.error("HomePage fetch error:", err);
  }

  const articles = latestArticles;
  const trending = trendingArticles;

  const heroArticle = articles[0];
  const secondaryArticles = articles.slice(1, 5);
  const feedArticles = articles.slice(5);

  return (
    <div className="w-full bg-background">
      
      {/* ============================================================ */}
      {/* 1. HERO FEATURED SPOTLIGHT SECTION (Editorial Lead Story)    */}
      {/* ============================================================ */}
      <section className="container-editorial pt-6 pb-8">
        <AdvertisementSlot position="homepage" className="mb-6" />
        {heroArticle && (
          <article className="grid min-w-0 max-w-full grid-cols-1 items-stretch gap-6 overflow-hidden border border-black/10 bg-white rounded-none p-5 sm:p-7 md:p-8 transition-colors hover:border-black/25 lg:grid-cols-12 lg:gap-8">

              {/* Left Column: Headline Info (7 cols) */}
              <div className="min-w-0 max-w-full lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gold text-white rounded-none">
                      {getCategoryName(heroArticle) || "UTAMA"}
                    </span>
                    {heroArticle.isBreaking && (
                      <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-black text-white rounded-none flex items-center gap-1 border border-white/20">
                        <Lightning className="size-3 text-gold fill-current" /> BREAKING
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-foreground">
                    <Link
                      href={`/${getCategorySlug(heroArticle)}/${heroArticle.slug}`}
                      className="transition-colors hover:text-gold-deep"
                    >
                      {heroArticle.title}
                    </Link>
                  </h1>

                  {heroArticle.subtitle && (
                    <p className="text-sm sm:text-base font-semibold text-gold-deep italic">
                      {heroArticle.subtitle}
                    </p>
                  )}

                  {heroArticle.excerpt && (
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {heroArticle.excerpt}
                    </p>
                  )}
                </div>

                {/* Meta Author & Time */}
                <div className="pt-4 border-t border-black/10 flex items-center text-muted-foreground text-xs font-semibold gap-2.5 sm:gap-3 flex-wrap">
                  {getAuthorName(heroArticle) && (
                    <span className="uppercase text-foreground font-bold">Oleh {getAuthorName(heroArticle)}</span>
                  )}
                  <span>•</span>
                  <span>{getTimeAgo(heroArticle.publishedAt || new Date())}</span>
                  <span>•</span>
                  <span>{heroArticle.readingTime || 5} Menit Baca</span>
                  <span>•</span>
                  <span className="text-gold-deep font-bold">{formatViews(heroArticle.viewCount || 0)} Pembaca</span>
                </div>
              </div>

              {/* Right Column: Hero Image (5 cols) */}
              <div className="relative min-h-[220px] w-full min-w-0 max-w-full overflow-hidden border border-black/10 rounded-none bg-muted aspect-[16/10] lg:col-span-5 lg:h-full lg:min-h-0 lg:aspect-auto">
                <Link href={`/${getCategorySlug(heroArticle)}/${heroArticle.slug}`} className="absolute inset-0 block">
                  <MediaImage
                    src={heroArticle.thumbnail || heroArticle.featuredImage}
                    alt={heroArticle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="max-w-full object-cover transition-transform duration-300 hover:scale-105"
                    priority
                  />
                </Link>
              </div>

            </article>
          )}
        {!heroArticle && <div className="border border-black/10 bg-white p-8 text-sm text-muted-foreground">No published articles are available yet.</div>}
      </section>

      {editorsChoiceArticles.length > 0 && (
        <section className="container-editorial border-t border-black/10 py-8">
          <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Pilihan Editor</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">Kurasi Redaksi</span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {editorsChoiceArticles.map((article) => (
              <article key={article.id} className="border border-black/10 bg-white p-4 transition-colors hover:border-black/25">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">{getCategoryName(article)}</span>
                <h3 className="mt-2 line-clamp-3 font-serif text-lg font-bold leading-snug">
                  <Link href={`/${getCategorySlug(article)}/${article.slug}`} className="hover:text-gold-deep">{article.title}</Link>
                </h3>
                <p className="mt-3 text-xs text-muted-foreground">{getTimeAgo(article.publishedAt || new Date())}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. SECONDARY GRID + TRENDING SIDEBAR                          */}
      {/* ============================================================ */}
      <section className="container-editorial py-8 border-t border-black/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Newspaper className="size-4 text-gold-deep" weight="bold" />
                <span>Berita Terkini & Populer</span>
              </h2>
              <Link href="/pencarian" className="inline-flex items-center gap-1 text-xs font-bold uppercase text-foreground transition-colors hover:text-gold-deep group">
                <span>Lihat Semua Indeks</span>
                <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {secondaryArticles.map((article, index) => (
                <AnimateOnScroll key={article.id} animation="fade-up" delay={(index * 100) as 0 | 100 | 200}>
                  <article className="flex flex-col border border-black/10 bg-white rounded-none p-4 sm:p-5 hover:border-black/25 transition-colors group h-full justify-between">
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden border border-black/10 rounded-none mb-3 bg-muted">
                        <Link href={`/${getCategorySlug(article)}/${article.slug}`}>
                          <MediaImage
                            src={article.thumbnail || article.featuredImage}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                      </div>
                      <div className="mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-deep">
                          {getCategoryName(article)}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-foreground group-hover:text-gold-deep transition-colors line-clamp-2 mb-2 leading-snug">
                        <Link href={`/${getCategorySlug(article)}/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      {article.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-muted-foreground pt-3 border-t border-black/5 flex justify-between items-center">
                      <span>{getTimeAgo(article.publishedAt || new Date())}</span>
                      <span>{formatViews(article.viewCount || 0)} dibaca</span>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>

            {feedArticles.length > 0 && (
              <div className="pt-4">
                <LoadMoreArticles initialArticles={feedArticles} />
              </div>
            )}
          </div>

          {/* Sidebar Area (4 Cols) - Trending & Multimedia */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Trending Box */}
            <div className="border border-black/10 bg-white rounded-none p-5">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-black mb-4">
                <TrendUp className="size-5 text-gold-deep" weight="bold" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Paling Banyak Dibaca (#Trending)
                </h3>
              </div>

              <div className="space-y-4">
                {trending.map((item, idx) => (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-black/5 last:border-0 last:pb-0 group">
                    <span className="text-xl font-black text-gold w-6 shrink-0 leading-none">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gold-deep block mb-1">
                        {getCategoryName(item)}
                      </span>
                      <h4 className="text-xs font-bold leading-snug text-foreground group-hover:text-gold-deep transition-colors line-clamp-2">
                        <Link href={`/${getCategorySlug(item)}/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h4>
                      <span className="text-[10px] text-muted-foreground block mt-1">
                        {formatViews(item.viewCount || 0)} kali dibaca
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multimedia Spotlight Card (Dark Onyx Container) */}
            <div className="bg-[#111111] text-white p-5 border border-black/20 rounded-none space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Play className="size-4 text-gold fill-current" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Metrik Video HD
                  </h3>
                </div>
                <Link href="/video" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gold hover:underline group">
                  <span>Lihat Video</span>
                  <ArrowRight weight="bold" className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="relative aspect-video w-full bg-black border border-white/10 rounded-none flex items-center justify-center px-6 text-center">
                <p className="text-xs text-white/60">No published video is available.</p>
              </div>
            </div>

          </aside>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. DARK EDITORIAL SPOTLIGHT BANNER (Black & Gold)              */}
      {/* ============================================================ */}
      <section className="bg-[#111111] text-white py-14 border-y border-black/20">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold border border-gold/40 text-[10px] font-bold uppercase tracking-widest rounded-none">
              <span>METRIK MEDIA ESSENTIAL</span>
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight text-white">
              Intellectual Clarity & Independent Press Journalism
            </h2>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed">
              Dapatkan analisis ekonomi makro, liputan kebijakan publik, dan kabar terkini Indonesia langsung ke inbox Anda setiap hari. Tanpa spam, hanya informasi berdampak.
            </p>

            <div className="pt-4 max-w-xl mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
