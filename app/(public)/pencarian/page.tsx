"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { ArticleCard } from "@/components/article/article-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CategoryBadge } from "@/components/shared/category-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import type { Article, Category } from "@/lib/types";
import { requestJson, toastApiError } from "@/lib/api-client";
import {
  MagnifyingGlass,
  TrendUp,
  Clock,
  X,
  ChartLineUp,
  Trophy,
  GraduationCap,
  Buildings,
  Lightning,
  Tag,
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
        className="h-12 w-full border border-black/10 bg-white pl-12 pr-12 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
        autoFocus
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            router.push("/pencarian");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold-deep"
        >
          <X className="size-5" />
        </button>
      )}
    </form>
  );
}

function SearchRecommendations() {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      requestJson<{ data?: Article[] }>("/api/articles?sort=popular&limit=5"),
      requestJson<{ data?: Article[] }>("/api/articles?limit=6"),
      requestJson<{ data?: Category[] }>("/api/public/categories"),
    ])
      .then(([trendingData, recentData, categoryData]) => {
        if (cancelled) return;
        setTrendingArticles(trendingData.data || []);
        setRecentArticles(recentData.data || []);
        setCategories(categoryData.data || []);
      })
      .catch(toastApiError);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Popular Searches */}
      <section>
        <SectionHeader
          title="PENCARIAN POPULER"
          icon={<TrendUp className="size-4" weight="bold" />}
        />
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/pencarian?q=${encodeURIComponent(term)}`}
              className="inline-flex items-center gap-1.5 border border-black/10 bg-white px-4 py-2 text-sm transition-colors hover:border-gold/50 hover:text-foreground"
            >
              <TrendUp className="size-3.5 text-muted-foreground" />
              {term}
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section>
        <SectionHeader
          title="TELUSURI BERDASARKAN KATEGORI"
          icon={<Tag className="size-4" weight="bold" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex items-center gap-3 border border-black/10 bg-white p-4 transition-colors hover:border-gold/50"
            >
              <CategoryIcon slug={cat.slug} color={cat.color || "#B8860B"} />
              <span className="text-sm font-medium transition-colors group-hover:text-gold-deep">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Articles */}
      <section>
        <SectionHeader
          title="BERITA TRENDING"
          href="/"
          actionText="Lihat Semua"
          icon={<TrendUp className="size-4" weight="bold" />}
        />
        <div className="space-y-3">
          {trendingArticles.slice(0, 5).map((article, index) => (
            <Link
              key={article.id}
              href={`/${article.category?.slug || "berita"}/${article.slug}`}
              className="group flex items-start gap-4 p-3 border border-black/10 bg-white transition-colors hover:border-gold/50"
            >
              <span className="flex size-8 shrink-0 items-center justify-center bg-black/5 text-sm font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-gold-deep">
                  {article.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
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
        <SectionHeader
          title="BERITA TERKINI"
          icon={<Lightning className="size-4" weight="bold" />}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentArticles.map((article) => (
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
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      queueMicrotask(() => {
        setResults([]);
        setHasSearched(false);
      });
      return;
    }

    setLoading(true);
    try {
      const data = await requestJson<{ data?: Article[] }>(`/api/articles?search=${encodeURIComponent(q)}`);
      setResults(data.data || []);
      setHasSearched(true);
    } catch (error) {
      setResults([]);
      toastApiError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query) {
      queueMicrotask(() => setLoading(true));
      debounceTimer.current = setTimeout(() => {
        fetchResults(query);
      }, 500);
    } else {
      queueMicrotask(() => {
        setResults([]);
        setHasSearched(false);
      });
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
          <PublicPageHeader
            title="Hasil Pencarian"
            description={
              loading
                ? "Mencari artikel berita terkini..."
                : `${results.length} hasil ditemukan untuk "${query}"`
            }
          />

          {!loading && hasSearched && results.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : !loading && hasSearched && results.length === 0 ? (
            <div className="py-20 text-center">
              <MagnifyingGlass className="mx-auto mb-4 size-12 text-muted-foreground/50" />
              <p className="text-lg font-medium text-foreground">Tidak ada hasil ditemukan</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Coba kata kunci lain atau periksa ejaan Anda
              </p>
            </div>
          ) : loading ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse bg-muted/30" />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-8">
          <PublicPageHeader
            title="Pencarian"
            description="Telusuri arsip berita, laporan investigasi, dan liputan khusus dari seluruh kategori."
          />
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
