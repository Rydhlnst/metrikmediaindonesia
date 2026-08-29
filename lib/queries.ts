import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { desc, eq, and, ilike, or, not, inArray, sql, gt, gte, isNull, lte } from "drizzle-orm";
import { getDb } from "@/db/index";
import {
  articles,
  categories,
  authors,
  tags,
  articleTags,
  articleViewRollups,
} from "@/db/schema/index";
import { recordArticleView, type ArticleViewContext } from "@/lib/article-views";
import type { Article, Author, Category, GetArticlesOptions } from "@/lib/types";
import { withRedisCache, invalidateRedisPattern } from "@/lib/redis";
import { IMAGE_PLACEHOLDER } from "@/lib/utils";

const REVALIDATE_SECONDS = 300;

async function fetchTagsForArticles(articleIds: number[]): Promise<Map<number, string[]>> {
  if (articleIds.length === 0) return new Map();
  const db = await getDb();
  const rows = await db
    .select({ articleId: articleTags.articleId, tagName: tags.name })
    .from(articleTags)
    .innerJoin(tags, eq(articleTags.tagId, tags.id))
    .where(inArray(articleTags.articleId, articleIds));
  const map = new Map<number, string[]>();
  for (const r of rows) {
    const arr = map.get(r.articleId) ?? [];
    arr.push(r.tagName);
    map.set(r.articleId, arr);
  }
  return map;
}

type ArticleJoinRow = {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnail: string | null;
  status: string;
  publishedAt: Date | null;
  readingTime: number | null;
  viewCount: number | null;
  featured: boolean | null;
  breaking: boolean | null;
  editorsChoice: boolean | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  focusKeyword: string | null;
  updatedAt: Date | null;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  categoryColor: string | null;
  authorId: number;
  authorName: string;
  authorSlug: string;
  authorBio: string | null;
  authorAvatar: string | null;
  authorRole: string | null;
  authorSocial: Author["social"];
};

function mapRowToArticle(row: ArticleJoinRow, tagList: string[]): Article {
  const thumbnail = row.thumbnail?.includes("picsum.photos") ? IMAGE_PLACEHOLDER : row.thumbnail;

  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    thumbnail,
    featuredImage: thumbnail,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    readingTime: row.readingTime ?? 5,
    viewCount: row.viewCount ?? 0,
    isFeatured: row.featured ?? false,
    isBreaking: row.breaking ?? false,
    editorsChoice: row.editorsChoice ?? false,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    focusKeyword: row.focusKeyword,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
    tags: tagList,
    category: {
      id: row.categoryId,
      name: row.categoryName,
      slug: row.categorySlug,
      color: row.categoryColor,
    },
    author: {
      id: row.authorId,
      name: row.authorName,
      slug: row.authorSlug,
      bio: row.authorBio,
      avatar: row.authorAvatar,
      role: row.authorRole,
      social: row.authorSocial,
    },
  };
}

const articleSelect = {
  id: articles.id,
  title: articles.title,
  subtitle: articles.subtitle,
  slug: articles.slug,
  excerpt: articles.excerpt,
  content: articles.content,
  thumbnail: articles.thumbnail,
  status: articles.status,
  publishedAt: articles.publishedAt,
  readingTime: articles.readingTime,
  viewCount: articles.viewCount,
  featured: articles.featured,
  breaking: articles.breaking,
  editorsChoice: articles.editorsChoice,
  seoTitle: articles.seoTitle,
  seoDescription: articles.seoDescription,
  seoKeywords: articles.seoKeywords,
  focusKeyword: articles.focusKeyword,
  updatedAt: articles.updatedAt,
  categoryId: categories.id,
  categoryName: categories.name,
  categorySlug: categories.slug,
  categoryColor: categories.color,
  authorId: authors.id,
  authorName: authors.name,
  authorSlug: authors.slug,
  authorBio: authors.bio,
  authorAvatar: authors.avatar,
  authorRole: authors.role,
  authorSocial: authors.socialLinks,
} as const;

