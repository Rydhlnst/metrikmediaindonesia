"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useCallback } from "react";
import { searchArticles, trendingArticles, articles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article/article-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CATEGORIES } from "@/lib/constants";
import {
  MagnifyingGlass,
  TrendUp,
  Clock,
  ArrowRight,
  X,
  ChartLineUp,
  Trophy,
  GraduationCap,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const popularSearches = [
  "Ekonomi Indonesia",
  "Timnas U-20",
  "Kurikulum Merdeka",
  "Startup AI",
  "Asian Games 2026",
  "Budaya Nusantara",
];

function SearchBar({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/pencarian?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSubmit} className="relative">
      <MagnifyingGlass className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari berita, topik, atau kata kunci..."
        className="h-12 w-full border border-border bg-muted/50 pl-12 pr-12 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-muted focus:ring-2 focus:ring-foreground/10"
        autoFocus
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            router.push("/pencarian");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      )}
    </form>
  );
}

function SearchRecommendations() {
  return (
    <div className="space-y-8">
      {/* Popular Searches */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pencarian Populer
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/pencarian?q=${encodeURIComponent(term)}`}
              className="inline-flex items-center gap-1.5 border border-border px-4 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              <TrendUp className="size-3.5 text-muted-foreground" />
              {term}
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Telusuri Berdasarkan Kategori
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex items-center gap-3 border border-border p-4 transition-all hover:border-foreground/10 hover:bg-muted/50"
            >
              <CategoryIcon slug={cat.slug} color={cat.color} />
              <span className="text-sm font-medium transition-colors group-hover:text-foreground">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Articles */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Berita Trending
          </h2>
          <Link
            href="/"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-3">
          {trendingArticles.slice(0, 5).map((article, index) => (
            <Link
              key={article.id}
              href={`/${article.category.slug}/${article.slug}`}
              className="group flex items-start gap-4 p-3 transition-colors hover:bg-muted/50"
            >
              <span className="flex size-8 shrink-0 items-center justify-center bg-muted text-sm font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-foreground">
                  {article.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className="px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: article.category.color + "15",
                      color: article.category.color,
                    }}
                  >
                    {article.category.name}
                  </span>
                  <Clock className="size-3" />
                  <span>{article.readingTime} menit</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Berita Terkini
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const results = query ? searchArticles(query) : [];

  return (
    <div className="py-6">
      <Breadcrumb items={[{ label: "Pencarian" }, { label: query || "" }]} />

      <div className="mt-6">
        <SearchBar initialQuery={query} />
      </div>

      {query ? (
        <div className="mt-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Hasil Pencarian
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {results.length} hasil untuk &ldquo;
            <span className="font-medium text-foreground">{query}</span>&rdquo;
          </p>

          {results.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <MagnifyingGlass className="mx-auto mb-4 size-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">Tidak ada hasil ditemukan</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Coba kata kunci lain atau periksa ejaan Anda
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Temukan Berita
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cari berita terkini dari berbagai kategori
          </p>
          <div className="mt-6">
            <SearchRecommendations />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}

function CategoryIcon({ slug, color }: { slug: string; color: string }) {
  const iconProps = { className: "size-5", style: { color } };
  
  switch (slug) {
    case "bisnis":
      return <ChartLineUp {...iconProps} />;
    case "olahraga":
      return <Trophy {...iconProps} />;
    case "pendidikan":
      return <GraduationCap {...iconProps} />;
    case "sosial-dan-budaya":
      return <Buildings {...iconProps} />;
    default:
      return <ChartLineUp {...iconProps} />;
  }
}
