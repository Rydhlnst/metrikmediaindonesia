import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// Roles
// ============================================
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Permissions
// ============================================
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 120 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("role_permissions_role_permission_idx").on(
      table.roleId,
      table.permissionId
    ),
    index("role_permissions_role_id_idx").on(table.roleId),
    index("role_permissions_permission_id_idx").on(table.permissionId),
  ]
);

// ============================================
// Users (Legacy / Custom table)
// ============================================
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    avatar: text("avatar"),
    roleId: integer("role_id").references(() => roles.id),
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
// Better Auth Core Tables
// ============================================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  roleId: integer("role_id").references(() => roles.id),
  isActive: boolean("is_active").default(true).notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Authors
// ============================================
export const authors = pgTable(
  "authors",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    authUserId: text("auth_user_id").references(() => user.id),
    email: varchar("email", { length: 255 }).unique(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    bio: text("bio"),
    avatar: text("avatar"),
    role: varchar("role", { length: 50 }).default("Kontributor"),
    status: varchar("status", { length: 30 }).default("active").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    totalArticles: integer("total_articles").default(0).notNull(),
    totalViews: integer("total_views").default(0).notNull(),
    socialLinks: jsonb("social_links").$type<{
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      facebook?: string;
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("authors_slug_idx").on(table.slug),
    index("authors_auth_user_id_idx").on(table.authUserId),
  ]
);

// ============================================
// Author Milestone Notification Logs
// ============================================
export const authorMilestoneLogs = pgTable(
  "author_milestone_logs",
  {
    id: serial("id").primaryKey(),
    authorId: integer("author_id").references(() => authors.id, { onDelete: "cascade" }).notNull(),
    milestoneType: varchar("milestone_type", { length: 50 }).notNull(), // 3_months, 6_months, 1_year, 2_years, annual
    email: varchar("email", { length: 255 }).notNull(),
    statsSnapshot: jsonb("stats_snapshot").$type<{
      totalArticles: number;
      totalViews: number;
      milestoneLabel: string;
      joinedAt?: string;
    }>(),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
  },
  (table) => [
    index("author_milestones_author_idx").on(table.authorId),
    index("author_milestones_type_idx").on(table.milestoneType),
  ]
);


// ============================================
// Categories
// ============================================
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    color: varchar("color", { length: 7 }),
    parentId: integer("parent_id"),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true).notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("categories_slug_idx").on(table.slug)]
);

// ============================================
// Tags
// ============================================
export const tags = pgTable(
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
// Topics
// ============================================
export const topics = pgTable(
  "topics",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    cover: text("cover"),
    isActive: boolean("is_active").default(true).notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("topics_slug_idx").on(table.slug)]
);

// ============================================
// Entities (Person, Organization, Place)
// ============================================
export const entities = pgTable(
  "entities",
  {
    id: serial("id").primaryKey(),
    type: varchar("type", { length: 20 }).notNull(), // person, organization, place
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull().unique(),
    avatarOrLogo: text("avatar_or_logo"),
    bioOrDesc: text("bio_or_desc"),
    metadata: jsonb("metadata").$type<{
      position?: string;
      industry?: string;
      location?: string;
      website?: string;
    }>(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("entities_slug_idx").on(table.slug),
    index("entities_type_idx").on(table.type),
  ]
);

// ============================================
// Locations (Country, Province, City, District)
// ============================================
export const locations = pgTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    level: varchar("level", { length: 20 }).notNull().default("province"), // country, province, city, district
    parentId: integer("parent_id"),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("locations_slug_idx").on(table.slug),
    index("locations_level_idx").on(table.level),
  ]
);

