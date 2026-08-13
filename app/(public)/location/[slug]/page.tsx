import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locationName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return createSeoMetadata({
    title: `Berita Daerah ${locationName} Terkini`,
    description: `Kabar berita terkini dari wilayah ${locationName}, meliput kebijakan daerah, peristiwa penting, ekonomi regional, dan perkembangan masyarakat lokal.`,
    canonical: `${SITE_CONFIG.url}/location/${slug}`,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const locationName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const locationArticles = articles.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 rounded-3xl p-8 text-white space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-300 text-sm uppercase tracking-wider font-semibold">
            <MapPin className="w-4 h-4" />
            <span>Berita Daerah & Regional</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold">{locationName}</h1>
          <p className="text-emerald-100 max-w-2xl text-base sm:text-lg">
            Pemberitaan regional komprehensif langsung dari jurnalis dan koresponden lapangan di {locationName}.
          </p>
        </div>

        {/* Regional News Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Kabar Terbaru dari {locationName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationArticles.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase">
                      {locationName}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Baca <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
