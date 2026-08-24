import { NextRequest, NextResponse } from "next/server";
import { and, eq, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/index";
import { articles, categories } from "@/db/schema/index";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const now = new Date();
  const published = await db
    .update(articles)
    .set({ status: "published", publishedAt: now, updatedAt: now })
    .where(and(eq(articles.status, "scheduled"), lte(articles.scheduledAt, now)))
    .returning({ slug: articles.slug, categoryId: articles.categoryId });

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/news-sitemap.xml");
  for (const article of published) {
    if (article.categoryId) {
      const [category] = await db.select({ slug: categories.slug }).from(categories).where(eq(categories.id, article.categoryId)).limit(1);
      if (category) revalidatePath(`/${category.slug}/${article.slug}`);
    }
  }

  return NextResponse.json({ published: published.length, runAt: now.toISOString() });
}