async function listArticlesRaw(options: GetArticlesOptions): Promise<Article[]> {
  const db = await getDb();
  const conditions = [eq(articles.status, "published"), eq(categories.isActive, true)];

  if (options.categorySlug) {
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.slug, options.categorySlug), eq(categories.isActive, true)))
      .limit(1);
    if (cat) conditions.push(eq(articles.categoryId, cat.id));
  }

  if (options.authorSlug) {
    const [auth] = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.slug, options.authorSlug))
      .limit(1);
    if (auth) conditions.push(eq(articles.authorId, auth.id));
  }

  if (options.tagSlug) {
    const [tag] = await db
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.slug, options.tagSlug))
      .limit(1);
    if (!tag) return [];
    const taggedArticleIds = db
      .select({ articleId: articleTags.articleId })
      .from(articleTags)
      .where(eq(articleTags.tagId, tag.id));
    conditions.push(inArray(articles.id, taggedArticleIds));
  }

  if (options.featured) conditions.push(eq(articles.featured, true));
  if (options.breaking) {
    const now = new Date();
    conditions.push(
      eq(articles.breaking, true),
      or(isNull(articles.breakingStartsAt), lte(articles.breakingStartsAt, now))!,
      or(isNull(articles.breakingEndsAt), gt(articles.breakingEndsAt, now))!,
    );
  }
  if (options.editorsChoice) conditions.push(eq(articles.editorsChoice, true));
  if (options.ids) {
    if (!options.ids.length) return [];
    conditions.push(inArray(articles.id, options.ids));
  }

  if (options.search) {
    const term = `%${options.search}%`;
    conditions.push(
      or(
        ilike(articles.title, term),
        ilike(articles.subtitle, term),
        ilike(articles.excerpt, term),
        ilike(articles.content, term),
        ilike(authors.name, term),
        ilike(categories.name, term)
      )!
    );
  }

  const limit = options.limit ?? 10;
  const offset = options.page ? (options.page - 1) * limit : 0;
  const orderBy = options.breaking
    ? desc(articles.viewCount)
    : desc(articles.publishedAt);

  const rows = await db
    .select(articleSelect)
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(authors, eq(articles.authorId, authors.id))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const tagMap = await fetchTagsForArticles(rows.map((r) => r.id));
  return rows.map((r) => mapRowToArticle(r as ArticleJoinRow, tagMap.get(r.id) ?? []));
}

async function getArticleBySlugRaw(slug: string): Promise<Article | null> {
  try {
    const db = await getDb();
    const rows = await db
      .select(articleSelect)
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
      .limit(1);

    if (rows.length > 0) {
      const tagMap = await fetchTagsForArticles([rows[0].id]);
      const mapped = mapRowToArticle(rows[0] as ArticleJoinRow, tagMap.get(rows[0].id) ?? []);
      return mapped;
    }
  } catch (e) {
    console.warn("getArticleBySlug db error:", e);
  }
  return null;
}

// ----------------------------------------------------
// Cached Queries with Multi-Tier Cache (React + Next.js + Redis)
// ----------------------------------------------------

export const getArticles = cache(async (options: GetArticlesOptions = {}): Promise<Article[]> => {
  const cacheKey = `cache:articles:list:${JSON.stringify(options)}`;
  return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
    const cachedFn = unstable_cache(
      async () => listArticlesRaw(options),
      ["articles-list", JSON.stringify(options)],
      { revalidate: REVALIDATE_SECONDS, tags: ["articles"] }
    );
    return cachedFn();
  });
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const cacheKey = `cache:articles:slug:${slug}`;
  return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
    const cachedFn = unstable_cache(
      async () => getArticleBySlugRaw(slug),
      ["article-detail", slug],
      { revalidate: REVALIDATE_SECONDS, tags: ["articles", `article-${slug}`] }
    );
    return cachedFn();
  });
});

