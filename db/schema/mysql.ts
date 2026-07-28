import {
  mysqlTable,
  serial,
  text,
  varchar,
  int,
  boolean,
  timestamp,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// ============================================
// Roles
// ============================================
export const roles = mysqlTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Users
// ============================================
export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    avatar: text("avatar"),
    roleId: int("role_id").references(() => roles.id),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_role_id_idx").on(table.roleId),
  ]
);

// ============================================
// Authors
// ============================================
export const authors = mysqlTable(
  "authors",
  {
    id: serial("id").primaryKey(),
    userId: int("user_id").references(() => users.id),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    bio: text("bio"),
    avatar: text("avatar"),
    role: varchar("role", { length: 50 }),
    socialLinks: json("social_links"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("authors_slug_idx").on(table.slug)]
);

// ============================================
// Categories
// ============================================
export const categories = mysqlTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    color: varchar("color", { length: 7 }),
    parentId: int("parent_id"),
    sortOrder: int("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("categories_slug_idx").on(table.slug)]
);

// ============================================
// Tags
// ============================================
export const tags = mysqlTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("tags_slug_idx").on(table.slug)]
);

// ============================================
// Articles
// ============================================
export const articles = mysqlTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content"),
    excerpt: text("excerpt"),
    thumbnail: text("thumbnail"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    publishedAt: timestamp("published_at"),
    scheduledAt: timestamp("scheduled_at"),
    authorId: int("author_id").references(() => authors.id),
    categoryId: int("category_id").references(() => categories.id),
    viewCount: int("view_count").default(0).notNull(),
    readingTime: int("reading_time").default(0),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    seoKeywords: text("seo_keywords"),
    featured: boolean("featured").default(false),
    breaking: boolean("breaking").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("articles_slug_idx").on(table.slug),
    index("articles_status_idx").on(table.status),
    index("articles_category_id_idx").on(table.categoryId),
    index("articles_author_id_idx").on(table.authorId),
    index("articles_published_at_idx").on(table.publishedAt),
  ]
);

// ============================================
// Article Tags (Many-to-Many)
// ============================================
export const articleTags = mysqlTable(
  "article_tags",
  {
    articleId: int("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    tagId: int("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("article_tags_unique").on(table.articleId, table.tagId),
  ]
);

// ============================================
// Comments
// ============================================
export const comments = mysqlTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    articleId: int("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    userId: int("user_id").references(() => users.id),
    parentId: int("parent_id"),
    content: text("content").notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    authorName: varchar("author_name", { length: 100 }),
    authorEmail: varchar("author_email", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("comments_article_id_idx").on(table.articleId),
    index("comments_status_idx").on(table.status),
  ]
);

// ============================================
// Media
// ============================================
export const media = mysqlTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: int("size"),
  width: int("width"),
  height: int("height"),
  alt: text("alt"),
  caption: text("caption"),
  uploadedBy: int("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Advertisements
// ============================================
export const advertisements = mysqlTable("advertisements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  image: text("image"),
  link: text("link"),
  position: varchar("position", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  clicks: int("clicks").default(0),
  impressions: int("impressions").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Pages (Static Pages)
// ============================================
export const pages = mysqlTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content"),
    excerpt: text("excerpt"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("pages_slug_idx").on(table.slug)]
);

// ============================================
// Settings
// ============================================
export const settings = mysqlTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 20 }).default("text"),
  group: varchar("group", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Relations (same as PostgreSQL)
// ============================================
export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, {
    fields: [authors.userId],
    references: [users.id],
  }),
  articles: many(articles),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  tags: many(articleTags),
  comments: many(comments),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  articles: many(articleTags),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "commentReplies",
  }),
  replies: many(comments, { relationName: "commentReplies" }),
}));
