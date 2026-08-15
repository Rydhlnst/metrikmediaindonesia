import { Metadata } from "next";
import { articles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topicTitle = slug.replace(/-/g, " ").toUpperCase();
  return createSeoMetadata({
    title: `Topik Terkait: ${topicTitle}`,
    description: `Kumpulan berita lengkap, analisis terpercaya, dan perkembangan terkini seputar isu ${topicTitle} di Metrik Media Indonesia.`,
    canonical: `${SITE_CONFIG.url}/topic/${slug}`,
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topicTitle = slug.replace(/-/g, " ").toUpperCase();
  const topicArticles = articles.slice(0, 6);

  return (
    <EntityProfile
      kicker="Topik Khusus"
      name={topicTitle}
      description={`Liputan mendalam, fakta aktual, dan arsip lengkap berita terverifikasi terkait isu ${topicTitle}.`}
      initial={topicTitle.charAt(0)}
      articles={topicArticles}
      listTitle="Berita Terkini dalam Topik Ini"
    />
  );
}
