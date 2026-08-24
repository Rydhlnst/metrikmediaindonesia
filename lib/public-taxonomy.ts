import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { articleEntities, articleTopics, articles, entities, locations, topics } from "@/db/schema/index";
import { getArticles } from "@/lib/queries";
import type { Article } from "@/lib/types";

type TaxonomyProfile = { name: string; description: string | null; articles: Article[] };

export async function getTopicProfile(slug: string): Promise<TaxonomyProfile | null> {
  const db = await getDb();
  const [topic] = await db.select({ id: topics.id, name: topics.name, description: topics.description }).from(topics).where(and(eq(topics.slug, slug), eq(topics.isActive, true))).limit(1);
  if (!topic) return null;
  const ids = await db.select({ id: articleTopics.articleId }).from(articleTopics).innerJoin(articles, eq(articleTopics.articleId, articles.id)).where(and(eq(articleTopics.topicId, topic.id), eq(articles.status, "published")));
  return { ...topic, articles: await getArticles({ ids: ids.map((item) => item.id), limit: 24 }) };
}

export async function getEntityProfile(slug: string): Promise<TaxonomyProfile | null> {
  const db = await getDb();
  const [entity] = await db.select({ id: entities.id, name: entities.name, description: entities.bioOrDesc }).from(entities).where(and(eq(entities.slug, slug), eq(entities.isActive, true))).limit(1);
  if (!entity) return null;
  const ids = await db.select({ id: articleEntities.articleId }).from(articleEntities).innerJoin(articles, eq(articleEntities.articleId, articles.id)).where(and(eq(articleEntities.entityId, entity.id), eq(articles.status, "published")));
  return { ...entity, articles: await getArticles({ ids: ids.map((item) => item.id), limit: 24 }) };
}

export async function getLocationProfile(slug: string): Promise<TaxonomyProfile | null> {
  const db = await getDb();
  const [location] = await db.select({ id: locations.id, name: locations.name, description: locations.description }).from(locations).where(and(eq(locations.slug, slug), eq(locations.isActive, true))).limit(1);
  if (!location) return null;
  return { ...location, articles: await getArticles({ ids: (await db.select({ id: articles.id }).from(articles).where(and(eq(articles.locationId, location.id), eq(articles.status, "published")))).map((item) => item.id), limit: 24 }) };
}
