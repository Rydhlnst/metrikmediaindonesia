"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/use-session";
import { BookmarkSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import { ArticleCard } from "@/components/article/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { SectionHeader } from "@/components/shared/section-header";

interface BookmarkedArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  publishedAt: string;
  readingTime: number;
  viewCount: number;
  category: {
    name: string;
    slug: string;
    color: string;
  };
  author: {
    name: string;
    avatar: string;
  };
}

function getBookmarks(): BookmarkedArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("bookmarks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: BookmarkedArticle[]) {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

export default function SavedPage() {
  const { user, isLoading } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getBookmarks();
    setBookmarks(stored);
    setLoading(false);
  }, []);

  const handleRemove = (id: number) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    saveBookmarks(updated);
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
          description={`Arsip bacaan pribadi Anda (${bookmarks.length} artikel tersimpan di peramban).`}
        />

        {/* Section Header */}
        <SectionHeader title="DAFTAR ARTIKEL PILIHAN ANDA" />

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
            {bookmarks.map((article) => (
              <div key={article.id} className="group relative">
                <ArticleCard article={article} />
                <button
                  onClick={() => handleRemove(article.id)}
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
