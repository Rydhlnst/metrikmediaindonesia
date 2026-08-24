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

const PLACEHOLDER = "/placeholder.png";

export type ImageSize = "thumbnail" | "card" | "hero" | "og" | "original";

export function getImageUrl(image: unknown, _size: ImageSize = "original"): string {
  void _size;
  if (!image) return PLACEHOLDER;

  if (typeof image === "string") {
    return image.trim() || PLACEHOLDER;
  }

  if (typeof image === "object" && image !== null) {
    const candidate = image as { thumbnail?: unknown; featuredImage?: unknown; url?: unknown };
    if (typeof candidate.thumbnail === "string") return candidate.thumbnail;
    if (typeof candidate.featuredImage === "string") return candidate.featuredImage;
    if (typeof candidate.url === "string") return candidate.url;
  }

  return PLACEHOLDER;
}
