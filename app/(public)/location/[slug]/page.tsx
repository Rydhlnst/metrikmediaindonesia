import { Metadata } from "next";
import { articles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

function toTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locationName = toTitle(slug);
  return createSeoMetadata({
    title: `Berita Daerah ${locationName} Terkini`,
    description: `Kabar berita terkini dari wilayah ${locationName}, meliput kebijakan daerah, peristiwa penting, ekonomi regional, dan perkembangan masyarakat lokal.`,
    canonical: `${SITE_CONFIG.url}/location/${slug}`,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const locationName = toTitle(slug);
  const locationArticles = articles.slice(0, 6);

  return (
    <EntityProfile
      kicker="Berita Daerah & Regional"
      name={locationName}
      description={`Pemberitaan regional komprehensif langsung dari jurnalis dan koresponden lapangan di ${locationName}.`}
      initial={locationName.charAt(0)}
      articles={locationArticles}
      listTitle={`Kabar Terbaru dari ${locationName}`}
    />
  );
}
