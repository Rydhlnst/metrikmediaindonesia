"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArticleCard } from "@/components/article/article-card";
import { articles } from "@/lib/mock-data";
import { getMockSession } from "@/lib/mock-session";
import { UserCircle, SignIn, SignOut, BookmarkSimple } from "@phosphor-icons/react/dist/ssr";

export default function ProfilePage() {
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

  const handleSignOut = async () => {
    try {
      if (getMockSession()) {
        localStorage.removeItem("mock-session");
      } else {
        await fetch("/api/auth/sign-out", { method: "POST" });
      }
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 text-center lg:min-h-[calc(100vh-48px)]">
        <div>
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
            <UserCircle className="size-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Anda</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Login untuk mengakses profil dan artikel tersimpan
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

  const savedArticles = articles.slice(0, 4);

  return (
    <div className="py-6">
      {/* Profile Header */}
      <div className="border border-border p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center bg-muted text-xl font-bold text-muted-foreground">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.role && (
              <span className="mt-2 inline-block bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {user.role}
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <SignOut className="size-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Saved Articles */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BookmarkSimple className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Artikel Tersimpan</h2>
        </div>
        {savedArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {savedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="border border-border py-12 text-center">
            <BookmarkSimple className="mx-auto mb-4 size-10 text-muted-foreground/50" />
            <p className="font-medium">Belum ada artikel tersimpan</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ketuk ikon bookmark pada artikel untuk menyimpannya
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
