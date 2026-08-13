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
import { PrimaryButton } from "@/components/shared/primary-button";
import { ContentCard } from "@/components/shared/content-card";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { LoadMoreArticles } from "@/components/home/load-more-articles";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Berita Terpercaya Indonesia`,
  description: SITE_CONFIG.description,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} - Berita Terpercaya Indonesia`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    type: "website",
  },
};

export const revalidate = 300;

export default async function HomePage() {
  let latestArticles: Awaited<ReturnType<typeof getArticles>> = [];
  let trendingArticles: Awaited<ReturnType<typeof getTrendingArticles>> = [];
  try {
    [latestArticles, trendingArticles] = await Promise.all([
      getArticles({ limit: 20 }),
      getTrendingArticles(10),
    ]);
  } catch {
    latestArticles = [];
    trendingArticles = [];
  }
  const articles = latestArticles;

  const heroArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      {/* Hero Story - 8/4 Grid */}
      {heroArticle && (
        <AnimateOnScroll animation="fade-in">
          <article className="mb-[80px] grid grid-cols-1 md:grid-cols-12 gap-[24px] items-start">
            <div className="md:col-span-8 order-2 md:order-1 mt-6 md:mt-0">
              <CategoryBadge className="block mb-3">
                {getCategoryName(heroArticle)}
              </CategoryBadge>
              <h1 className="font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-primary mb-4">
                <Link
                  href={`/${getCategorySlug(heroArticle)}/${heroArticle.slug}`}
                  className="hover:text-secondary transition-colors duration-300"
                >
                  {heroArticle.title}
                </Link>
              </h1>
              {heroArticle.excerpt && (
                <p className="font-body-md md:font-body-xl text-body-md md:text-body-xl text-on-surface-variant mb-6 pr-0 md:pr-12">
                  {heroArticle.excerpt}
                </p>
              )}
              <div className="flex items-center text-on-surface-variant font-label-md text-label-md flex-wrap gap-2">
                {getAuthorName(heroArticle) && (
                  <span className="uppercase">Oleh {getAuthorName(heroArticle)}</span>
                )}
                {getAuthorName(heroArticle) && (
                  <span className="border-l border-outline-variant h-4" />
                )}
                <span>{getTimeAgo(heroArticle.publishedAt || new Date().toISOString())}</span>
                <span className="border-l border-outline-variant h-4" />
                <span>{heroArticle.readingTime || 5} Menit Baca</span>
              </div>
            </div>
            <div className="md:col-span-4 order-1 md:order-2 w-full h-64 md:h-full min-h-[300px]">
              <Link href={`/${getCategorySlug(heroArticle)}/${heroArticle.slug}`}>
                <Image
                  src={getImageUrl(heroArticle.featuredImage)}
                  alt={heroArticle.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover border border-outline-variant"
                  priority
                />
              </Link>
            </div>
          </article>
        </AnimateOnScroll>
      )}

      {/* Divider */}
      <Divider className="mb-12" />

      {/* Secondary Stories - 3 Column Grid */}
      <section className="mb-[80px] grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        {secondaryArticles.map((article: any, index: number) => (
          <AnimateOnScroll key={article.id} animation="fade-up" delay={(index * 100) as 0 | 100 | 200}>
            <article className="flex flex-row md:flex-col gap-4 items-start group cursor-pointer">
              <div className="w-1/3 md:w-full aspect-square md:aspect-[4/3] flex-shrink-0 relative overflow-hidden">
                <Link href={`/${getCategorySlug(article)}/${article.slug}`}>
                  <Image
                    src={getImageUrl(article.featuredImage)}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover border border-outline-variant transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="w-2/3 md:w-full">
                <CategoryBadge className="block mb-2">
                  {getCategoryName(article)}
                </CategoryBadge>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary group-hover:text-secondary transition-colors duration-300 mb-2">
                  <Link href={`/${getCategorySlug(article)}/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {getTimeAgo(article.publishedAt || new Date().toISOString())}
                </span>
              </div>
            </article>
          </AnimateOnScroll>
        ))}
      </section>

      {/* More Articles Grid */}
      {articles.length > 4 && (
        <section className="mb-[80px]">
          <SectionHeading size="md" className="mb-6">
            Berita Terkini
          </SectionHeading>
          <LoadMoreArticles initialArticles={articles.slice(4)} />
        </section>
      )}

      {/* Newsletter Signup */}
      <ContentCard variant="low" className="mb-[80px] p-8 md:p-12 text-center max-w-3xl mx-auto">
        <SectionHeading size="md" className="mb-2">
          Intellectual Clarity, Delivered.
        </SectionHeading>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Briefing harian eksklusif untuk para pengambil keputusan. Tanpa bising, hanya substansi.
        </p>
        <NewsletterForm />
      </ContentCard>
    </div>
  );
}