// ============================================
// Sources
// ============================================
export const sources = pgTable(
  "sources",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    url: text("url"),
    type: varchar("type", { length: 50 }).notNull().default("field_reporting"), // government, official_organization, interview, press_release, document, field_reporting, other
    publicationDate: timestamp("publication_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

// ============================================
// Articles
// ============================================
export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    subtitle: text("subtitle"),
    content: text("content"),
    excerpt: text("excerpt"),
    thumbnail: text("thumbnail"),
    imageCaption: text("image_caption"),
    imageCredit: text("image_credit"),
    status: varchar("status", { length: 30 }).default("draft").notNull(), // draft, submitted, editorial_review, approved, scheduled, published, revision_required, archived
    publishedAt: timestamp("published_at"),
    scheduledAt: timestamp("scheduled_at"),
    breakingStartsAt: timestamp("breaking_starts_at"),
    breakingEndsAt: timestamp("breaking_ends_at"),
    submittedAt: timestamp("submitted_at"),
    reviewNote: text("review_note"), // catatan editor saat revisi/penolakan
    authorId: integer("author_id").references(() => authors.id),
    editorId: integer("editor_id").references(() => users.id),
    editorAuthUserId: text("editor_auth_user_id").references(() => user.id, { onDelete: "set null" }),
    categoryId: integer("category_id").references(() => categories.id),
    locationId: integer("location_id").references(() => locations.id),
    viewCount: integer("view_count").default(0).notNull(),
    readingTime: integer("reading_time").default(0),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    seoKeywords: text("seo_keywords"),
    focusKeyword: varchar("focus_keyword", { length: 100 }),
    canonicalUrl: text("canonical_url"),
    seoScore: integer("seo_score").default(0),
    featured: boolean("featured").default(false),
    editorsChoice: boolean("editors_choice").default(false),
    breaking: boolean("breaking").default(false),
    sponsoredLabel: varchar("sponsored_label", { length: 50 }), // Sponsored, Advertisement, Press Release
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("articles_slug_idx").on(table.slug),
    index("articles_status_idx").on(table.status),
    index("articles_category_id_idx").on(table.categoryId),
    index("articles_author_id_idx").on(table.authorId),
    index("articles_published_at_idx").on(table.publishedAt),
    index("articles_status_published_at_idx").on(table.status, table.publishedAt),
    index("articles_status_view_count_idx").on(table.status, table.viewCount),
    index("articles_status_category_published_idx").on(table.status, table.categoryId, table.publishedAt),
    index("articles_status_author_published_idx").on(table.status, table.authorId, table.publishedAt),
    index("articles_status_featured_idx").on(table.status, table.featured, table.publishedAt),
    index("articles_status_breaking_idx").on(table.status, table.breaking, table.publishedAt),
    index("articles_breaking_window_idx").on(table.breaking, table.breakingStartsAt, table.breakingEndsAt),
  ]
);

// ============================================
// Article View Events
// ============================================
export const articleViews = pgTable(
  "article_views",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    sessionHash: varchar("session_hash", { length: 64 }).notNull(),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    userAgentHash: varchar("user_agent_hash", { length: 64 }).notNull(),
    dedupeKey: varchar("dedupe_key", { length: 128 }).notNull().unique(),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [
    index("article_views_article_viewed_idx").on(table.articleId, table.viewedAt),
    index("article_views_viewed_idx").on(table.viewedAt),
  ]
);

export const articleViewRollups = pgTable(
  "article_view_rollups",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    bucketStart: timestamp("bucket_start").notNull(),
    bucketType: varchar("bucket_type", { length: 10 }).notNull().default("hour"),
    viewCount: integer("view_count").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("article_view_rollups_article_bucket_unique").on(table.articleId, table.bucketStart, table.bucketType),
    index("article_view_rollups_bucket_idx").on(table.bucketStart, table.bucketType),
  ]
);

