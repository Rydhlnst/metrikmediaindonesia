"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArticleCard } from "@/components/article/article-card";
import { articles } from "@/lib/mock-data";
import { getMockSession } from "@/lib/mock-session";
import { BookmarkSimple, SignIn } from "@phosphor-icons/react/dist/ssr";

export default function SavedPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockUser = getMockSession();
    if (mockUser) {
      setUser(mockUser);
      setIsLoading(false);
      return;
    }
    
    fetch("/api/auth/get-session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data?.user || null);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container-responsive py-20 text-center">
        <div className="mx-auto size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 text-center lg:min-h-[calc(100vh-48px)]">
        <div>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center bg-muted">
            <BookmarkSimple className="size-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Artikel Tersimpan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Login untuk menyimpan artikel favorit Anda
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-none bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:opacity-90"
            >
              <SignIn className="size-4" />
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-none border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const savedArticles = articles.slice(0, 6);

  return (
    <div className="container-responsive py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Artikel Tersimpan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {savedArticles.length} artikel tersimpan
        </p>
      </div>

      {savedArticles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {savedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <BookmarkSimple className="mx-auto mb-4 size-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">Belum ada artikel tersimpan</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ketuk ikon bookmark pada artikel untuk menyimpannya
          </p>
        </div>
      )}
    </div>
  );
}
