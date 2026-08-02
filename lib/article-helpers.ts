export function getCategorySlug(article: any, fallback = "berita"): string {
  return typeof article.category === "object" ? article.category?.slug : fallback;
}

export function getCategoryName(article: any, fallback = ""): string {
  return typeof article.category === "object" ? article.category?.name : fallback;
}

export function getAuthorName(article: any, fallback = ""): string {
  return typeof article.author === "object" ? article.author?.name : fallback;
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
