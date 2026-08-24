CREATE TABLE "article_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	"role" varchar(20) DEFAULT 'gallery' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"reviewer_id" text,
	"action" varchar(30) NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_revisions" ADD COLUMN "changed_by_auth_user_id" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "editor_auth_user_id" text;--> statement-breakpoint
ALTER TABLE "business_publications" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "business_publications" ADD COLUMN "contact_name" varchar(150);--> statement-breakpoint
ALTER TABLE "business_publications" ADD COLUMN "attachments" jsonb;--> statement-breakpoint
ALTER TABLE "business_publications" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "business_publications" ADD COLUMN "reviewed_by" text;--> statement-breakpoint
ALTER TABLE "business_publications" ADD COLUMN "reviewed_at" timestamp;--> statement-breakpoint
ALTER TABLE "business_publications" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "article_media" ADD CONSTRAINT "article_media_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_media" ADD CONSTRAINT "article_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "article_media_article_media_unique" ON "article_media" USING btree ("article_id","media_id");--> statement-breakpoint
CREATE INDEX "article_media_article_role_idx" ON "article_media" USING btree ("article_id","role","sort_order");--> statement-breakpoint
CREATE INDEX "submission_reviews_submission_created_idx" ON "submission_reviews" USING btree ("submission_id","created_at");--> statement-breakpoint
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_changed_by_auth_user_id_user_id_fk" FOREIGN KEY ("changed_by_auth_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_editor_auth_user_id_user_id_fk" FOREIGN KEY ("editor_auth_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_publications" ADD CONSTRAINT "business_publications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_publications" ADD CONSTRAINT "business_publications_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "business_publications_status_created_idx" ON "business_publications" USING btree ("status","created_at");