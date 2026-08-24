"use client";

import { useState } from "react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { ArticleCard } from "@/components/article/article-card";
import { PrimaryButton } from "@/components/shared/primary-button";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import type { Article } from "@/lib/types";

interface ApiArticleRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnail: string | null;
  publishedAt: string | null;
  readingTime?: number;
  viewCount?: number;
  featured?: boolean;
  breaking?: boolean;
  categoryId?: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  categoryColor?: string | null;
  category?: { name?: string; slug?: string; color?: string | null };
  author?: { name?: string; slug?: string; bio?: string | null; avatar?: string | null; role?: string | null; social?: Article["author"]["social"] };
  authorId?: number | null;
  authorName?: string | null;
  authorSlug?: string | null;
  authorBio?: string | null;
  authorAvatar?: string | null;
  authorRole?: string | null;
  authorSocial?: Article["author"]["social"];
}

function mapApiArticle(row: ApiArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    thumbnail: row.thumbnail,
    featuredImage: row.thumbnail,
    publishedAt: row.publishedAt,
    readingTime: row.readingTime ?? 5,
    viewCount: row.viewCount ?? 0,
    isFeatured: row.featured ?? false,
    isBreaking: row.breaking ?? false,
    tags: [],
    category: {
      id: row.categoryId ?? 0,
      name: row.categoryName ?? row.category?.name ?? "",
      slug: row.categorySlug ?? row.category?.slug ?? "",
      color: row.categoryColor ?? row.category?.color ?? null,
    },
    author: {
      id: row.authorId ?? 0,
      name: row.authorName ?? row.author?.name ?? "",
      slug: row.authorSlug ?? row.author?.slug ?? "",
      bio: row.authorBio ?? row.author?.bio ?? null,
      avatar: row.authorAvatar ?? row.author?.avatar ?? null,
      role: row.authorRole ?? row.author?.role ?? null,
      social: row.authorSocial ?? row.author?.social ?? null,
    },
  };
}

export function LoadMoreArticles({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?page=${page}&limit=6&status=published`);
      const data = await res.json();
      const rows = (Array.isArray(data.data) ? data.data : []) as ApiArticleRow[];
      if (rows.length > 0) {
        setArticles((prev) => [...prev, ...rows.map(mapApiArticle)]);
        setPage((p) => p + 1);
        if (data.pagination?.totalPages && page >= data.pagination.totalPages) {
          setHasMore(false);
        }
        if (rows.length < 6) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  if (articles.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <AnimateOnScroll
            key={article.id || index}
            animation="scale-in"
            delay={((index % 3) * 100) as 0 | 100 | 200}
          >
            <ArticleCard article={article} showExcerpt />
          </AnimateOnScroll>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <PrimaryButton onClick={handleLoadMore} disabled={loading} size="lg">
            {loading ? (
              <>
                <CircleNotch className="mr-2 size-4 animate-spin" />
                Memuat...
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </PrimaryButton>
        </div>
      )}
    </>
  );
}
