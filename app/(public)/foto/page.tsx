import { Metadata } from "next";
import Link from "next/link";
import { getArticlesWithMedia } from "@/lib/article-media";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { MediaImage } from "@/components/shared/media-image";
import { Camera, Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SectionHeader } from "@/components/shared/section-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = generateMetadata({
  title: "Metrik Foto - Galeri Foto Berita & Photo Story Jurnalistik",
  description: "Kumpulan cerita galeri foto berita pilihan, visual story, dan potret peristiwa jurnalistik terkini dari pewarta foto Metrik Media Indonesia.",
  canonical: `${SITE_CONFIG.url}/foto`,
});

export default async function PhotoIndexPage() {
  const photoNews = await getArticlesWithMedia("image", 6);

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8 space-y-8">

      {/* Standardized Reusable Header */}
      <PublicPageHeader
        title="Foto"
        description="Dokumentasi peristiwa terkini melalui momen visual berkualitas tinggi dari pewarta foto profesional Metrik Media Indonesia."
      />

      {/* Section Header */}
      <SectionHeader
        title="GALERI PHOTO STORY PILIHAN"
        icon={<Camera className="size-4" weight="bold" />}
      />

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photoNews.map((item) => (
          <Link
            key={item.id}
            href={`/foto/${item.slug}`}
            className="group rounded-none border border-black/10 bg-white hover:border-gold/50 transition-colors duration-200 flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
              <MediaImage
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 right-2.5 px-2 py-1 bg-black/85 text-white text-[10px] font-bold flex items-center gap-1">
                <Camera className="size-3 text-white" weight="fill" />
                12 Foto
              </span>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gold-deep uppercase tracking-wider">
                  {item.category.name}
                </span>
                <h2 className="font-bold text-foreground text-sm sm:text-base leading-snug group-hover:text-gold-deep transition-colors line-clamp-2">
                  {item.title}
                </h2>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="size-3.5 text-muted-foreground" />
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }) : "Unpublished"}
                </span>
                <span className="font-bold text-gold-deep flex items-center gap-1 text-xs uppercase tracking-wider">
                  Lihat Galeri <ArrowRight className="size-3" weight="bold" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {photoNews.length === 0 ? <p className="border border-black/10 bg-white p-6 text-sm text-muted-foreground">No published photo stories are available.</p> : null}

    </div>
  );
}
