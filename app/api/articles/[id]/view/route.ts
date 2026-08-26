import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { getDb } from "@/db/index";
import { articles } from "@/db/schema/index";
import { recordArticleView } from "@/lib/article-views";
import { invalidateRedisPattern } from "@/lib/redis";

type ArticleViewRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: ArticleViewRouteContext) {
  const { id: slug } = await params;
  const db = await getDb();
  const [article] = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);

  if (!article) {
    return NextResponse.json({ message: "Article not found" }, { status: 404 });
  }

  const didIncrement = await recordArticleView(article.id, {
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    sessionToken:
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value,
  });

  if (didIncrement) {
    revalidateTag("trending", "max");
    void invalidateRedisPattern("cache:articles:trending:*");
  }

  return NextResponse.json({ ok: true, counted: didIncrement });
}
