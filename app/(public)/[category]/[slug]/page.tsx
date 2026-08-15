import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { getArticleBySlug, getArticles, getRelatedArticles, incrementViewCount } from "@/lib/queries";
import { ArticleCard } from "@/components/article/article-card";
import { SectionHeader } from "@/components/shared/section-header";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { CategoryBadge } from "@/components/shared/category-badge";
import { ContentCard } from "@/components/shared/content-card";
import { CopyLinkButton } from "@/components/article/copy-link-button";
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
import type { Article } from "@/lib/types";



interface ArticleDetailPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    return {};
  }
  if (!article) return {};
  const ogImage = article.thumbnail || SITE_CONFIG.ogImage;
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || "",
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt || "",
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: [article.author.name],
      images: [{ url: ogImage, width: 800, height: 450, alt: article.title }],
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || "",
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${article.category.slug}/${article.slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const all = await getArticles({ limit: 1000 });
    return all.map((a) => ({
      category: a.category.slug,
      slug: a.slug,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 300;

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { category, slug } = await params;
  let article: Article | null = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    article = null;
  }

  if (!article) notFound();

  void incrementViewCount(slug);

  let relatedArticles: Article[] = [];
  try {
    relatedArticles = await getRelatedArticles(article, 4);
  } catch {
    relatedArticles = [];
  }

  if (!relatedArticles || relatedArticles.length === 0) {
    try {
      const { getArticles } = await import("@/lib/queries");
      relatedArticles = await getArticles({ limit: 4 });
    } catch {
      relatedArticles = [];
    }
  }

  return (
    <>
      <ReadingProgress />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt || ""}
        image={article.thumbnail || ""}
        datePublished={article.publishedAt || ""}
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

      <div className="container-editorial py-8 pb-20 md:pb-8">
        {/* Back button */}
        <Link
          href={`/${article.category.slug}`}
          className="mb-6 inline-flex items-center gap-2 font-label-md text-label-md text-muted-foreground transition-colors hover:text-gold-deep"
        >
          <ArrowLeft className="size-4" />
          {article.category.name}
        </Link>

        <article className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            {/* Hero Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted border border-black/10">
              <Image
                src={article.thumbnail || "/placeholder.png"}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
                priority
              />
              {article.isBreaking && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-news-red px-3 py-1 text-sm font-semibold text-news-red-foreground">
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
                className="inline-block"
              >
                <CategoryBadge variant="pill">
                  {article.category.name}
                </CategoryBadge>
              </Link>
              <h1
                className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight"
              >
                {article.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>

              {/* Author + Meta */}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <AvatarAuthor name={article.author.name} size="sm" />
                  <div>
                    <span className="block text-sm font-semibold text-foreground">{article.author.name}</span>
                    <span className="text-xs text-muted-foreground">{article.author.role}</span>
                  </div>
                </div>
                <span className="text-black/20">|</span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarBlank className="size-4" />
                  {article.publishedAt ? format(new Date(article.publishedAt), "dd MMMM yyyy, HH:mm", { locale: id }) : "—"} WIB
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {article.readingTime || 5} menit baca
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="size-4" />
                  {article.viewCount.toLocaleString("id-ID")} dibaca
                </span>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose mt-8 max-w-none">
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <>
                  <p>{article.excerpt}</p>
                  <p className="text-muted-foreground italic">Konten artikel sedang diperbarui.</p>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag: any) => (
                <span key={tag} className="border border-black/10 bg-white px-3 py-1 text-sm text-muted-foreground cursor-pointer hover:border-gold/50 hover:text-foreground transition-colors">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <ContentCard variant="low" className="mt-8 flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShareNetwork className="size-5" />
                Bagikan
              </span>
              <div className="flex items-center gap-2">
                {(() => {
                  const shareUrl = encodeURIComponent(`${SITE_CONFIG.url}/${article.category.slug}/${article.slug}`);
                  const shareTitle = encodeURIComponent(article.title);
                  return (
                    <>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-9 items-center justify-center bg-[#1877F2] text-white transition-opacity hover:opacity-80"
                        aria-label="Bagikan ke Facebook"
                      >
                        <FacebookLogo className="size-4" weight="fill" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-9 items-center justify-center bg-[#1DA1F2] text-white transition-opacity hover:opacity-80"
                        aria-label="Bagikan ke Twitter"
                      >
                        <TwitterLogo className="size-4" weight="fill" />
                      </a>
                      <a
                        href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-9 items-center justify-center bg-[#25D366] text-white transition-opacity hover:opacity-80"
                        aria-label="Bagikan ke WhatsApp"
                      >
                        <span className="text-xs font-bold">WA</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-9 items-center justify-center bg-[#0A66C2] text-white transition-opacity hover:opacity-80"
                        aria-label="Bagikan ke LinkedIn"
                      >
                        <LinkedinLogo className="size-4" weight="fill" />
                      </a>
                      <CopyLinkButton url={`${SITE_CONFIG.url}/${article.category.slug}/${article.slug}`} />
                    </>
                  );
                })()}
              </div>
            </ContentCard>

            {/* Author Card */}
            <ContentCard className="mt-8">
              <div className="flex items-start gap-4">
                <AvatarAuthor name={article.author.name} size="lg" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Penulis</span>
                  <h3 className="mt-0.5 text-base font-bold text-foreground">{article.author.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{article.author.bio}</p>
                </div>
              </div>
            </ContentCard>
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
