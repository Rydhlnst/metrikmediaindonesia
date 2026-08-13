import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Building, Clock, ArrowRight, UserCheck } from "lucide-react";

interface EntityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EntityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entityName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return createSeoMetadata({
    title: `Profil & Berita Entitas: ${entityName}`,
    description: `Arsip berita, rekam jejak, dan informasi terkini mengenai entitas ${entityName} di Metrik Media Indonesia.`,
    canonical: `${SITE_CONFIG.url}/entity/${slug}`,
  });
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { slug } = await params;
  const entityName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const entityArticles = articles.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Entity Profile Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shrink-0 shadow-md">
            {entityName.charAt(0)}
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2 text-purple-600 text-xs uppercase tracking-wider font-bold">
              <UserCheck className="w-4 h-4" />
              <span>Entitas Terdaftar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">{entityName}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Halaman resmi pemantauan pemberitaan dan keterhubungan entitas {entityName} dalam database jaringan media Metrik Media Indonesia.
            </p>
          </div>
        </div>

        {/* Entity Articles Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Berita Terkait {entityName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entityArticles.map((item) => (
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
                    <span className="text-xs font-bold text-purple-600 uppercase">
                      {item.category.name}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
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
                    <span className="font-semibold text-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
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
