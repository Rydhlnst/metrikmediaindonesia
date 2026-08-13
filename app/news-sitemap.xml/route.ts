import { articles } from "@/lib/mock-data";
import { SITE_CONFIG } from "@/lib/constants";

export async function GET() {
  const latestNews = articles.slice(0, 10);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${latestNews
    .map((article) => {
      const pubDate = new Date(article.publishedAt).toISOString();
      return `
    <url>
      <loc>${SITE_CONFIG.url}/news/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>${SITE_CONFIG.name}</news:name>
          <news:language>id</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
      </news:news>
    </url>`;
    })
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
