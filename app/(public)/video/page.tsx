import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/mock-data";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Play, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "Metrik Video - Portal Berita Video Terkini",
  description: "Tonton tayangan video liputan berita terkini, wawancara eksklusif, analisis situasi, dan laporan investigasi lapangan dari Metrik Media Indonesia.",
  canonical: `${SITE_CONFIG.url}/video`,
});

export default function VideoIndexPage() {
  const videoNews = articles.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-2 text-red-500 font-bold text-sm tracking-wider uppercase">
            <Play className="w-5 h-5 fill-current" />
            <span>Metrik Video HD</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Liputan & Tayangan Berita Video
          </h1>
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg">
            Sajikan berita langsung dari lokasi kejadian dalam format tayangan audio visual berorientasi fakta.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoNews.map((item) => (
            <Link
              key={item.id}
              href={`/video/${item.slug}`}
              className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-red-600/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-mono rounded">
                  03:45
                </span>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-500 uppercase">
                    {item.category.name}
                  </span>
                  <h2 className="font-bold text-white text-lg leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-semibold text-red-400 flex items-center gap-0.5">
                    Tonton <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
