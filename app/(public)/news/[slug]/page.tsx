import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata, generateNewsArticleSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Calendar, Clock, Eye, Share2, Bookmark, User, Tag, MapPin, Building, Info, ExternalLink } from "lucide-react";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Berita Tidak Ditemukan" };

  return createSeoMetadata({
    title: article.title,
    description: article.excerpt,
    canonical: `${SITE_CONFIG.url}/news/${article.slug}`,
    ogImage: article.thumbnail,
    ogType: "article",
    publishedTime: article.publishedAt,
    authors: [article.author.name],
  });
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article, 4);

  const jsonLdNews = generateNewsArticleSchema({
    headline: article.title,
    description: article.excerpt,
    url: `${SITE_CONFIG.url}/news/${article.slug}`,
    imageUrl: article.thumbnail,
    datePublished: article.publishedAt,
    authorName: article.author.name,
    authorUrl: `${SITE_CONFIG.url}/author/${article.author.slug}`,
  });

  const jsonLdBreadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", url: SITE_CONFIG.url },
    { name: article.category.name, url: `${SITE_CONFIG.url}/category/${article.category.slug}` },
    { name: article.title, url: `${SITE_CONFIG.url}/news/${article.slug}` },
  ]);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNews) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <article className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
            <span>/</span>
            <Link href={`/category/${article.category.slug}`} className="hover:text-blue-600 font-medium text-blue-600">
              {article.category.name}
            </Link>
            <span>/</span>
            <span className="truncate text-slate-400 max-w-[200px] sm:max-w-xs">{article.title}</span>
          </nav>

          {/* Header & Title */}
          <header className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white rounded-full bg-blue-600">
                {article.category.name}
              </span>
              {article.isBreaking && (
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full bg-red-600 animate-pulse">
                  Breaking News
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {article.excerpt}
            </p>

            {/* Author Profile & Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <Link href={`/author/${article.author.slug}`} className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors">
                    {article.author.name}
                  </Link>
                  <p className="text-xs text-slate-500">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {article.readingTime} mnt baca
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-400" />
                  {article.viewCount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image & Caption */}
          <figure className="space-y-2">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-slate-200 dark:bg-slate-800">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
            <figcaption className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic text-center">
              Foto: Dokumentasi Metrik Media Indonesia / Liputan Khusus
            </figcaption>
          </figure>

          {/* Correction Notice Component */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
              <Info className="w-4 h-4" />
              <span>Catatan Editorial / Koreksi</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              Artikel ini telah diperiksa ulang sesuai Kode Etik Jurnalistik dan diperbarui untuk kelengkapan fakta terbaru.
            </p>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed">
            <p>
              <strong>METRIK MEDIA, Jakarta</strong> — {article.excerpt} Penguatan ekosistem informasi digital Indonesia terus menunjukkan tren positif dengan hadirnya berbagai pembaruan strategis dari sektor publik dan swasta.
            </p>
            <p>
              Menurut analis industri, langkah ini menorehkan pencapaian krusial bagi akselerasi pertumbuhan ekonomi dan literasi publik. Dalam konferensi pers yang digelar di Jakarta, para pemangku kepentingan menegaskan komitmen untuk menjaga integritas, transparansi, dan kredibilitas informasi.
            </p>
            <blockquote className="border-l-4 border-blue-600 pl-4 py-2 italic text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-r-lg">
              &quot;Integritas data dan kualitas informasi adalah pilar utama pembangunan masyarakat berpengetahuan di era modern.&quot;
            </blockquote>
            <p>
              Diharapkan ke depan, langkah-langkah konkret ini terus didukung secara berkelanjutan demi tercapainya dampak jangka panjang yang inklusif di seluruh penjuru wilayah Nusantara.
            </p>
          </div>

          {/* Source Management */}
          <section className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              Sumber & Referensi Berita
            </h3>
            <ul className="text-xs sm:text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Rilis Resmi Kementerian & Lembaga Negara (Official Statement)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Hasil Wawancara Langsung Tim Redaksi di Lapangan</span>
              </li>
            </ul>
          </section>

          {/* Tags, Topics, Locations, Entities */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/pencarian?q=${tag}`}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-full text-xs transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Related Topics & Entities */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <Link href={`/topic/${article.category.slug}`} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg font-medium">
                <Building className="w-3.5 h-3.5" /> Topik: {article.category.name} 2026
              </Link>
              <Link href={`/location/dki-jakarta`} className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg font-medium">
                <MapPin className="w-3.5 h-3.5" /> Wilayah: DKI Jakarta
              </Link>
              <Link href={`/entity/pemerintah-ri`} className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-lg font-medium">
                <User className="w-3.5 h-3.5" /> Entitas: Pemerintah RI
              </Link>
            </div>
          </div>

          {/* Author Box */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {article.author.name.charAt(0)}
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  {article.author.name}
                </h3>
                <p className="text-xs text-blue-600 font-medium">{article.author.role}</p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {article.author.bio}
              </p>
              <Link
                href={`/author/${article.author.slug}`}
                className="inline-block text-xs font-semibold text-blue-600 hover:underline"
              >
                Lihat Semua Artikel Oleh {article.author.name} &rarr;
              </Link>
            </div>
          </div>

          {/* Related Articles Section */}
          <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Berita Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((item) => (
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
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-blue-600 uppercase">
                        {item.category.name}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