// ============================================
// Article Tags (Many-to-Many)
// ============================================
export const articleTags = pgTable(
  "article_tags",
  {
    articleId: integer("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    tagId: integer("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("article_tags_unique").on(table.articleId, table.tagId),
    index("article_tags_tag_id_idx").on(table.tagId, table.articleId),
  ]
);

// ============================================
// Article Topics (Many-to-Many)
// ============================================
export const articleTopics = pgTable(
  "article_topics",
  {
    articleId: integer("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    topicId: integer("topic_id")
      .references(() => topics.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("article_topics_unique").on(table.articleId, table.topicId),
  ]
);

// ============================================
// Article Entities (Many-to-Many)
// ============================================
export const articleEntities = pgTable(
  "article_entities",
  {
    articleId: integer("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    entityId: integer("entity_id")
      .references(() => entities.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("article_entities_unique").on(table.articleId, table.entityId),
  ]
);

// ============================================
// Article Sources (Many-to-Many)
// ============================================
export const articleSources = pgTable(
  "article_sources",
  {
    articleId: integer("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    sourceId: integer("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("article_sources_unique").on(table.articleId, table.sourceId),
  ]
);

// ============================================
// Article Revisions & Corrections
// ============================================
export const articleRevisions = pgTable(
  "article_revisions",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    versionNumber: integer("version_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    changedById: integer("changed_by_id").references(() => users.id),
    changedByAuthUserId: text("changed_by_auth_user_id").references(() => user.id, { onDelete: "set null" }),
    changeSummary: text("change_summary"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("article_revisions_article_idx").on(table.articleId)]
);

export const articleCorrections = pgTable(
  "article_corrections",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    revisionId: integer("revision_id").references(() => articleRevisions.id),
    noticeText: text("notice_text").notNull(),
    publishedAt: timestamp("published_at").defaultNow().notNull(),
  }
);

// ============================================
// Comments
// ============================================
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id").references(() => users.id),
    parentId: integer("parent_id"),
    content: text("content").notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, approved, spam, rejected
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
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // image, video, file
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt"),
  caption: text("caption"),
  credit: text("credit"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  authUserId: text("auth_user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Article Media (hero, gallery, and video)
// ============================================
export const articleMedia = pgTable(
  "article_media",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    mediaId: integer("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).default("gallery").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    caption: text("caption"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("article_media_article_media_unique").on(table.articleId, table.mediaId),
    index("article_media_article_role_idx").on(table.articleId, table.role, table.sortOrder),
  ]
);

// ============================================
// Bookmarks
// ============================================
export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("bookmarks_user_article_unique").on(table.userId, table.articleId),
    index("bookmarks_user_created_idx").on(table.userId, table.createdAt),
  ]
);

// ============================================
// Reading History
// ============================================
export const readingHistory = pgTable(
  "reading_history",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    articleId: integer("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
    lastReadAt: timestamp("last_read_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("reading_history_user_article_unique").on(table.userId, table.articleId),
    index("reading_history_user_last_read_idx").on(table.userId, table.lastReadAt),
  ]
);

// ============================================
// Public Content Submissions
// ============================================
export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    summary: text("summary"),
    content: text("content").notNull(),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    featuredImage: text("featured_image"),
    attachments: jsonb("attachments").$type<string[]>(),
    videoUrl: text("video_url"),
    sources: text("sources"),
    status: varchar("status", { length: 30 }).default("draft").notNull(),
    adminNote: text("admin_note"),
    reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at"),
    submittedAt: timestamp("submitted_at"),
    publishedAt: timestamp("published_at"),
    articleId: integer("article_id").references(() => articles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("submissions_user_status_idx").on(table.userId, table.status),
    index("submissions_status_created_idx").on(table.status, table.createdAt),
  ]
);

// ============================================
// Submission Review History
// ============================================
export const submissionReviews = pgTable(
  "submission_reviews",
  {
    id: serial("id").primaryKey(),
    submissionId: integer("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    reviewerId: text("reviewer_id").references(() => user.id, { onDelete: "set null" }),
    action: varchar("action", { length: 30 }).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("submission_reviews_submission_created_idx").on(table.submissionId, table.createdAt),
  ]
);

// ============================================
// Submission Revision Snapshots
// ============================================
export const submissionRevisions = pgTable(
  "submission_revisions",
  {
    id: serial("id").primaryKey(),
    submissionId: integer("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    changedById: text("changed_by_id").references(() => user.id, { onDelete: "set null" }),
    changeSummary: text("change_summary"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("submission_revisions_submission_version_idx").on(table.submissionId, table.versionNumber),
    index("submission_revisions_submission_created_idx").on(table.submissionId, table.createdAt),
  ]
);

// ============================================
// Redirect Manager
// ============================================
export const redirects = pgTable(
  "redirects",
  {
    id: serial("id").primaryKey(),
    oldUrl: text("old_url").notNull().unique(),
    newUrl: text("new_url").notNull(),
    statusCode: integer("status_code").default(301).notNull(), // 301, 302
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("redirects_old_url_idx").on(table.oldUrl)]
);

// ============================================
// Audit Logs
// ============================================
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    userEmail: varchar("user_email", { length: 255 }),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 100 }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    details: jsonb("details"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("audit_logs_user_idx").on(table.userId)]
);

// ============================================
// Advertisements
// ============================================
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  advertiserName: varchar("advertiser_name", { length: 150 }),
  image: text("image"),
  desktopImage: text("desktop_image"),
  mobileImage: text("mobile_image"),
  link: text("link"),
  position: varchar("position", { length: 50 }).notNull(), // header, sidebar, footer, inline, interstitial
  status: varchar("status", { length: 20 }).default("active").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  clicks: integer("clicks").default(0),
  impressions: integer("impressions").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Business Publications
// ============================================
export const businessPublications = pgTable(
  "business_publications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    companyName: varchar("company_name", { length: 200 }).notNull(),
    contactName: varchar("contact_name", { length: 150 }),
    companyWebsite: text("company_website"),
    industry: varchar("industry", { length: 100 }),
    contactEmail: varchar("contact_email", { length: 255 }).notNull(),
    contactPhone: varchar("contact_phone", { length: 50 }),
    status: varchar("status", { length: 30 }).default("submitted").notNull(), // submitted, under_review, revision_required, approved, rejected, scheduled, published
    articleTitle: text("article_title"),
    articleContent: text("article_content"),
    attachments: jsonb("attachments").$type<string[]>(),
    reviewNote: text("review_note"),
    reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at"),
    publishedAt: timestamp("published_at"),
    amount: integer("amount").default(0).notNull(), // in IDR
    paymentStatus: varchar("payment_status", { length: 20 }).default("pending").notNull(), // pending, paid, failed, refunded
    articleId: integer("article_id").references(() => articles.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("business_publications_status_created_idx").on(table.status, table.createdAt)]
);

// ============================================
// Pages (Static Pages)
// ============================================
export const pages = pgTable(
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
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 20 }).default("text"), // text, boolean, json, number
  group: varchar("group", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Newsletter Subscribers
// ============================================
export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    isActive: boolean("is_active").default(true).notNull(),
    source: varchar("source", { length: 50 }).default("footer"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("newsletter_email_unique").on(table.email)]
);

// ============================================
// Contact Messages
// ============================================
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 20 }).default("new").notNull(), // new, read, replied, archived
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("contact_status_idx").on(table.status)]
);

// ============================================
// Notifications (In-App)
// ============================================
export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(), // Better Auth user id atau identifier session contributor
    type: varchar("type", { length: 50 }).notNull(), // article_submitted, article_review, revision_required, article_approved, article_published, article_rejected
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    articleId: integer("article_id").references(() => articles.id, { onDelete: "cascade" }),
    link: varchar("link", { length: 255 }),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId, table.createdAt),
    index("notifications_is_read_idx").on(table.userId, table.isRead),
  ]
);

