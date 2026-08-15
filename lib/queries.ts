import { unstable_cache, revalidateTag } from "next/cache";
import { desc, eq, and, like, or, not, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db/index";
import {
  articles,
  categories,
  authors,
  tags,
  articleTags,
} from "@/db/schema/index";
import type { Article, Author, Category, GetArticlesOptions } from "@/lib/types";

const REVALIDATE_SECONDS = 300;
const PLACEHOLDER = "/placeholder.png";

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
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    thumbnail: row.thumbnail,
    featuredImage: row.thumbnail,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    readingTime: row.readingTime ?? 5,
    viewCount: row.viewCount ?? 0,
    isFeatured: row.featured ?? false,
    isBreaking: row.breaking ?? false,
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
  const conditions = [eq(articles.status, "published")];

  if (options.categorySlug) {
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, options.categorySlug))
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

  if (options.featured) conditions.push(eq(articles.featured, true));
  if (options.breaking) conditions.push(eq(articles.breaking, true));

  if (options.search) {
    const term = `%${options.search}%`;
    conditions.push(
      or(like(articles.title, term), like(articles.excerpt, term))!
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
      if (!mapped.content || mapped.content.trim() === "") {
        const { generateArticleHtml } = await import("@/lib/mock-data");
        mapped.content = generateArticleHtml(
          mapped.title,
          mapped.excerpt || "",
          mapped.category.name,
          mapped.author.name
        );
      }
      return mapped;
    }
  } catch (e) {
    console.warn("getArticleBySlug db error, using fallback:", e);
  }

  // Fallback to rich mock data
  const { getArticleBySlug: getMockArticleBySlug, generateArticleHtml } = await import("@/lib/mock-data");
  const mock = getMockArticleBySlug(slug);
  if (mock) {
    return {
      id: parseInt(mock.id) || 1,
      title: mock.title,
      slug: mock.slug,
      excerpt: mock.excerpt,
      content: mock.content || generateArticleHtml(mock.title, mock.excerpt, mock.category.name, mock.author.name),
      thumbnail: mock.thumbnail,
      featuredImage: (mock as any).featuredImage || mock.thumbnail,
      publishedAt: mock.publishedAt,
      readingTime: mock.readingTime,
      viewCount: mock.viewCount,
      isFeatured: mock.isFeatured || false,
      isBreaking: mock.isBreaking || false,
      seoTitle: mock.title,
      seoDescription: mock.excerpt,
      seoKeywords: mock.tags.join(", "),
      focusKeyword: mock.tags[0] || "",
      updatedAt: mock.publishedAt,
      category: {
        id: 1,
        name: mock.category.name,
        slug: mock.category.slug,
        color: mock.category.color,
      },
      author: {
        id: 1,
        name: mock.author.name,
        slug: mock.author.slug,
        bio: mock.author.bio,
        avatar: mock.author.avatar,
        role: mock.author.role,
        social: mock.author.social,
      },
      tags: mock.tags,
    };
  }
  return null;
}

export const getArticles = unstable_cache(
  async (options: GetArticlesOptions = {}): Promise<Article[]> => listArticlesRaw(options),
  ["articles-list"],
  { revalidate: REVALIDATE_SECONDS, tags: ["articles"] }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<Article | null> => getArticleBySlugRaw(slug),
  ["article-detail"],
  { revalidate: REVALIDATE_SECONDS, tags: ["articles", "article-by-slug"] }
);

export const getTrendingArticles = unstable_cache(
  async (limit = 5): Promise<Article[]> => {
    const db = await getDb();
    const rows = await db
      .select(articleSelect)
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.viewCount))
      .limit(limit);
    const tagMap = await fetchTagsForArticles(rows.map((r) => r.id));
    return rows.map((r) => mapRowToArticle(r as ArticleJoinRow, tagMap.get(r.id) ?? []));
  },
  ["articles-trending"],
  { revalidate: REVALIDATE_SECONDS, tags: ["articles", "trending"] }
);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
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

export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
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
        .where(eq(categories.slug, slug))
        .limit(1);
      if (row) return row;
    } catch (e) {
      console.warn("getCategoryBySlug db error, using fallback:", e);
    }

    // Fallback from CATEGORIES constant
    const { CATEGORIES } = await import("@/lib/constants");
    const fallback = CATEGORIES.find((c) => c.slug === slug);
    if (fallback) {
      return {
        id: parseInt(fallback.id) || 1,
        name: fallback.name,
        slug: fallback.slug,
        color: fallback.color || null,
        description: `Berita terbaru seputar ${fallback.name}`,
      };
    }
    return null;
  },
  ["category-by-slug"],
  { revalidate: REVALIDATE_SECONDS, tags: ["categories"] }
);

export const getTags = unstable_cache(
  async () => {
    const db = await getDb();
    return db.select().from(tags).orderBy(tags.name);
  },
  ["tags-list"],
  { revalidate: REVALIDATE_SECONDS, tags: ["tags"] }
);

export const getAuthors = unstable_cache(
  async (): Promise<Author[]> => {
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

export const getRelatedArticles = unstable_cache(
  async (article: Pick<Article, "id" | "category" | "tags">, limit = 4): Promise<Article[]> => {
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
  ["articles-related"],
  { revalidate: REVALIDATE_SECONDS, tags: ["articles"] }
);

export async function searchArticles(query: string, limit = 10): Promise<Article[]> {
  return listArticlesRaw({ search: query, limit });
}

export async function incrementArticleViews(slug: string) {
  try {
    const db = await getDb();
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.slug, slug));
    (revalidateTag as any)("trending");
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
}

export const incrementViewCount = incrementArticleViews;

export function revalidateAllArticles() {
  (revalidateTag as any)("articles");
  (revalidateTag as any)("trending");
  (revalidateTag as any)("article-by-slug");
}

export function revalidateCategories() {
  (revalidateTag as any)("categories");
  (revalidateTag as any)("articles");
}

export function revalidateAuthors() {
  (revalidateTag as any)("authors");
  (revalidateTag as any)("articles");
}
