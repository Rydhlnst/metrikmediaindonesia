import postgres from "postgres";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function pushSchema() {
  console.log("Connecting to NeonDB...");

  // Users table
  await sql`CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY,
    "email" varchar NOT NULL UNIQUE,
    "password" varchar NOT NULL,
    "name" varchar NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT 'author',
    "avatar" varchar,
    "bio" text,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp,
    "login_attempts" integer DEFAULT 0,
    "lock_until" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log("✓ users");

  // Categories table
  await sql`CREATE TABLE IF NOT EXISTS "categories" (
    "id" serial PRIMARY KEY,
    "name" varchar NOT NULL UNIQUE,
    "slug" varchar NOT NULL UNIQUE,
    "description" text,
    "color" varchar DEFAULT '#ea580c',
    "featured_image" varchar,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log("✓ categories");

  // Tags table
  await sql`CREATE TABLE IF NOT EXISTS "tags" (
    "id" serial PRIMARY KEY,
    "name" varchar NOT NULL UNIQUE,
    "slug" varchar NOT NULL UNIQUE,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log("✓ tags");

  // Media table
  await sql`CREATE TABLE IF NOT EXISTS "media" (
    "id" serial PRIMARY KEY,
    "alt" varchar NOT NULL DEFAULT '',
    "caption" varchar,
    "url" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" integer,
    "width" integer,
    "height" integer,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log("✓ media");

  // Articles table
  await sql`CREATE TABLE IF NOT EXISTS "articles" (
    "id" serial PRIMARY KEY,
    "title" varchar NOT NULL DEFAULT '',
    "slug" varchar NOT NULL UNIQUE,
    "excerpt" text NOT NULL DEFAULT '',
    "content" jsonb NOT NULL DEFAULT '{}',
    "featured_image_id" integer REFERENCES "media"("id"),
    "reading_time" integer DEFAULT 5,
    "status" varchar DEFAULT 'draft',
    "is_featured" boolean DEFAULT false,
    "is_breaking" boolean DEFAULT false,
    "published_at" timestamp,
    "view_count" integer DEFAULT 0,
    "meta_title" varchar,
    "meta_description" varchar,
    "og_image_id" integer REFERENCES "media"("id"),
    "author_id" integer REFERENCES "users"("id") NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log("✓ articles");

  // Article <-> Category relationship
  await sql`CREATE TABLE IF NOT EXISTS "articles_rels" (
    "id" serial PRIMARY KEY,
    "parent_id" integer REFERENCES "articles"("id") ON DELETE CASCADE,
    "category_id" integer REFERENCES "categories"("id") ON DELETE CASCADE
  )`;
  console.log("✓ articles_rels (category)");

  // Article <-> Tags relationship
  await sql`CREATE TABLE IF NOT EXISTS "articles_tags_rels" (
    "id" serial PRIMARY KEY,
    "parent_id" integer REFERENCES "articles"("id") ON DELETE CASCADE,
    "tag_id" integer REFERENCES "tags"("id") ON DELETE CASCADE
  )`;
  console.log("✓ articles_tags_rels");

  // Site settings (Payload globals stored in _globals table)
  await sql`CREATE TABLE IF NOT EXISTS "_globals" (
    "id" serial PRIMARY KEY,
    "global_type" varchar NOT NULL DEFAULT 'site-settings',
    "site_name" varchar DEFAULT 'Metrik Media Indonesia',
    "tagline" varchar DEFAULT 'Portal Berita Terpercaya',
    "description" text DEFAULT 'Portal berita terpercaya, terkini, dan akurat dari Metrik Media Indonesia',
    "logo_id" integer REFERENCES "media"("id"),
    "company" varchar DEFAULT 'PT Prima Mutiara Media',
    "social" jsonb DEFAULT '{}',
    "contact" jsonb DEFAULT '{}',
    "seo" jsonb DEFAULT '{}',
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log("✓ _globals");

  // Payload versions table
  await sql`CREATE TABLE IF NOT EXISTS "_versions" (
    "id" serial PRIMARY KEY,
    "parent_id" integer,
    "parent_collection" varchar,
    "version_type" varchar DEFAULT 'draft',
    "version_data" jsonb NOT NULL DEFAULT '{}',
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log("✓ _versions");

  console.log("\n✅ All tables created successfully!");
  process.exit(0);
}

pushSchema().catch((err) => {
  console.error("Push failed:", err);
  process.exit(1);
});
