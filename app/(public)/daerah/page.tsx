import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/mock-data";
import { generateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { MapPin, Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = generateMetadata({
  title: "Kabar Daerah - Liputan Berita Nusantara & Regional Terkini",
  description: "Ikuti perkembangan dan liputan peristiwa dari berbagai penjuru daerah di Indonesia: DKI Jakarta, Jawa Barat, Jawa Timur, IKN Nusantara, Sumatera, Bali, hingga Papua.",
  canonical: `${SITE_CONFIG.url}/daerah`,
});

const REGIONS = [
  { id: "all", name: "Semua Daerah" },
  { id: "dki-jakarta", name: "DKI Jakarta" },
  { id: "ikn", name: "IKN Nusantara" },
  { id: "jawa-barat", name: "Jawa Barat" },
  { id: "jawa-timur", name: "Jawa Timur" },
  { id: "sumatera-utara", name: "Sumatera Utara" },
  { id: "bali", name: "Bali & Nusa Tenggara" },
  { id: "sulawesi", name: "Sulawesi" },
  { id: "papua", name: "Papua" },
];

export default function DaerahIndexPage() {
  const regionalNews = articles;

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8 space-y-8">

      {/* Standardized Reusable Header */}
      <PublicPageHeader
        title="Daerah"
        description="Menyajikan dinamika pembangunan, kebijakan pemerintah daerah, ekonomi lokal, serta kearifan sosial budaya dari seluruh pelosok Nusantara."
      >
        {/* Regional Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-hide">
          {REGIONS.map((reg, idx) => (
            <span
              key={reg.id}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border rounded-none ${
                idx === 0
                  ? "bg-black text-white border-black"
                  : "bg-white text-foreground border-black/10 hover:border-gold/50"
              }`}
            >
              {reg.name}
            </span>
          ))}
        </div>
      </PublicPageHeader>

      {/* Section Header */}
      <SectionHeader title="LIPUTAN TERKINI NUSANTARA" />

      {/* Regional Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regionalNews.map((item) => (
          <Link
            key={item.id}
            href={`/${item.category.slug}/${item.slug}`}
            className="group rounded-none border border-black/10 bg-white hover:border-gold/50 transition-colors duration-200 flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/85 text-white text-[10px] font-bold flex items-center gap-1">
                <MapPin className="size-3 text-white" weight="fill" />
                Regional
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
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
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
                  Baca <ArrowRight className="size-3" weight="bold" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
