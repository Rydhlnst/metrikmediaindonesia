import { redirect, notFound } from "next/navigation";
import { getArticleBySlug as getDbArticleBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface NewsRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsRedirectPage({ params }: NewsRedirectPageProps) {
  const { slug } = await params;

  const categorySlug = (await getDbArticleBySlug(slug))?.category?.slug;

  if (!categorySlug) {
    notFound();
  }

  redirect(`/${categorySlug}/${slug}`);
}
