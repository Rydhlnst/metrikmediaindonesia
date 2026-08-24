import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/queries";
import { getArticleMedia } from "@/lib/article-media";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { CalendarBlank, Eye, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Video Tidak Ditemukan | Metrik Media" };

  return createSeoMetadata({
    title: `[VIDEO] ${article.title} | Metrik Media Indonesia`,
    description: article.excerpt || undefined,
    canonical: `${SITE_CONFIG.url}/video/${article.slug}`,
    ogImage: article.thumbnail || undefined,
    ogType: "article",
  });
}

export default async function VideoDetailPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [video] = await getArticleMedia(article.id, "video");
  if (!video) notFound();

  return (
    <article className="container-editorial py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/video" className="hover:text-gold-deep transition-colors flex items-center gap-1 font-bold">
            <ArrowLeft className="size-3.5" /> Kembali ke Galeri Video
          </Link>
          <span>/</span>
          <span className="text-gold-deep font-bold uppercase">{article.category.name}</span>
        </div>

        {/* Video Card Container */}
        <div className="rounded-none border border-black/10 bg-white p-6 sm:p-8 space-y-6">
          {/* Category & Title */}
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 bg-gold text-white text-[10px] font-bold uppercase tracking-wider">
              {article.category.name} VIDEO HD
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {article.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* HTML5 Video Player Container */}
          <div className="relative aspect-video w-full bg-black rounded-none overflow-hidden border border-black/10">
            {video ? <video
              className="w-full h-full object-cover"
              controls
              poster={article.thumbnail || undefined}
            >
              <source src={video.url} />
              Browser Anda tidak mendukung pemutar video HTML5.
            </video> : <p className="flex h-full items-center justify-center p-6 text-sm text-white">No video media has been published for this article.</p>}
          </div>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-black/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-none bg-gold/10 border border-black/10 flex items-center justify-center text-gold-deep font-bold text-xs">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-foreground">{article.author.name}</p>
                <p className="text-[10px] text-gold-deep font-semibold uppercase">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <CalendarBlank className="size-3.5 text-muted-foreground" />
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) : "Unpublished"}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="size-3.5 text-muted-foreground" />
                {article.viewCount.toLocaleString("id-ID")} tayangan
              </span>
            </div>
          </div>

          {/* Video Description */}
          <div className="space-y-2 text-foreground text-sm leading-relaxed">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deskripsi & Catatan Redaksi</h2>
            <p>
              Tayangan video liputan eksklusif dari tim redaksi Metrik Media Indonesia mengenai <strong>{article.title}</strong>. Materi disajikan secara lugas berdasarkan fakta dan keterangan resmi narasumber terkait.
            </p>
          </div>
        </div>

      </div>
    </article>
  );
}
