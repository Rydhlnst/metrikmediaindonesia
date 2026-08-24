import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTopicProfile } from "@/lib/public-taxonomy";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

export const dynamic = "force-dynamic";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getTopicProfile(slug);
  const topicTitle = profile?.name || slug.replace(/-/g, " ").toUpperCase();
  return createSeoMetadata({
    title: `Topik Terkait: ${topicTitle}`,
    description: `Kumpulan berita lengkap, analisis terpercaya, dan perkembangan terkini seputar isu ${topicTitle} di Metrik Media Indonesia.`,
    canonical: `${SITE_CONFIG.url}/topic/${slug}`,
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const profile = await getTopicProfile(slug);
  if (!profile) notFound();

  return (
    <EntityProfile
      kicker="Topik Khusus"
      name={profile.name}
      description={profile.description || `Liputan mendalam terkait ${profile.name}.`}
      initial={profile.name.charAt(0)}
      articles={profile.articles}
      listTitle="Berita Terkini dalam Topik Ini"
    />
  );
}
