import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/mock-data";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Play, Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = generateMetadata({
  title: "Metrik Video - Portal Berita Video & Tayangan Audio Visual",
  description: "Tonton tayangan video liputan berita terkini, wawancara eksklusif, analisis situasi, dan laporan investigasi lapangan dari Metrik Media Indonesia.",
  canonical: `${SITE_CONFIG.url}/video`,
});

export default function VideoIndexPage() {
  const videoNews = articles.slice(0, 6);

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <div className="space-y-8">
        
        {/* Standardized Reusable Header */}
        <PublicPageHeader
          title="Video"
          description="Sajikan berita langsung dari lokasi kejadian dalam format tayangan audio visual berorientasi fakta dan analisis mendalam."
        />

        {/* Section Header */}
        <SectionHeader
          title="TAYANGAN VIDEO PILIHAN REDAKSI"
          icon={<Play className="size-4 fill-current text-gold-deep" />}
        />

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoNews.map((item) => (
            <Link
              key={item.id}
              href={`/video/${item.slug}`}
              className="group rounded-none border border-black/10 bg-white hover:border-gold/50 transition-colors duration-200 flex flex-col"
            >
              <div className="relative aspect-video w-full bg-muted overflow-hidden">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="size-12 rounded-none bg-gold text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="size-5 fill-current ml-0.5" weight="fill" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 text-white text-[10px] font-bold">
                  03:45 HD
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
                    {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-bold text-gold-deep flex items-center gap-1 text-xs uppercase tracking-wider">
                    Tonton <ArrowRight className="size-3" weight="bold" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
