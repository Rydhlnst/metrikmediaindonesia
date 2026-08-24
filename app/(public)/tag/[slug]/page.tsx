import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/article-card";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SITE_CONFIG } from "@/lib/constants";
import { getArticles, getTags } from "@/lib/queries";

interface TagPageProps { params: Promise<{ slug: string }> }

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = (await getTags()).find((item) => item.slug === slug);
  if (!tag) return {};
  return {
    title: `Tag ${tag.name}`,
    description: `Berita terbaru dengan tag ${tag.name}.`,
    alternates: { canonical: `${SITE_CONFIG.url}/tag/${tag.slug}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = (await getTags()).find((item) => item.slug === slug);
  if (!tag) notFound();
  const articles = await getArticles({ tagSlug: slug, limit: 40 });
  return (
    <main className="container-editorial py-8 pb-20">
      <PublicPageHeader title={`#${tag.name}`} description={`Berita yang terkait dengan ${tag.name}.`} />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => <ArticleCard key={article.id} article={article} showExcerpt showViews />)}
      </div>
      {!articles.length ? <p className="mt-8 text-sm text-muted-foreground">Belum ada artikel pada tag ini.</p> : null}
    </main>
  );
}
