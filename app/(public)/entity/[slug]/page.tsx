import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntityProfile } from "@/lib/public-taxonomy";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

export const dynamic = "force-dynamic";

interface EntityPageProps {
  params: Promise<{ slug: string }>;
}

function toTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: EntityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getEntityProfile(slug);
  const entityName = profile?.name || toTitle(slug);
  return createSeoMetadata({
    title: `Profil & Berita Entitas: ${entityName}`,
    description: `Arsip berita, rekam jejak, dan informasi terkini mengenai entitas ${entityName} di Metrik Media Indonesia.`,
    canonical: `${SITE_CONFIG.url}/entity/${slug}`,
  });
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { slug } = await params;
  const profile = await getEntityProfile(slug);
  if (!profile) notFound();

  return (
    <EntityProfile
      kicker="Entitas Terdaftar"
      name={profile.name}
      description={profile.description || `Pemberitaan terkait ${profile.name}.`}
      initial={profile.name.charAt(0)}
      articles={profile.articles}
      listTitle={`Berita Terkait ${profile.name}`}
    />
  );
}
