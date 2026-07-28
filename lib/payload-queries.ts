import { getPayload } from "payload";
import config from "@payload-config";

let cachedPayload: any = null;

export async function getPayloadClient() {
  if (cachedPayload) return cachedPayload;
  cachedPayload = await getPayload({ config });
  return cachedPayload;
}

// Articles
export async function getArticles(options?: {
  limit?: number;
  categorySlug?: string;
  featured?: boolean;
  breaking?: boolean;
  page?: number;
  search?: string;
}) {
  const payload = await getPayloadClient();
  const where: any[] = [];

  if (options?.categorySlug) {
    const cats = await payload.find({
      collection: "categories",
      where: { slug: { equals: options.categorySlug } },
      limit: 1,
    });
    if (cats.docs[0]) {
      where.push({ category: { equals: cats.docs[0].id } });
    }
  }

  if (options?.featured) {
    where.push({ isFeatured: { equals: true } });
  }

  if (options?.breaking) {
    where.push({ isBreaking: { equals: true } });
  }

  if (options?.search) {
    where.push({
      or: [
        { title: { contains: options.search } },
        { excerpt: { contains: options.search } },
      ],
    });
  }

  where.push({ status: { equals: "published" } });

  const result = await payload.find({
    collection: "articles",
    where: where.length === 1 ? where[0] : { and: where },
    limit: options?.limit || 10,
    page: options?.page || 1,
    sort: "-publishedAt",
    depth: 2,
  });

  return result;
}

export async function getArticleBySlug(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getTrendingArticles(limit = 5) {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "articles",
    where: { status: { equals: "published" } },
    limit,
    sort: "-viewCount",
    depth: 2,
  });
}

// Categories
export async function getCategories() {
  const payload = await getPayloadClient();
  return payload.find({ collection: "categories", depth: 1 });
}

export async function getCategoryBySlug(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] || null;
}

// Tags
export async function getTags() {
  const payload = await getPayloadClient();
  return payload.find({ collection: "tags", depth: 1 });
}

export async function getTagBySlug(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "tags",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] || null;
}

// Users
export async function getUserById(id: string) {
  const payload = await getPayloadClient();
  try {
    return await payload.findByID({ collection: "users", id, depth: 1 });
  } catch {
    return null;
  }
}

// Search
export async function searchArticles(query: string, limit = 10) {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "articles",
    where: {
      and: [
        {
          or: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
          ],
        },
        { status: { equals: "published" } },
      ],
    },
    limit,
    sort: "-publishedAt",
    depth: 2,
  });
}
