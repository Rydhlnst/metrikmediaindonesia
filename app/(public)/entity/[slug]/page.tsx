import { Metadata } from "next";
import { articles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

interface EntityPageProps {
  params: Promise<{ slug: string }>;
}

function toTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: EntityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entityName = toTitle(slug);
  return createSeoMetadata({
    title: `Profil & Berita Entitas: ${entityName}`,
    description: `Arsip berita, rekam jejak, dan informasi terkini mengenai entitas ${entityName} di Metrik Media Indonesia.`,
    canonical: `${SITE_CONFIG.url}/entity/${slug}`,
  });
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { slug } = await params;
  const entityName = toTitle(slug);
  const entityArticles = articles.slice(0, 6);

  return (
    <EntityProfile
      kicker="Entitas Terdaftar"
      name={entityName}
      description={`Halaman resmi pemantauan pemberitaan dan keterhubungan entitas ${entityName} dalam database jaringan media Metrik Media Indonesia.`}
      initial={entityName.charAt(0)}
      articles={entityArticles}
      listTitle={`Berita Terkait ${entityName}`}
    />
  );
}
