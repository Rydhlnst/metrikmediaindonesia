import { redirect, notFound } from "next/navigation";
import { getArticleBySlug as getDbArticleBySlug } from "@/lib/queries";
import { getArticleBySlug as getMockArticleBySlug } from "@/lib/mock-data";

interface NewsRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsRedirectPage({ params }: NewsRedirectPageProps) {
  const { slug } = await params;

  let categorySlug: string | undefined;

  try {
    const dbArticle = await getDbArticleBySlug(slug);
    categorySlug = dbArticle?.category?.slug;
  } catch {
    // DB unavailable — fall back to mock data below
  }

  if (!categorySlug) {
    categorySlug = getMockArticleBySlug(slug)?.category?.slug;
  }

  if (!categorySlug) {
    notFound();
  }

  redirect(`/${categorySlug}/${slug}`);
}
