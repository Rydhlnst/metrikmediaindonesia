import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articleViewRollups, articleViews, articles } from "@/db/schema/index";

export interface ArticleViewContext {
  ip?: string;
  userAgent?: string;
  sessionToken?: string;
}

function hashValue(value: string) {
  return createHash("sha256")
    .update(`${process.env.VIEW_HASH_SALT || process.env.BETTER_AUTH_SECRET || "metrik-view-salt"}:${value}`)
    .digest("hex");
}

export async function recordArticleView(articleId: number, context: ArticleViewContext = {}) {
  const ipHash = hashValue(context.ip || "unknown-ip");
  const userAgentHash = hashValue(context.userAgent || "unknown-agent");
  const sessionHash = hashValue(context.sessionToken || `${ipHash}:${userAgentHash}`);
  const hourBucket = Math.floor(Date.now() / (60 * 60 * 1000));
  const dedupeKey = hashValue(`${articleId}:${sessionHash}:${hourBucket}`);

  try {
    const db = await getDb();
    const [event] = await db
      .insert(articleViews)
      .values({ articleId, sessionHash, ipHash, userAgentHash, dedupeKey })
      .onConflictDoNothing({ target: articleViews.dedupeKey })
      .returning({ id: articleViews.id });

    if (!event) return false;
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, articleId));
    const bucketStart = new Date(Math.floor(Date.now() / (60 * 60 * 1000)) * 60 * 60 * 1000);
    await db
      .insert(articleViewRollups)
      .values({ articleId, bucketStart, bucketType: "hour", viewCount: 1 })
      .onConflictDoUpdate({
        target: [articleViewRollups.articleId, articleViewRollups.bucketStart, articleViewRollups.bucketType],
        set: { viewCount: sql`${articleViewRollups.viewCount} + 1`, updatedAt: new Date() },
      });
    return true;
  } catch (error) {
    console.error("Failed to record article view", error);
    return false;
  }
}
