import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { getArticles, getCategoryBySlug } from "@/lib/queries";
import { WebsiteJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { CategoryBadge } from "@/components/shared/category-badge";
import { ArticleImage } from "@/components/shared/article-image";
import type { Metadata } from "next";

import { PublicPageHeader } from "@/components/shared/public-page-header";

export const dynamic = "force-dynamic";
import { Clock, Lightning } from "@phosphor-icons/react/dist/ssr";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  let cat;
  try {
    cat = await getCategoryBySlug(category);
  } catch {
    return {};
  }
  if (!cat) return {};
  const name = cat.name;
  return {
    title: `Berita ${name} Terkini | Metrik Media Indonesia`,
    description: `Berita terbaru seputar ${name} di ${SITE_CONFIG.name}. Ikuti perkembangan terkini ${name.toLowerCase()} Indonesia dan dunia.`,
    openGraph: {
      title: `Berita ${name} Terkini | ${SITE_CONFIG.shortName}`,
      description: `Berita terbaru seputar ${name} di ${SITE_CONFIG.name}.`,
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `Berita ${name} Terkini | ${SITE_CONFIG.shortName}`,
      description: `Berita terbaru seputar ${name} di ${SITE_CONFIG.name}.`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  let cat;
  try {
    cat = await getCategoryBySlug(category);
  } catch {
    notFound();
  }
  if (!cat) notFound();

  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles({ categorySlug: category, limit: 20 });
  } catch {
    articles = [];
  }
  const featured = articles[0];
  const secondary = articles.slice(1, 4);
  const latest = articles.slice(4, 7);

  return (
    <>
      <WebsiteJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: SITE_CONFIG.url },
          { name: cat.name, url: `${SITE_CONFIG.url}/${cat.slug}` },
        ]}
      />

      {/* Main Content Canvas */}
      <section className="container-editorial py-8 pb-20 md:pb-8">
        {/* Standardized Reusable Category Header */}
        <PublicPageHeader
          title={cat.name}
          description={`Berita terbaru seputar ${cat.name.toLowerCase()} di Indonesia dan dunia.`}
        />

        {/* Featured Story (Asymmetric Layout) */}
        {featured && (
          <article className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
            <div className="md:col-span-8 group cursor-pointer">
              <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden bg-muted">
                <ArticleImage
                  src={featured.thumbnail}
                  alt={featured.title}
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 border border-black/10">
                  <CategoryBadge>
                    {cat.name}
                  </CategoryBadge>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <CategoryBadge variant="bordered">
                  {cat.name}
                </CategoryBadge>
                <div className="flex items-center gap-1 text-muted-foreground font-label-md text-label-md">
                  <Clock className="size-3.5" weight="bold" />
                  <span>{featured.readingTime} MENIT BACA</span>
                </div>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4 group-hover:text-gold-deep transition-colors duration-300">
                <Link href={`/${category}/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                {featured.excerpt}
              </p>
              <div className="mt-auto pt-6 border-t border-black/10">
                <p className="font-label-md text-label-md text-gold-deep">
                  OLEH {(featured.author?.name ?? "Redaksi").toUpperCase()}
                </p>
              </div>
            </div>
          </article>
        )}

        {/* Editorial Grid (Secondary Stories) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 gap-y-12">
          {/* Story 1 */}
          {secondary[0] && (
            <article className="md:col-span-4 group cursor-pointer flex flex-col">
              <div className="w-full aspect-[3/4] mb-4 overflow-hidden bg-muted">
                <ArticleImage
                  src={secondary[0].thumbnail}
                  alt={secondary[0].title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <CategoryBadge variant="bordered">
                  {cat.name}
                </CategoryBadge>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-gold-deep transition-colors duration-300">
                <Link href={`/${category}/${secondary[0].slug}`}>
                  {secondary[0].title}
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4 flex-grow">
                {secondary[0].excerpt}
              </p>
              <div className="mt-auto pt-4 border-t border-black/10">
                <p className="font-label-md text-label-md text-gold-deep">
                  OLEH {(secondary[0].author?.name ?? "Redaksi").toUpperCase()}
                </p>
              </div>
            </article>
          )}

          {/* Story 2 */}
          {secondary[1] && (
            <article className="md:col-span-4 group cursor-pointer flex flex-col">
              <div className="w-full aspect-square mb-4 overflow-hidden bg-muted">
                <ArticleImage
                  src={secondary[1].thumbnail}
                  alt={secondary[1].title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <CategoryBadge variant="bordered" className="text-muted-foreground border-muted-foreground">
                  {cat.name}
                </CategoryBadge>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-gold-deep transition-colors duration-300">
                <Link href={`/${category}/${secondary[1].slug}`}>
                  {secondary[1].title}
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4 flex-grow">
                {secondary[1].excerpt}
              </p>
              <div className="mt-auto pt-4 border-t border-black/10">
                <p className="font-label-md text-label-md text-gold-deep">
                  OLEH {(secondary[1].author?.name ?? "Redaksi").toUpperCase()}
                </p>
              </div>
            </article>
          )}

          {/* Text-Only Stories List */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-4">
              <Lightning className="size-4 text-gold-deep" weight="bold" />
              <h4 className="font-label-md text-label-md text-foreground uppercase tracking-widest">
                Terbaru dari Kanal Ini
              </h4>
            </div>
            {latest.map((article) => (
              <article key={article.id} className="group cursor-pointer border-b border-black/10 pb-6 last:border-b-0 last:pb-0">
                <CategoryBadge variant="bordered" className="mb-2 border-muted-foreground text-muted-foreground">
                  {cat.name}
                </CategoryBadge>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-gold-deep transition-colors duration-300">
                  <Link href={`/${category}/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {article.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