export const getTrendingArticles = cache(async (limit = 5, windowHours = 24): Promise<Article[]> => {
  const cacheKey = `cache:articles:trending:${limit}:${windowHours}`;
  return withRedisCache(cacheKey, 120, async () => {
    const cachedFn = unstable_cache(
      async () => {
        const db = await getDb();
        const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000);
        const rollupCounts = db
          .select({ articleId: articleViewRollups.articleId, views: sql<number>`sum(${articleViewRollups.viewCount})`.as("views") })
          .from(articleViewRollups)
          .where(and(gte(articleViewRollups.bucketStart, cutoff), eq(articleViewRollups.bucketType, "hour")))
          .groupBy(articleViewRollups.articleId)
          .as("trending_counts");
        const rows = await db
          .select({ ...articleSelect, trendingViews: sql<number>`coalesce(${rollupCounts.views}, 0)` })
          .from(articles)
          .leftJoin(categories, eq(articles.categoryId, categories.id))
          .leftJoin(authors, eq(articles.authorId, authors.id))
          .leftJoin(rollupCounts, eq(articles.id, rollupCounts.articleId))
          .where(eq(articles.status, "published"))
          .orderBy(desc(sql`coalesce(${rollupCounts.views}, 0)`), desc(articles.viewCount))
          .limit(limit);
        const tagMap = await fetchTagsForArticles(rows.map((r) => r.id));
        return rows.map((r) => mapRowToArticle(r as ArticleJoinRow, tagMap.get(r.id) ?? []));
      },
      ["articles-trending", String(limit), String(windowHours)],
      { revalidate: 120, tags: ["articles", "trending"] }
    );
    return cachedFn();
  });
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const cacheKey = "cache:categories:list";
  return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
    const cachedFn = unstable_cache(
      async () => {
        const db = await getDb();
        const rows = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            color: categories.color,
            description: categories.description,
            articleCount: sql<number>`count(${articles.id})`.as("article_count"),
          })
          .from(categories)
          .leftJoin(articles, and(eq(articles.categoryId, categories.id), eq(articles.status, "published")))
          .where(eq(categories.isActive, true))
          .groupBy(categories.id)
          .orderBy(categories.id);
        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          color: r.color,
          description: r.description,
        }));
      },
      ["categories-list"],
      { revalidate: REVALIDATE_SECONDS, tags: ["categories"] }
    );
    return cachedFn();
  });
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const cacheKey = `cache:categories:slug:${slug}`;
  return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
    const cachedFn = unstable_cache(
      async () => {
        try {
          const db = await getDb();
          const [row] = await db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
              color: categories.color,
              description: categories.description,
            })
            .from(categories)
          .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
            .limit(1);
          if (row) return row;
        } catch (e) { console.warn("getCategoryBySlug db error:", e); }
        return null;
      },
      ["category-by-slug", slug],
      { revalidate: REVALIDATE_SECONDS, tags: ["categories", `category-${slug}`] }
    );
    return cachedFn();
  });
});

export const getTags = cache(async () => {
  const cacheKey = "cache:tags:list";
  return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
    const cachedFn = unstable_cache(
      async () => {
        const db = await getDb();
        return db.select().from(tags).orderBy(tags.name);
      },
      ["tags-list"],
      { revalidate: REVALIDATE_SECONDS, tags: ["tags"] }
    );
    return cachedFn();
  });
});

export const getAuthors = cache(async (): Promise<Author[]> => {
  const cacheKey = "cache:authors:list";
  return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
    const cachedFn = unstable_cache(
      async () => {
        const db = await getDb();
        const rows = await db
          .select({
            id: authors.id,
            name: authors.name,
            slug: authors.slug,
            avatar: authors.avatar,
            bio: authors.bio,
            role: authors.role,
            social: authors.socialLinks,
            articleCount: sql<number>`count(${articles.id})`.as("article_count"),
          })
          .from(authors)
          .leftJoin(articles, and(eq(articles.authorId, authors.id), eq(articles.status, "published")))
          .groupBy(authors.id)
          .orderBy(desc(authors.id));
        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          avatar: r.avatar,
          bio: r.bio,
          role: r.role,
          social: r.social,
        }));
      },
      ["authors-list"],
      { revalidate: REVALIDATE_SECONDS, tags: ["authors"] }
    );
    return cachedFn();
  });
});

