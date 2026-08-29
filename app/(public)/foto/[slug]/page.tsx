import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/queries";
import { getArticleMedia } from "@/lib/article-media";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { MediaImage } from "@/components/shared/media-image";
import { CalendarBlank, User, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

interface PhotoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Foto Tidak Ditemukan | Metrik Media" };

  return createSeoMetadata({
    title: `[FOTO] ${article.title} | Metrik Media Indonesia`,
    description: article.excerpt || undefined,
    canonical: `${SITE_CONFIG.url}/foto/${article.slug}`,
    ogImage: article.thumbnail || undefined,
    ogType: "article",
  });
}

export default async function PhotoDetailPage({ params }: PhotoPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const galleryImages = await getArticleMedia(article.id, "image");
  if (!galleryImages.length) notFound();

  return (
    <article className="container-editorial py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/foto" className="hover:text-gold-deep transition-colors flex items-center gap-1 font-bold">
            <ArrowLeft className="size-3.5" /> Kembali ke Galeri Foto
          </Link>
          <span>/</span>
          <span className="text-gold-deep font-bold uppercase">{article.category.name}</span>
        </div>

        {/* Header Container */}
        <div className="rounded-none border border-black/10 bg-white p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 bg-gold text-white text-[10px] font-bold uppercase tracking-wider">
              {article.category.name} PHOTO STORY
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {article.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-black/10">
              <span className="flex items-center gap-1 font-bold text-foreground">
                <User className="size-3.5 text-gold-deep" weight="bold" />
                Pewarta Foto: {article.author.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CalendarBlank className="size-3.5 text-muted-foreground" />
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) : "Unpublished"}
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Image Slides */}
        <div className="space-y-6">
          {galleryImages.map((img, idx) => (
            <figure key={idx} className="rounded-none border border-black/10 bg-white p-4 sm:p-6 space-y-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <MediaImage
                  src={img.url}
                  alt={img.altText || `Galeri foto ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/85 px-2.5 py-1 text-[10px] font-bold text-white">
                  Foto {idx + 1} / {galleryImages.length}
                </span>
              </div>
              <figcaption className="text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
                <strong className="text-gold-deep mr-2 uppercase tracking-wider text-xs">MetrikFoto:</strong>
                {img.caption || article.excerpt || article.title}
              </figcaption>
            </figure>
          ))}
        </div>
        {!galleryImages.length ? <p className="border border-black/10 bg-white p-6 text-sm text-muted-foreground">No gallery media has been published for this article.</p> : null}

      </div>
    </article>
  );
}
