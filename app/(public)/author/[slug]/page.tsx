import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getArticlesByAuthor } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { EntityProfile } from "@/components/shared/entity-profile";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { title: "Penulis Tidak Ditemukan" };

  return createSeoMetadata({
    title: `${author.name} - ${author.role}`,
    description: author.bio,
    canonical: `${SITE_CONFIG.url}/author/${author.slug}`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const authorArticles = getArticlesByAuthor(author.slug);

  return (
    <EntityProfile
      kicker="Jurnalis & Redaksi"
      name={author.name}
      description={`${author.role} — ${author.bio}`}
      initial={author.name.charAt(0)}
      articles={authorArticles}
      listTitle={`Karya Tulis & Liputan Berita (${authorArticles.length})`}
    />
  );
}
