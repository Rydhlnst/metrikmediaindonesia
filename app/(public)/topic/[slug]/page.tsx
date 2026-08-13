import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Hash, Clock, ArrowRight } from "lucide-react";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topicTitle = slug.replace(/-/g, " ").toUpperCase();
  return createSeoMetadata({
    title: `Topik Terkait: ${topicTitle}`,
    description: `Kumpulan berita lengkap, analisis terpercaya, dan perkembangan terkini seputar isu ${topicTitle} di Metrik Media Indonesia.`,
    canonical: `${SITE_CONFIG.url}/topic/${slug}`,
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topicTitle = slug.replace(/-/g, " ").toUpperCase();
  const topicArticles = articles.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Topic Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl p-8 text-white space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-blue-200 text-sm uppercase tracking-wider font-semibold">
            <Hash className="w-4 h-4" />
            <span>Topik Khusus</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold capitalize">{topicTitle}</h1>
          <p className="text-blue-100 max-w-2xl text-base sm:text-lg">
            Liputan mendalam, fakta aktual, dan arsip lengkap berita terverifikasi terkait isu {topicTitle}.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs sm:text-sm text-blue-200">
            <span>Total Berita: <strong>{topicArticles.length * 15} Artikel</strong></span>
            <span>•</span>
            <span>Diperbarui: <strong>Hari Ini</strong></span>
          </div>
        </div>

        {/* Articles Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Berita Terkini dalam Topik Ini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicArticles.map((item) => (
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
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      {item.category.name}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
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
                    <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
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
