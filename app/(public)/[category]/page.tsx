import { notFound } from "next/navigation";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { getArticlesByCategory } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article/article-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { WebsiteJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `Berita ${cat.name} Terkini`,
    description: `Berita terbaru seputar ${cat.name} di ${SITE_CONFIG.name}. Ikuti perkembangan terkini ${cat.name.toLowerCase()} Indonesia dan dunia.`,
    openGraph: {
      title: `Berita ${cat.name} Terkini | ${SITE_CONFIG.shortName}`,
      description: `Berita terbaru seputar ${cat.name} di ${SITE_CONFIG.name}.`,
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `Berita ${cat.name} Terkini | ${SITE_CONFIG.shortName}`,
      description: `Berita terbaru seputar ${cat.name} di ${SITE_CONFIG.name}.`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${category}`,
    },
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const articles = getArticlesByCategory(category);

  return (
    <>
      <WebsiteJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: SITE_CONFIG.url },
          { name: cat.name, url: `${SITE_CONFIG.url}/${cat.slug}` },
        ]}
      />
      <div className="py-5">
        <Breadcrumb items={[{ label: cat.name }]} />
        <div className="mt-4">
          <div className="border-b-2 border-brand pb-2.5">
            <h1 className="text-[18px] font-bold uppercase tracking-wider">{cat.name}</h1>
          </div>
        </div>
        {articles.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-[13px]">Belum ada berita di kategori ini.</p>
          </div>
        )}
      </div>
    </>
  );
}
