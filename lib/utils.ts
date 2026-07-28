import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL || "";

export function getImageUrl(image: any): string {
  if (!image) return "https://picsum.photos/seed/placeholder/400/300";
  if (typeof image === "string") return image;
  if (image.url) {
    if (image.url.startsWith("/api/media/file/") && R2_PUBLIC_URL) {
      const filename = image.url.replace("/api/media/file/", "");
      return `${R2_PUBLIC_URL}/${filename}`;
    }
    return image.url;
  }
  return "https://picsum.photos/seed/placeholder/400/300";
}
