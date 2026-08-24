"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/use-session";
import { BookmarkSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import { ArticleCard } from "@/components/article/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { requestJson, toastApiError } from "@/lib/api-client";

interface Bookmark {
  id: number;
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    thumbnail: string | null;
    publishedAt: string | null;
    category: { name: string; slug: string | null } | null;
  };
}

export default function SavedPage() {
  const { user, isLoading } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    requestJson<{ data: Bookmark[] }>("/api/bookmarks")
      .then((response) => setBookmarks(response.data))
      .catch(toastApiError)
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (articleId: number) => {
    try {
      await requestJson(`/api/bookmarks/${articleId}`, { method: "DELETE" });
      setBookmarks((current) => current.filter((bookmark) => bookmark.article.id !== articleId));
    } catch (error) {
      toastApiError(error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="py-20 text-center min-h-[60vh] flex items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-black/10 border-t-black" />
      </div>
    );
  }

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Standardized Reusable Header */}
        <PublicPageHeader
          title="Disimpan"
          description={`Your private reading list (${bookmarks.length} saved articles).`}
        />

        {/* Section Header */}
        <SectionHeader
          title="DAFTAR ARTIKEL PILIHAN ANDA"
          icon={<BookmarkSimple className="size-4" weight="bold" />}
        />

        {bookmarks.length === 0 ? (
          <div className="rounded-none border border-black/10 bg-white p-8">
            <EmptyState
              icon={BookmarkSimple}
              title="Belum Ada Artikel Tersimpan"
              description="Ketuk ikon bookmark (simpan) pada setiap artikel berita untuk membacanya nanti."
              actionLabel="Jelajahi Berita Terkini"
              actionHref="/"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="group relative">
                <ArticleCard
                  article={{
                    ...bookmark.article,
                    featuredImage: bookmark.article.thumbnail,
                    category: bookmark.article.category ?? undefined,
                  }}
                />
                <button
                  onClick={() => handleRemove(bookmark.article.id)}
                  className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-none bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                  title="Hapus dari daftar simpan"
                >
                  <Trash className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
