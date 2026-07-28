import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get("seed") || "A";
  const size = parseInt(searchParams.get("size") || "128");

  const initials = seed
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#e5e5e5"/>
    <text x="50%" y="50%" dy=".1em" fill="#a3a3a3" font-family="system-ui,sans-serif" font-size="${size * 0.4}" font-weight="600" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
