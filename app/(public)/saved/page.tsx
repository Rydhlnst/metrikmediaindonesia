"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/use-session";
import { BookmarkSimple, SignIn, Trash } from "@phosphor-icons/react/dist/ssr";
import { ArticleCard } from "@/components/article/article-card";

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
      <div className="py-20 text-center">
        <div className="mx-auto size-6 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 text-center md:min-h-[calc(100vh-48px)]">
        <div>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center bg-surface-container">
            <BookmarkSimple className="size-8 text-on-surface-variant" />
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Artikel Tersimpan</h1>
          <p className="mt-2 font-label-md text-label-md text-on-surface-variant">Login untuk menyimpan artikel favorit Anda</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary hover:text-on-secondary">
              <SignIn className="size-4" /> Login
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 border border-outline-variant px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-container-low">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-editorial py-8 pb-20 md:pb-8">
      <div className="mb-6">
        <h1 className="font-headline-xl text-headline-xl text-primary">Artikel Tersimpan</h1>
        <p className="mt-1 font-label-md text-label-md text-on-surface-variant">
          {bookmarks.length} artikel tersimpan
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-20 text-center">
          <BookmarkSimple className="mx-auto mb-4 size-12 text-on-surface-variant/50" />
          <p className="text-lg font-medium text-on-surface">Belum ada artikel tersimpan</p>
          <p className="mt-2 text-sm text-on-surface-variant">Ketuk ikon bookmark pada artikel untuk menyimpannya</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((article) => (
            <div key={article.id} className="group relative">
              <ArticleCard article={article} />
              <button
                onClick={() => handleRemove(article.id)}
                className="absolute right-2 top-2 flex size-8 items-center justify-center bg-background/80 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive hover:text-white group-hover:opacity-100"
                title="Hapus dari bookmark"
              >
                <Trash className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
