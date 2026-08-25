import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { ArticleImage } from "@/components/shared/article-image";
import { getArticleBySlug, getArticles, getRelatedArticles, getTrendingArticles, getCategories, incrementViewCount } from "@/lib/queries";
import { ArticleCard } from "@/components/article/article-card";
import { SectionHeader } from "@/components/shared/section-header";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import { CategoryBadge } from "@/components/shared/category-badge";
import { ContentCard } from "@/components/shared/content-card";
import { sanitizeRichHtml } from "@/lib/content-sanitizer";
import { CopyLinkButton } from "@/components/article/copy-link-button";
import { ReadingHistoryTracker } from "@/components/article/reading-history-tracker";
import { BookmarkButton } from "@/components/article/bookmark-button";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ReadingProgress } from "@/components/shared/animate-on-scroll";
import { AdvertisementSlot } from "@/components/advertising/advertisement-slot";
import {
  Clock,
  Eye,
  CalendarBlank,
  ShareNetwork,
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  Lightning,
  ArrowLeft,
  TrendUp,
  Newspaper,
  Tag,
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
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
  const { slug } = await params;
  let article: Article | null = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    article = null;
  }

  if (!article) notFound();

  const requestHeaders = await headers();
  const requestCookies = await cookies();
  void incrementViewCount(slug, {
    ip: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || undefined,
    userAgent: requestHeaders.get("user-agent") || undefined,
    sessionToken: requestCookies.get("better-auth.session_token")?.value,
  });

  const [relatedRes, latestRes, trendingRes, categoriesRes] = await Promise.allSettled([
    getRelatedArticles(article, 5),
    getArticles({ limit: 8 }),
    getTrendingArticles(5),
    getCategories(),
  ]);

  const rawRelated = relatedRes.status === "fulfilled" ? relatedRes.value : [];
  const rawLatest = latestRes.status === "fulfilled" ? latestRes.value : [];
  const rawTrending = trendingRes.status === "fulfilled" ? trendingRes.value : [];
  const allCategories = categoriesRes.status === "fulfilled" ? categoriesRes.value : [];

  // Exclude current article from suggestions
  const relatedArticles = rawRelated
    .filter((a) => a.id !== article.id && a.slug !== article.slug)
    .slice(0, 4);

  const recentArticles = rawLatest
    .filter((a) => a.id !== article.id && a.slug !== article.slug)
    .slice(0, 5);

  const trendingArticles = rawTrending
    .filter((a) => a.id !== article.id && a.slug !== article.slug)
    .slice(0, 5);

  return (
    <>
      <ReadingHistoryTracker articleId={article.id} />
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
        <AdvertisementSlot position="article_top" className="mb-6" />
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
              <ArticleImage
                src={article.thumbnail}
                alt={article.title}
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
                <div dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(article.content) || "" }} />
              ) : (
                <>
                  <p>{article.excerpt}</p>
                  <p className="text-muted-foreground italic">Konten artikel sedang diperbarui.</p>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
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
                      <BookmarkButton articleId={article.id} />
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
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 self-start">
            {/* Berita Terkait */}
            {relatedArticles.length > 0 && (
              <div>
                <SectionHeader
                  title="Berita Terkait"
                  icon={<Newspaper className="size-4" weight="bold" />}
                />
                <div className="mt-4 divide-y divide-black/10">
                  {relatedArticles.map((related) => (
                    <ArticleCard key={related.id} article={related} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}

            {/* Berita Terkini / Recent Posts */}
            {recentArticles.length > 0 && (
              <div>
                <SectionHeader
                  title="Berita Terkini"
                  icon={<Lightning className="size-4" weight="bold" />}
                />
                <div className="mt-4 divide-y divide-black/10">
                  {recentArticles.map((recent) => (
                    <ArticleCard key={recent.id} article={recent} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}

            {/* Terpopuler */}
            {trendingArticles.length > 0 && (
              <div>
                <SectionHeader
                  title="Terpopuler"
                  icon={<TrendUp className="size-4" weight="bold" />}
                />
                <div className="mt-4 divide-y divide-black/10">
                  {trendingArticles.map((trending, idx) => (
                    <ArticleCard
                      key={trending.id}
                      article={trending}
                      variant="horizontal"
                      rank={idx}
                      showViews
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Jelajahi Kategori */}
            {allCategories.length > 0 && (
              <div className="border border-black/10 bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="size-4 text-gold-deep" weight="bold" />
                  <h3 className="font-serif text-base font-bold text-foreground">
                    Jelajahi Kategori
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/${cat.slug}`}
                      className="border border-black/10 bg-surface-container px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-gold-deep hover:text-white hover:border-gold-deep"
                    >
                      {cat.name}
                    </Link>
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
