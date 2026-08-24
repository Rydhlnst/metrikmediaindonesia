import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getArticles } from "@/lib/queries";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

export const dynamic = "force-dynamic";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Penulis Tidak Ditemukan" };

  return createSeoMetadata({
    title: `${author.name} - ${author.role || "Kontributor Berita"}`,
    description: author.bio || `Profil dan liputan berita oleh ${author.name} di Metrik Media Indonesia.`,
    canonical: `${SITE_CONFIG.url}/author/${author.slug}`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const authorArticles = await getArticles({
    authorSlug: author.slug,
    limit: 20,
  });

  return (
    <EntityProfile
      kicker="Jurnalis & Penulis Redaksi"
      name={author.name}
      description={`${author.role || "Kontributor"} ${author.bio ? `— ${author.bio}` : ""}`}
      initial={author.name.charAt(0).toUpperCase()}
      articles={authorArticles}
      listTitle={`Karya Tulis & Liputan Berita (${authorArticles.length})`}
    />
  );
}
