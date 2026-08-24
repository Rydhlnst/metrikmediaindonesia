import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocationProfile } from "@/lib/public-taxonomy";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

export const dynamic = "force-dynamic";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

function toTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getLocationProfile(slug);
  const locationName = profile?.name || toTitle(slug);
  return createSeoMetadata({
    title: `Berita Daerah ${locationName} Terkini`,
    description: `Kabar berita terkini dari wilayah ${locationName}, meliput kebijakan daerah, peristiwa penting, ekonomi regional, dan perkembangan masyarakat lokal.`,
    canonical: `${SITE_CONFIG.url}/location/${slug}`,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const profile = await getLocationProfile(slug);
  if (!profile) notFound();

  return (
    <EntityProfile
      kicker="Berita Daerah & Regional"
      name={profile.name}
      description={profile.description || `Pemberitaan regional dari ${profile.name}.`}
      initial={profile.name.charAt(0)}
      articles={profile.articles}
      listTitle={`Kabar Terbaru dari ${profile.name}`}
    />
  );
}
