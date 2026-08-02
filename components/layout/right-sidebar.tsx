import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { getCategorySlug, getCategoryName, getTimeAgo } from "@/lib/article-helpers";
import { Clock, BookmarkSimple } from "@phosphor-icons/react/dist/ssr";

const categories = [
  { name: "Bisnis", slug: "bisnis" },
  { name: "Politik", slug: "politik" },
  { name: "Olahraga", slug: "olahraga" },
  { name: "Teknologi", slug: "teknologi" },
  { name: "Pendidikan", slug: "pendidikan" },
  { name: "Kesehatan", slug: "kesehatan" },
  { name: "Hukum", slug: "hukum" },
  { name: "Sosial & Budaya", slug: "sosial-dan-budaya" },
];

interface RightSidebarProps {
  articles: any[];
}

export function RightSidebar({ articles }: RightSidebarProps) {
  const curatedArticles = articles.slice(0, 3);

  return (
    <aside className="hidden xl:block w-[300px] shrink-0 space-y-6">
      {/* Curated Picks */}
      <div className="rounded-2xl bg-white p-4 shadow-card">
        <h3 className="mb-4 text-base font-bold">Curated Picks</h3>
        <div className="space-y-4">
          {curatedArticles.map((article: any) => (
            <Link
              key={article.id}
              href={`/${getCategorySlug(article)}/${article.slug}`}
              className="group flex gap-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  fill
                  sizes="64px"
                  className="object-cover card-image-zoom"
                />
              </div>
              <div className="flex flex-1 min-w-0 flex-col justify-center gap-0.5">
                <span className="text-xs font-semibold text-brand-text">{getCategoryName(article)}</span>
                <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand-text transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>{getTimeAgo(article.publishedAt || new Date().toISOString())}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-2xl bg-white p-4 shadow-card">
        <h3 className="mb-4 text-base font-bold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="pill pill-inactive text-sm"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <Link
          href="/pencarian"
          className="mt-3 block text-sm font-medium text-brand-text hover:underline"
        >
          View More Categories
        </Link>
      </div>

      {/* Newsletter */}
      <div className="rounded-2xl bg-brand/10 p-4">
        <h3 className="text-base font-bold">Newsletter</h3>
        <p className="mt-1 text-sm text-gray-500">
          Dapatkan berita terkini langsung ke email Anda.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="email"
            placeholder="Email Anda"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-amber-400">
            Kirim
          </button>
        </div>
      </div>
    </aside>
  );
}
