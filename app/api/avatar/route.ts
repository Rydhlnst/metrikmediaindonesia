import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/server-session";
import { avatarQuerySchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAuth(request); if (authGuard.error) return authGuard.error;
  const { searchParams } = new URL(request.url);
  const parsed = avatarQuerySchema.safeParse({
    seed: searchParams.get("seed") ?? undefined,
    size: searchParams.get("size") ?? undefined,
  });
  if (!parsed.success) return zodError(parsed.error);
  const { seed, size } = parsed.data;

  const initials = seed
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const escapedInitials = initials.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#e5e5e5"/>
    <text x="50%" y="50%" dy=".1em" fill="#a3a3a3" font-family="system-ui,sans-serif" font-size="${size * 0.4}" font-weight="600" text-anchor="middle" dominant-baseline="middle">${escapedInitials}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
