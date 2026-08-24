"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookmarkSimple } from "@phosphor-icons/react/dist/ssr";
import { ApiClientError, requestJson, toastApiError } from "@/lib/api-client";

export function BookmarkButton({ articleId }: { articleId: number }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestJson<{ data?: Array<{ article: { id: number } }> }>("/api/bookmarks")
      .then((response) => setSaved(Boolean(response.data?.some((bookmark) => bookmark.article.id === articleId))))
      .catch((error) => {
        if (!(error instanceof ApiClientError && error.status === 401)) toastApiError(error);
      });
  }, [articleId]);

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      await requestJson(saved ? `/api/bookmarks/${articleId}` : "/api/bookmarks", {
        method: saved ? "DELETE" : "POST",
        headers: saved ? undefined : { "Content-Type": "application/json" },
        body: saved ? undefined : JSON.stringify({ articleId }),
      });
      setSaved(!saved);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else {
        toastApiError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className="flex size-9 items-center justify-center border border-black/10 bg-white text-muted-foreground transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-50"
      aria-label={saved ? "Remove bookmark" : "Save article"}
      title={saved ? "Remove bookmark" : "Save article"}
    >
      <BookmarkSimple className="size-4" weight={saved ? "fill" : "regular"} />
    </button>
  );
}
