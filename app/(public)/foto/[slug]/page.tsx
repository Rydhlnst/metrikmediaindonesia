import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/mock-data";
import { generateMetadata as createSeoMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Camera, Calendar, User } from "lucide-react";

interface PhotoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Foto Tidak Ditemukan" };

  return createSeoMetadata({
    title: `[FOTO] ${article.title}`,
    description: article.excerpt,
    canonical: `${SITE_CONFIG.url}/foto/${article.slug}`,
    ogImage: article.thumbnail,
    ogType: "article",
  });
}

export default async function PhotoDetailPage({ params }: PhotoPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const galleryImages = [
    { url: article.thumbnail, caption: "Suasana utama peninjauan lokasi kegiatan oleh pemangku kepentingan terkait di Jakarta." },
    { url: "https://picsum.photos/seed/foto-gallery-1/1200/800", caption: "Para delegasi dan jurnalis menyimak paparan materi laporan dengan saksama." },
    { url: "https://picsum.photos/seed/foto-gallery-2/1200/800", caption: "Antusiasme masyarakat saat menyaksikan langsung jalannya rangkaian kegiatan di lokasi." },
    { url: "https://picsum.photos/seed/foto-gallery-3/1200/800", caption: "Potret kebersamaan tim dan staf teknis yang bertugas mengawal kelancaran acara." },
  ];

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>{article.category.name} PHOTO STORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {article.title}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg">
            {article.excerpt}
          </p>
          <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Pewarta Foto: {article.author.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Gallery Image Slides / List */}
        <div className="space-y-12">
          {galleryImages.map((img, idx) => (
            <figure key={idx} className="space-y-3 bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800">
              <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-800">
                <Image
                  src={img.url}
                  alt={`Galeri foto ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-black/80 px-3 py-1 text-xs font-mono text-amber-400 rounded-full">
                  Foto {idx + 1} / {galleryImages.length}
                </span>
              </div>
              <figcaption className="text-sm text-slate-300 leading-relaxed pt-2">
                <strong className="text-amber-400 mr-2">MetrikFoto:</strong>
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </article>
  );
}
