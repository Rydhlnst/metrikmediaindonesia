import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { getArticleBySlug, getRelatedArticles, articles } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ArticleCard } from "@/components/article/article-card";
import { SectionHeader } from "@/components/shared/section-header";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
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
      <div className="container-responsive py-5">
        <Breadcrumb
          items={[
            { label: article.category.name, href: `/${article.category.slug}` },
            { label: article.title },
          ]}
        />
        <article className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <header>
              {article.isBreaking && (
                <div className="mb-2.5 inline-flex items-center gap-1.5 bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Lightning className="size-3" weight="fill" />
                  Breaking News
                </div>
              )}
              <Link
                href={`/${article.category.slug}`}
                className="mb-1.5 inline-block text-[10px] font-bold uppercase tracking-wider text-brand"
              >
                {article.category.name}
              </Link>
              <h1 className="text-2xl font-bold leading-tight sm:text-[28px] sm:leading-[1.25]" style={{ fontFamily: "var(--font-playfair)" }}>
                {article.title}
              </h1>
              <p className="mt-2.5 text-[15px] leading-relaxed text-gray-600">
                {article.excerpt}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 border-b border-t border-gray-200 py-2.5 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <AvatarAuthor name={article.author.name} size="sm" />
                  <div>
                    <span className="block text-[11px] font-semibold text-foreground">{article.author.name}</span>
                    <span className="text-[9px] text-gray-400">{article.author.role}</span>
                  </div>
                </div>
                <span className="hidden sm:block text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <CalendarBlank className="size-3" />
                  {format(new Date(article.publishedAt), "dd MMMM yyyy, HH:mm", { locale: id })} WIB
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {article.readingTime} menit baca
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {article.viewCount.toLocaleString("id-ID")} views
                </span>
              </div>
            </header>
            <div className="relative mt-4 aspect-[16/9] overflow-hidden bg-gray-100">
              <Image src={article.thumbnail} alt={article.title} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" priority />
            </div>
            <div className="prose prose-neutral mt-6 max-w-none text-[15px] leading-[1.8]">
              <p>{article.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <h2>Latar Belakang</h2>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span key={tag} className="border border-gray-200 px-2.5 py-1 text-[10px] text-gray-500 transition-colors hover:border-brand hover:text-brand cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-5">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                <ShareNetwork className="size-4" />
                Bagikan
              </span>
              <div className="flex items-center gap-1.5">
                <button className="flex size-7 items-center justify-center bg-[#1877F2] text-white transition-opacity hover:opacity-80">
                  <FacebookLogo className="size-3.5" weight="fill" />
                </button>
                <button className="flex size-7 items-center justify-center bg-[#1DA1F2] text-white transition-opacity hover:opacity-80">
                  <TwitterLogo className="size-3.5" weight="fill" />
                </button>
                <button className="flex size-7 items-center justify-center bg-[#25D366] text-white transition-opacity hover:opacity-80">
                  <span className="text-[9px] font-bold">WA</span>
                </button>
                <button className="flex size-7 items-center justify-center bg-[#0A66C2] text-white transition-opacity hover:opacity-80">
                  <LinkedinLogo className="size-3.5" weight="fill" />
                </button>
                <button className="flex size-7 items-center justify-center border border-gray-200 text-gray-500 transition-colors hover:text-foreground">
                  <LinkIcon className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-5 border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <AvatarAuthor name={article.author.name} size="lg" />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Penulis</span>
                  <h3 className="text-[13px] font-bold">{article.author.name}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{article.author.bio}</p>
                </div>
              </div>
            </div>
          </div>
          <aside className="flex flex-col gap-5">
            <NewsletterSignup />
            {relatedArticles.length > 0 && (
              <div>
                <SectionHeader title="Berita Terkait" />
                <div className="mt-3 divide-y divide-gray-100">
                  {relatedArticles.map((related) => (
                    <ArticleCard key={related.id} article={related} className="py-2.5 first:pt-0" />
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
