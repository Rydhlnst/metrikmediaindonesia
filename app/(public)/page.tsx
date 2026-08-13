import Link from "next/link";
import Image from "next/image";
import { getArticles, getTrendingArticles } from "@/lib/queries";
import { getImageUrl } from "@/lib/utils";
import {
  getCategorySlug,
  getCategoryName,
  getAuthorName,
  getTimeAgo,
  formatViews,
} from "@/lib/article-helpers";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { CategoryBadge } from "@/components/shared/category-badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { Divider } from "@/components/shared/divider";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { LoadMoreArticles } from "@/components/home/load-more-articles";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { Flame, Lightning, Play, Camera, TrendUp, Newspaper } from "@phosphor-icons/react/dist/ssr";

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

export const revalidate = 60; // 1 minute revalidate for fresh news updates

const FALLBACK_ARTICLES = [
  {
    id: 101,
    title: "Pemerintah Resmikan Peta Jalan Pertumbuhan Ekonomi 8 Persen 2026-2030",
    slug: "pemerintah-resmikan-peta-jalan-pertumbuhan-ekonomi-8-persen",
    subtitle: "Fokus utama pada hilirisasi industri, energi hijau, dan digitalisasi UMKM.",
    excerpt: "Pemerintah meluncurkan target pertumbuhan ekonomi nasional sebesar 8 persen yang didukung efisiensi birokrasi dan investasi strategis.",
    thumbnail: "https://picsum.photos/seed/ekonomi/800/450",
    category: { name: "Nasional", slug: "nasional", color: "#1D4ED8" },
    author: { name: "Ahmad Rizky Pratama", slug: "ahmad-rizky-pratama" },
    publishedAt: new Date().toISOString(),
    readingTime: 5,
    viewCount: 24500,
    featured: true,
    breaking: true,
  },
  {
    id: 102,
    title: "Dinamika Koalisi Parlemen dan Pembahasan RUU Pemilu 2029 Mulai Bergulir",
    slug: "dinamika-koalisi-parlemen-dan-pembahasan-ruu-pemilu-2029",
    subtitle: "Fraksi-fraksi di DPR mulai menyepakati poin krusial ambang batas parlemen.",
    excerpt: "Pembahasan RUU Pemilu 2029 resmi dimulai di Senayan dengan fokus penyempurnaan sistem pemungutan suara elektronik.",
    thumbnail: "https://picsum.photos/seed/politik/800/450",
    category: { name: "Politik", slug: "politik", color: "#B91C1C" },
    author: { name: "Siti Nurhaliza", slug: "siti-nurhaliza" },
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    readingTime: 4,
    viewCount: 18900,
  },
  {
    id: 103,
    title: "Pasar Saham Indonesia Catat Rekor Tertinggi Sepanjang Sejarah Tembus 8.000",
    slug: "pasar-saham-indonesia-catat-rekor-tertinggi-sepanjang-sejarah",
    subtitle: "IHSG bergerak menguat didorong aksi beli bersih investor asing.",
    excerpt: "Indeks Harga Saham Gabungan (IHSG) menembus level psikologis 8.000 didorong optimisme pertumbuhan ekonomi domestik.",
    thumbnail: "https://picsum.photos/seed/saham/800/450",
    category: { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
    author: { name: "Ahmad Rizky Pratama", slug: "ahmad-rizky-pratama" },
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    readingTime: 5,
    viewCount: 31200,
  },
  {
    id: 104,
    title: "Kedaulatan Data dan Kebijakan Pengembangan Artificial Intelligence Indonesia",
    slug: "kedaulatan-data-dan-kebijakan-pengembangan-ai-indonesia",
    subtitle: "Pemerintah merilis standar etika dan keamanan data nasional untuk adopsi AI.",
    excerpt: "Pedoman nasional penggunaan AI dirilis guna memastikan perlindungan data pribadi konsumen dan etika algoritma.",
    thumbnail: "https://picsum.photos/seed/tekno/800/450",
    category: { name: "Teknologi", slug: "teknologi", color: "#DC2626" },
    author: { name: "Ahmad Rizky Pratama", slug: "ahmad-rizky-pratama" },
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    readingTime: 6,
    viewCount: 19800,
  },
  {
    id: 105,
    title: "Timnas Garuda Muda Tampil Gemilang di Kualifikasi Piala Dunia U-20",
    slug: "timnas-garuda-muda-tampil-gemilang-di-kualifikasi-piala-dunia-u-20",
    subtitle: "Kemenangan dramatis 2-1 menegaskan kesiapan tim nasional di kancah dunia.",
    excerpt: "Garuda Muda mengamankan tiket fase gugur setelah menaklukkan tim kuat dalam laga ketat di Stadion GBK.",
    thumbnail: "https://picsum.photos/seed/timnas/800/450",
    category: { name: "Sports", slug: "sports", color: "#059669" },
    author: { name: "Reza Firmansyah", slug: "reza-firmansyah" },
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    readingTime: 5,
    viewCount: 34000,
  },
  {
    id: 106,
    title: "Pemerintah Daerah Jawa Barat Luncurkan Pusat Inovasi Pelayanan Publik Digital",
    slug: "pemerintah-daerah-jawa-barat-luncurkan-pusat-inovasi-pelayanan-publik",
    subtitle: "Layanan perizinan dan administrasi warga kini dapat diakses dalam satu aplikasi terpadu.",
    excerpt: "Inovasi sistem digitalisasi Pemprov Jabar memangkas waktu pengurusan izin usaha menjadi hanya beberapa menit.",
    thumbnail: "https://picsum.photos/seed/jabar/800/450",
    category: { name: "Daerah", slug: "daerah", color: "#D97706" },
    author: { name: "Siti Nurhaliza", slug: "siti-nurhaliza" },
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    readingTime: 4,
    viewCount: 16700,
  },
];

export default async function HomePage() {
  let latestArticles: any[] = [];
  let trendingArticles: any[] = [];

  try {
    [latestArticles, trendingArticles] = await Promise.all([
      getArticles({ limit: 20 }),
      getTrendingArticles(8),
    ]);
  } catch (err) {
    console.error("HomePage fetch error:", err);
  }

  // Fallback to FALLBACK_ARTICLES if database is empty/initializing
  const articles = latestArticles.length > 0 ? latestArticles : FALLBACK_ARTICLES;
  const trending = trendingArticles.length > 0 ? trendingArticles : articles.slice(0, 5);

  const heroArticle = articles[0];
  const secondaryArticles = articles.slice(1, 5);
  const feedArticles = articles.slice(5);

  return (
    <div className="w-full bg-background">
      
      {/* ============================================================ */}
      {/* 1. HERO FEATURED SPOTLIGHT SECTION                            */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6 pb-12">
        {heroArticle && (
          <AnimateOnScroll animation="fade-in">
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-outline-variant/80 bg-surface-container-lowest p-5 md:p-8 shadow-xs">
              
              {/* Left Column: Headline Info */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white rounded-none">
                      {getCategoryName(heroArticle) || "UTAMA"}
                    </span>
                    {heroArticle.breaking && (
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-red-600 text-white rounded-none flex items-center gap-1 animate-pulse">
                        <Lightning className="size-3" /> BREAKING
                      </span>
                    )}
                  </div>

                  <h1 className="font-headline-lg-mobile md:font-headline-xl text-2xl md:text-4xl font-serif leading-tight text-on-surface mb-3">
                    <Link
                      href={`/${getCategorySlug(heroArticle)}/${heroArticle.slug}`}
                      className="hover:text-amber-700 transition-colors"
                    >
                      {heroArticle.title}
                    </Link>
                  </h1>

                  {heroArticle.subtitle && (
                    <p className="text-sm md:text-base font-semibold text-amber-900/80 dark:text-amber-300 mb-3 italic">
                      {heroArticle.subtitle}
                    </p>
                  )}

                  {heroArticle.excerpt && (
                    <p className="text-xs md:text-sm leading-relaxed text-on-surface-variant line-clamp-3">
                      {heroArticle.excerpt}
                    </p>
                  )}
                </div>

                {/* Meta Author & Time */}
                <div className="pt-4 border-t border-outline-variant/60 flex items-center text-on-surface-variant text-xs font-semibold gap-3 flex-wrap">
                  {getAuthorName(heroArticle) && (
                    <span className="uppercase text-on-surface">Oleh {getAuthorName(heroArticle)}</span>
                  )}
                  <span>•</span>
                  <span>{getTimeAgo(heroArticle.publishedAt || new Date())}</span>
                  <span>•</span>
                  <span>{heroArticle.readingTime || 5} Menit Baca</span>
                  <span>•</span>
                  <span className="text-amber-700 font-bold">{formatViews(heroArticle.viewCount || 0)} Pembaca</span>
                </div>
              </div>

              {/* Right Column: Hero Image */}
              <div className="lg:col-span-5 relative min-h-[260px] md:min-h-[360px] overflow-hidden border border-outline-variant">
                <Link href={`/${getCategorySlug(heroArticle)}/${heroArticle.slug}`} className="block size-full relative">
                  <Image
                    src={getImageUrl(heroArticle.thumbnail || heroArticle.featuredImage)}
                    alt={heroArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                </Link>
              </div>

            </article>
          </AnimateOnScroll>
        )}
      </section>

      {/* ============================================================ */}
      {/* 2. SECONDARY GRID + TRENDING SIDEBAR                          */}
      {/* ============================================================ */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 border-t border-outline-variant">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b-2 border-primary pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Newspaper className="size-4 text-amber-600" />
                <span>Berita Terkini & Populer</span>
              </h2>
              <Link href="/pencarian" className="text-xs font-bold uppercase text-amber-700 hover:underline">
                Lihat Semua Indeks &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {secondaryArticles.map((article: any, index: number) => (
                <AnimateOnScroll key={article.id} animation="fade-up" delay={(index * 100) as 0 | 100 | 200}>
                  <article className="flex flex-col border border-outline-variant bg-surface-container-lowest p-4 hover:border-primary/50 transition-all group h-full justify-between">
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden border border-outline-variant mb-3">
                        <Link href={`/${getCategorySlug(article)}/${article.slug}`}>
                          <Image
                            src={getImageUrl(article.thumbnail || article.featuredImage)}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      </div>
                      <div className="mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                          {getCategoryName(article)}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-amber-700 transition-colors line-clamp-2 mb-2 leading-snug">
                        <Link href={`/${getCategorySlug(article)}/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      {article.excerpt && (
                        <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-on-surface-variant/80 pt-2 border-t border-outline-variant/40 flex justify-between items-center">
                      <span>{getTimeAgo(article.publishedAt || new Date())}</span>
                      <span>{formatViews(article.viewCount || 0)} views</span>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>

            {feedArticles.length > 0 && (
              <div className="pt-6">
                <LoadMoreArticles initialArticles={feedArticles} />
              </div>
            )}
          </div>

          {/* Sidebar Area (4 Cols) - Trending & Editorial Pick */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Trending Box with Contrast Header */}
            <div className="border border-outline-variant bg-surface-container-low p-5">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-amber-600 mb-4">
                <TrendUp className="size-5 text-amber-600" weight="bold" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Paling Banyak Dibaca (#Trending)
                </h3>
              </div>

              <div className="space-y-4">
                {trending.map((item: any, idx: number) => (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-outline-variant/60 last:border-0 last:pb-0 group">
                    <span className="text-2xl font-black text-amber-600/80 w-6 shrink-0 leading-none">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                        {getCategoryName(item)}
                      </span>
                      <h4 className="text-xs font-bold leading-snug text-on-surface group-hover:text-amber-700 transition-colors line-clamp-2">
                        <Link href={`/${getCategorySlug(item)}/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h4>
                      <span className="text-[10px] text-on-surface-variant block mt-1">
                        {formatViews(item.viewCount || 0)} kali dibaca
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multimedia Spotlight Card (Dark Onyx Container) */}
            <div className="bg-[#18181B] text-white p-6 border border-zinc-800 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-zinc-700 pb-3">
                <div className="flex items-center gap-2">
                  <Play className="size-4 text-red-500 fill-current" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Metrik Video HD
                  </h3>
                </div>
                <Link href="/video" className="text-[10px] font-bold uppercase text-amber-400 hover:underline">
                  Lihat Video &rarr;
                </Link>
              </div>

              <div className="relative aspect-video w-full bg-zinc-900 border border-zinc-700 group overflow-hidden cursor-pointer">
                <Image
                  src="https://picsum.photos/seed/videodark/800/450"
                  alt="Video Liputan Khusus"
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="p-3 bg-red-600 text-white rounded-none shadow-lg group-hover:bg-red-700 transition-colors">
                    <Play className="size-6 fill-current" />
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold leading-snug text-zinc-100 hover:text-amber-400 transition-colors">
                <Link href="/video">
                  Potensi Masa Depan Inovasi Teknologi & Broadband Indonesia 2026-2030
                </Link>
              </h4>
            </div>

          </aside>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. DARK EDITORIAL SPOTLIGHT BANNER                             */}
      {/* ============================================================ */}
      <section className="bg-[#141414] text-white py-14 border-y border-zinc-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600/20 text-amber-400 border border-amber-600/40 text-[10px] font-bold uppercase tracking-widest">
              <span>METRIK MEDIA ESSENTIAL</span>
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight text-white">
              Intellectual Clarity & Independent Press Journalism
            </h2>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
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
