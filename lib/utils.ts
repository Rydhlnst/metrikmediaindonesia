import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PLACEHOLDER = "https://picsum.photos/seed/metrik/800/450";

export type ImageSize = "thumbnail" | "card" | "hero" | "og" | "original";

export function getImageUrl(image: any, size: ImageSize = "original"): string {
  if (!image) return PLACEHOLDER;

  if (typeof image === "string") {
    return image.trim() || PLACEHOLDER;
  }

  if (typeof image === "object") {
    if (image.thumbnail && typeof image.thumbnail === "string") return image.thumbnail;
    if (image.featuredImage && typeof image.featuredImage === "string") return image.featuredImage;
    if (image.url && typeof image.url === "string") return image.url;
  }

  return PLACEHOLDER;
}