export const getAuthorBySlug = cache(async (slug: string): Promise<Author | null> => {
  const cacheKey = `cache:author:slug:${slug}`;
  return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
    const cachedFn = unstable_cache(
      async () => {
        try {
          const db = await getDb();
          const [row] = await db
            .select({
              id: authors.id,
              name: authors.name,
              slug: authors.slug,
              avatar: authors.avatar,
              bio: authors.bio,
              role: authors.role,
              social: authors.socialLinks,
            })
            .from(authors)
            .where(eq(authors.slug, slug))
            .limit(1);

          if (row) {
            return {
              id: row.id,
              name: row.name,
              slug: row.slug,
              avatar: row.avatar,
              bio: row.bio,
              role: row.role,
              social: row.social,
            };
          }
        } catch (e) { console.warn("getAuthorBySlug DB query error:", e); }
        return null;
      },
      ["author-by-slug", slug],
      { revalidate: REVALIDATE_SECONDS, tags: ["authors", `author-${slug}`] }
    );
    return cachedFn();
  });
});

export const getRelatedArticles = cache(
  async (article: Pick<Article, "id" | "category" | "tags">, limit = 4): Promise<Article[]> => {
    const cacheKey = `cache:articles:related:${article.id}:${limit}`;
    return withRedisCache(cacheKey, REVALIDATE_SECONDS, async () => {
      const cachedFn = unstable_cache(
        async () => {
          const db = await getDb();
          const relatedTagIds = await db
            .select({ tagId: articleTags.tagId })
            .from(articleTags)
            .where(eq(articleTags.articleId, article.id));
          const tagIdList = relatedTagIds.map((t) => t.tagId);

          const relatedArticleIds = tagIdList.length
            ? await db
                .select({ articleId: articleTags.articleId })
                .from(articleTags)
                .where(and(inArray(articleTags.tagId, tagIdList), not(eq(articleTags.articleId, article.id))))
            : [];

          const idSet = new Set(relatedArticleIds.map((r) => r.articleId));
          const conditions = [
            eq(articles.status, "published"),
            not(eq(articles.id, article.id)),
            or(
              eq(articles.categoryId, article.category.id),
              idSet.size ? inArray(articles.id, [...idSet]) : sql`false`
            )!,
          ];

          const rows = await db
            .select(articleSelect)
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .leftJoin(authors, eq(articles.authorId, authors.id))
            .where(and(...conditions))
            .orderBy(desc(articles.publishedAt))
            .limit(limit);
          const tagMap = await fetchTagsForArticles(rows.map((r) => r.id));
          return rows.map((r) => mapRowToArticle(r as ArticleJoinRow, tagMap.get(r.id) ?? []));
        },
        ["articles-related", String(article.id), String(limit)],
        { revalidate: REVALIDATE_SECONDS, tags: ["articles"] }
      );
      return cachedFn();
    });
  }
);

export async function searchArticles(query: string, limit = 10): Promise<Article[]> {
  return listArticlesRaw({ search: query, limit });
}

export async function incrementArticleViews(slug: string, context?: ArticleViewContext) {
  try {
    const db = await getDb();
    const [article] = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    if (article) await recordArticleView(article.id, context);
    void invalidateRedisPattern("cache:articles:trending:*");
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
}

export const incrementViewCount = incrementArticleViews;

export function revalidateAllArticles() {
  revalidateTag("articles", "max");
  revalidateTag("trending", "max");
  revalidateTag("article-by-slug", "max");
  void invalidateRedisPattern("cache:articles:*");
}

export function revalidateCategories() {
  revalidateTag("categories", "max");
  revalidateTag("articles", "max");
  void invalidateRedisPattern("cache:categories:*");
  void invalidateRedisPattern("cache:articles:*");
}

export function revalidateAuthors() {
  revalidateTag("authors", "max");
  revalidateTag("articles", "max");
  void invalidateRedisPattern("cache:authors:*");
  void invalidateRedisPattern("cache:articles:*");
}