// ============================================
// Relations
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
  authUser: one(user, {
    fields: [authors.authUserId],
    references: [user.id],
  }),
  articles: many(articles),
  milestoneLogs: many(authorMilestoneLogs),
}));

export const authorMilestoneLogsRelations = relations(authorMilestoneLogs, ({ one }) => ({
  author: one(authors, {
    fields: [authorMilestoneLogs.authorId],
    references: [authors.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  editor: one(users, {
    fields: [articles.editorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  location: one(locations, {
    fields: [articles.locationId],
    references: [locations.id],
  }),
  tags: many(articleTags),
  topics: many(articleTopics),
  entities: many(articleEntities),
  sources: many(articleSources),
  revisions: many(articleRevisions),
  corrections: many(articleCorrections),
  comments: many(comments),
}));

export const articleTopicsRelations = relations(articleTopics, ({ one }) => ({
  article: one(articles, {
    fields: [articleTopics.articleId],
    references: [articles.id],
  }),
  topic: one(topics, {
    fields: [articleTopics.topicId],
    references: [topics.id],
  }),
}));

export const articleEntitiesRelations = relations(articleEntities, ({ one }) => ({
  article: one(articles, {
    fields: [articleEntities.articleId],
    references: [articles.id],
  }),
  entity: one(entities, {
    fields: [articleEntities.entityId],
    references: [entities.id],
  }),
}));

export const articleSourcesRelations = relations(articleSources, ({ one }) => ({
  article: one(articles, {
    fields: [articleSources.articleId],
    references: [articles.id],
  }),
  source: one(sources, {
    fields: [articleSources.sourceId],
    references: [sources.id],
  }),
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

export const topicsRelations = relations(topics, ({ many }) => ({
  articles: many(articleTopics),
}));

export const entitiesRelations = relations(entities, ({ many }) => ({
  articles: many(articleEntities),
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  article: one(articles, {
    fields: [notifications.articleId],
    references: [articles.id],
  }),
}));
