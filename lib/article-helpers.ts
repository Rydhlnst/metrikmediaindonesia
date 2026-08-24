interface ArticleRelations {
  category?: { slug?: string | null; name?: string | null } | null;
  author?: { name?: string | null } | null;
}

export function getCategorySlug(article: ArticleRelations, fallback = "berita"): string {
  return article.category?.slug || fallback;
}

export function getCategoryName(article: ArticleRelations, fallback = ""): string {
  return article.category?.name || fallback;
}

export function getAuthorName(article: ArticleRelations, fallback = ""): string {
  return article.author?.name || fallback;
}

export function getTimeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export function formatViews(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}jt`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}
