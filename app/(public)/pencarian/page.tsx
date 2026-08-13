"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { ArticleCard } from "@/components/article/article-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CategoryBadge } from "@/components/shared/category-badge";
import { SectionHeading } from "@/components/shared/section-heading";
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
  CircleNotch,
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
      <MagnifyingGlass className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari berita, topik, atau kata kunci..."
        className="h-12 w-full border border-outline-variant bg-surface-container-low pl-12 pr-12 text-base outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary focus:bg-background"
        autoFocus
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            router.push("/pencarian");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
        >
          <X className="size-5" />
        </button>
      )}
    </form>
  );
}

function SearchRecommendations() {
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/articles?sort=-viewCount&limit=5").then((r) => r.json()),
      fetch("/api/articles?limit=6").then((r) => r.json()),
    ])
      .then(([trendingData, recentData]) => {
        if (cancelled) return;
        setTrendingArticles(trendingData.data || trendingData.docs || []);
        setRecentArticles(recentData.data || recentData.docs || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Popular Searches */}
      <section>
        <SectionHeading size="sm" className="mb-3 text-on-surface-variant">
          Pencarian Populer
        </SectionHeading>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/pencarian?q=${encodeURIComponent(term)}`}
              className="inline-flex items-center gap-1.5 border border-outline-variant px-4 py-2 text-sm transition-colors hover:bg-surface-container-low hover:text-on-surface"
            >
              <TrendUp className="size-3.5 text-on-surface-variant" />
              {term}
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section>
        <SectionHeading size="sm" className="mb-3 text-on-surface-variant">
          Telusuri Berdasarkan Kategori
        </SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex items-center gap-3 border border-outline-variant p-4 transition-all hover:bg-surface-container-low"
            >
              <CategoryIcon slug={cat.slug} color={cat.color} />
              <span className="text-sm font-medium transition-colors group-hover:text-primary">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Articles */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading size="sm" className="text-on-surface-variant">
            Berita Trending
          </SectionHeading>
          <Link
            href="/"
            className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-3">
          {trendingArticles.slice(0, 5).map((article: any, index: number) => (
            <Link
              key={article.id}
              href={`/${article.category?.slug || "berita"}/${article.slug}`}
              className="group flex items-start gap-4 p-3 transition-colors hover:bg-surface-container-low"
            >
              <span className="flex size-8 shrink-0 items-center justify-center bg-surface-container text-sm font-bold text-on-surface-variant">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-on-surface-variant">
                  <CategoryBadge variant="pill" className="text-[10px]">
                    {article.category?.name || "-"}
                  </CategoryBadge>
                  <Clock className="size-3" />
                  <span>{article.readingTime || 1} menit</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section>
        <SectionHeading size="sm" className="mb-3 text-on-surface-variant">
          Berita Terkini
        </SectionHeading>
        <div className="grid gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
          {recentArticles.map((article: any) => (
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
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/articles?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.data || data.docs || []);
      setHasSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query) {
      setLoading(true);
      debounceTimer.current = setTimeout(() => {
        fetchResults(query);
      }, 500);
    } else {
      setResults([]);
      setHasSearched(false);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchResults]);

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <Breadcrumb items={[{ label: "Pencarian" }, { label: query || "" }]} />

      <div className="mt-6">
        <SearchBar initialQuery={query} />
      </div>

      {query ? (
        <div className="mt-8">
          <h1 className="font-headline-xl text-headline-xl text-primary">
            Hasil Pencarian
          </h1>
          <p className="mt-2 font-label-md text-label-md text-on-surface-variant">
            {loading ? (
              <span className="flex items-center gap-2">
                <CircleNotch className="size-4 animate-spin" />
                Mencari...
              </span>
            ) : (
              <>
                {results.length} hasil untuk &ldquo;
                <span className="font-medium text-on-surface">{query}</span>&rdquo;
              </>
            )}
          </p>

          {!loading && hasSearched && results.length > 0 ? (
            <div className="mt-6 grid gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
              {results.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : !loading && hasSearched && results.length === 0 ? (
            <div className="py-20 text-center">
              <MagnifyingGlass className="mx-auto mb-4 size-12 text-on-surface-variant/50" />
              <p className="text-lg font-medium text-on-surface">Tidak ada hasil ditemukan</p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Coba kata kunci lain atau periksa ejaan Anda
              </p>
            </div>
          ) : loading ? (
            <div className="mt-6 grid gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded bg-muted/30" />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-8">
          <h1 className="font-headline-xl text-headline-xl text-primary">
            Temukan Berita
          </h1>
          <p className="mt-2 font-label-md text-label-md text-on-surface-variant">
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
          <p className="text-sm text-on-surface-variant">Memuat...</p>
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
