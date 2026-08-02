import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PLACEHOLDER = "/placeholder.png";

export function getImageUrl(image: any): string {
  if (!image) return PLACEHOLDER;

  // bare string URL
  if (typeof image === "string") {
    return image || PLACEHOLDER;
  }

  const url: string | undefined = image.url;
  return url || PLACEHOLDER;
}
