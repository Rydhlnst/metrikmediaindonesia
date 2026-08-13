import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/mock-data";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Camera, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "Metrik Foto - Galeri Foto Berita & Jurnalistik",
  description: "Kumpulan cerita galeri foto berita pilihan, visual story, dan potret peristiwa jurnalistik terkini dari pewarta foto Metrik Media Indonesia.",
  canonical: `${SITE_CONFIG.url}/foto`,
});

export default function PhotoIndexPage() {
  const photoNews = articles.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm tracking-wider uppercase">
            <Camera className="w-5 h-5" />
            <span>Photo Story & Galeri Visual</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Galeri Foto Jurnalistik
          </h1>
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg">
            Dokumentasi peristiwa terkini melalui momen visual berkualitas tinggi dari pewarta foto profesional.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoNews.map((item) => (
            <Link
              key={item.id}
              href={`/foto/${item.slug}`}
              className="group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-4/3 w-full bg-slate-800 overflow-hidden">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-3 py-1 bg-black/75 backdrop-blur text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  12 Foto
                </span>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    {item.category.name}
                  </span>
                  <h2 className="font-bold text-white text-lg leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
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
                  <span className="font-semibold text-amber-400 flex items-center gap-0.5">
                    Lihat Galeri <ArrowRight className="w-3 h-3" />
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
