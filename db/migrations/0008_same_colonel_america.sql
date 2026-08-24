CREATE TABLE "reading_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"article_id" integer NOT NULL,
	"last_read_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "advertisements" ADD COLUMN "desktop_image" text;--> statement-breakpoint
ALTER TABLE "advertisements" ADD COLUMN "mobile_image" text;--> statement-breakpoint
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "reading_history_user_article_unique" ON "reading_history" USING btree ("user_id","article_id");--> statement-breakpoint
CREATE INDEX "reading_history_user_last_read_idx" ON "reading_history" USING btree ("user_id","last_read_at");
--> statement-breakpoint
INSERT INTO "permissions" ("key", "description") VALUES
('dashboard.view', 'View protected dashboards'),
('articles.create', 'Create articles'),
('articles.edit_own', 'Edit owned articles'),
('articles.edit_any', 'Edit any article'),
('articles.publish', 'Publish articles'),
('articles.delete', 'Delete articles'),
('submissions.create', 'Create submissions'),
('submissions.review', 'Review submissions'),
('media.upload', 'Upload media'),
('media.edit_any', 'Edit any media'),
('media.delete_any', 'Delete any media'),
('taxonomy.manage', 'Manage taxonomy'),
('users.manage', 'Manage users'),
('ads.manage', 'Manage advertisements'),
('analytics.view', 'View analytics'),
('audit_logs.view', 'View audit logs'),
('settings.manage', 'Manage settings'),
('roles.manage', 'Manage roles and permissions')
ON CONFLICT ("key") DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r CROSS JOIN "permissions" p
WHERE r."name" IN ('super_admin', 'administrator', 'admin')
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r JOIN "permissions" p ON p."key" IN ('dashboard.view', 'articles.create', 'articles.edit_any', 'articles.publish', 'articles.delete', 'submissions.review', 'media.upload', 'media.edit_any', 'media.delete_any', 'taxonomy.manage', 'analytics.view')
WHERE r."name" = 'editor_in_chief'
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r JOIN "permissions" p ON p."key" IN ('dashboard.view', 'articles.create', 'articles.edit_any', 'articles.publish', 'submissions.review', 'media.upload', 'media.edit_any', 'taxonomy.manage', 'analytics.view')
WHERE r."name" = 'editor'
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r JOIN "permissions" p ON p."key" IN ('dashboard.view', 'articles.edit_any', 'taxonomy.manage', 'analytics.view')
WHERE r."name" = 'seo_manager'
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r JOIN "permissions" p ON p."key" IN ('dashboard.view', 'ads.manage')
WHERE r."name" = 'advertisement_manager'
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r JOIN "permissions" p ON p."key" IN ('dashboard.view', 'articles.create', 'articles.edit_own', 'submissions.create', 'media.upload', 'analytics.view')
WHERE r."name" IN ('contributor', 'kontributor')
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r JOIN "permissions" p ON p."key" IN ('dashboard.view', 'articles.create', 'articles.edit_own', 'submissions.create', 'media.upload')
WHERE r."name" IN ('reporter', 'journalist')
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r JOIN "permissions" p ON p."key" = 'submissions.create'
WHERE r."name" = 'user'
ON CONFLICT DO NOTHING;
