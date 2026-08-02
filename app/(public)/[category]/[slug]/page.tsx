import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { getArticleBySlug, getRelatedArticles, articles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article/article-card";
import { SectionHeader } from "@/components/shared/section-header";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ReadingProgress } from "@/components/shared/animate-on-scroll";
import {
  Clock,
  Eye,
  CalendarBlank,
  ShareNetwork,
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  Link as LinkIcon,
  Lightning,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Metadata } from "next";

interface ArticleDetailPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [{ url: article.thumbnail, width: 800, height: 450, alt: article.title }],
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.thumbnail],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${article.category.slug}/${article.slug}`,
    },
  };
}

export function generateStaticParams() {
  return articles.map((a) => ({
    category: a.category.slug,
    slug: a.slug,
  }));
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { category, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.category.slug !== category) notFound();

  const relatedArticles = getRelatedArticles(article, 4);

  return (
    <>
      <ReadingProgress />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        image={article.thumbnail}
        datePublished={article.publishedAt}
        author={article.author.name}
        slug={article.slug}
        category={article.category.name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: SITE_CONFIG.url },
          { name: article.category.name, url: `${SITE_CONFIG.url}/${article.category.slug}` },
          { name: article.title, url: `${SITE_CONFIG.url}/${article.category.slug}/${article.slug}` },
        ]}
      />

      <div className="py-6">
        {/* Back button */}
        <Link
          href={`/${article.category.slug}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {article.category.name}
        </Link>

        <article className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            {/* Hero Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
                priority
              />
              {article.isBreaking && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-news-red px-3 py-1 text-sm font-semibold text-white">
                    <Lightning className="size-3.5" weight="fill" />
                    Breaking News
                  </span>
                </div>
              )}
            </div>

            {/* Article Header */}
            <header className="mt-6">
              <Link
                href={`/${article.category.slug}`}
                className="inline-block rounded-full bg-brand/15 px-3 py-1 text-sm font-semibold text-brand-text"
              >
                {article.category.name}
              </Link>
              <h1
                className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-[34px] lg:leading-[1.2]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {article.title}
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-gray-500">
                {article.excerpt}
              </p>

              {/* Author + Meta */}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <AvatarAuthor name={article.author.name} size="sm" />
                  <div>
                    <span className="block text-sm font-semibold text-foreground">{article.author.name}</span>
                    <span className="text-xs text-gray-400">{article.author.role}</span>
                  </div>
                </div>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CalendarBlank className="size-4" />
                  {format(new Date(article.publishedAt), "dd MMMM yyyy, HH:mm", { locale: id })} WIB
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="size-4" />
                  {article.readingTime} menit baca
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Eye className="size-4" />
                  {article.viewCount.toLocaleString("id-ID")} views
                </span>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-neutral mt-8 max-w-none">
              <p>{article.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <h2>Latar Belakang</h2>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="pill pill-inactive text-sm cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <ShareNetwork className="size-5" />
                Bagikan
              </span>
              <div className="flex items-center gap-2">
                <button className="flex size-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-80">
                  <FacebookLogo className="size-4" weight="fill" />
                </button>
                <button className="flex size-9 items-center justify-center rounded-full bg-[#1DA1F2] text-white transition-opacity hover:opacity-80">
                  <TwitterLogo className="size-4" weight="fill" />
                </button>
                <button className="flex size-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-80">
                  <span className="text-xs font-bold">WA</span>
                </button>
                <button className="flex size-9 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-opacity hover:opacity-80">
                  <LinkedinLogo className="size-4" weight="fill" />
                </button>
                <button className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:text-foreground">
                  <LinkIcon className="size-4" />
                </button>
              </div>
            </div>

            {/* Author Card */}
            <div className="mt-8 rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-start gap-4">
                <AvatarAuthor name={article.author.name} size="lg" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Penulis</span>
                  <h3 className="mt-0.5 text-base font-bold">{article.author.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{article.author.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            {relatedArticles.length > 0 && (
              <div>
                <SectionHeader title="Berita Terkait" />
                <div className="mt-4 space-y-1">
                  {relatedArticles.map((related) => (
                    <ArticleCard key={related.id} article={related} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </article>
      </div>
    </>
  );
}
