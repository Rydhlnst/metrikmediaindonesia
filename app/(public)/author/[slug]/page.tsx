import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getArticlesByAuthor } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { User, Clock, ArrowRight, Globe } from "lucide-react";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { title: "Penulis Tidak Ditemukan" };

  return createSeoMetadata({
    title: `${author.name} - ${author.role}`,
    description: author.bio,
    canonical: `${SITE_CONFIG.url}/author/${author.slug}`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const authorArticles = getArticlesByAuthor(author.slug);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Author Profile Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {author.name.charAt(0)}
          </div>
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Jurnalis & Redaksi</span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{author.name}</h1>
              <p className="text-sm font-medium text-slate-500">{author.role}</p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl">
              {author.bio}
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-3 pt-2">
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors flex items-center gap-1 text-xs">
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Published Articles */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Karya Tulis & Liputan Berita ({authorArticles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorArticles.map((item) => (
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
