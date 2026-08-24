import type { Metadata } from "next";
import { ArticleCard } from "@/components/article/article-card";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SITE_CONFIG } from "@/lib/constants";
import { getArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita Terkini",
  description: `Berita terbaru dan terhangat dari ${SITE_CONFIG.name}.`,
  alternates: { canonical: `${SITE_CONFIG.url}/latest` },
};

export default async function LatestPage() {
  const articles = await getArticles({ limit: 40 });
  return (
    <main className="container-editorial py-8 pb-20">
      <PublicPageHeader title="Berita Terkini" description="Perkembangan terbaru dari Indonesia dan dunia." />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => <ArticleCard key={article.id} article={article} showExcerpt showViews />)}
      </div>
    </main>
  );
}
