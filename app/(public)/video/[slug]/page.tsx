import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Calendar, Clock, Eye, Share2, Play, User } from "lucide-react";

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Video Tidak Ditemukan" };

  return createSeoMetadata({
    title: `[VIDEO] ${article.title}`,
    description: article.excerpt,
    canonical: `${SITE_CONFIG.url}/video/${article.slug}`,
    ogImage: article.thumbnail,
    ogType: "article",
  });
}

export default async function VideoDetailPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article, 3);

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Category & Title */}
        <div className="space-y-3">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
            {article.category.name} VIDEO
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
            {article.title}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            {article.excerpt}
          </p>
        </div>

        {/* Video Player Mockup Container */}
        <div className="relative aspect-video w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group">
          <video
            className="w-full h-full object-cover"
            controls
            poster={article.thumbnail}
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Browser Anda tidak mendukung player video HTML5.
          </video>
        </div>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-sm text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-white">{article.author.name}</p>
              <p className="text-xs text-slate-500">{article.author.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-500" />
              {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-slate-500" />
              {article.viewCount.toLocaleString("id-ID")} penonton
            </span>
          </div>
        </div>

        {/* Video Description */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
          <h2 className="text-xl font-bold text-white">Deskripsi & Ringkasan Video</h2>
          <p>
            Tayangan video eksklusif dari Metrik Media Indonesia mengenai perkembangan {article.title}. Laporan disusun langsung dari wawancara narasumber dan bukti verifikasi teknis di lapangan.
          </p>
        </div>

      </div>
    </article>
  );
}
