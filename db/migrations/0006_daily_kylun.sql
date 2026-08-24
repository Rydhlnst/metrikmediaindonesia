CREATE TABLE "article_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"session_hash" varchar(64) NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"user_agent_hash" varchar(64) NOT NULL,
	"dedupe_key" varchar(128) NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "article_views_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
CREATE TABLE "submission_revisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"version_number" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"changed_by_id" text,
	"change_summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "breaking_starts_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "breaking_ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "article_views" ADD CONSTRAINT "article_views_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_revisions" ADD CONSTRAINT "submission_revisions_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_revisions" ADD CONSTRAINT "submission_revisions_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_views_article_viewed_idx" ON "article_views" USING btree ("article_id","viewed_at");--> statement-breakpoint
CREATE INDEX "article_views_viewed_idx" ON "article_views" USING btree ("viewed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_revisions_submission_version_idx" ON "submission_revisions" USING btree ("submission_id","version_number");--> statement-breakpoint
CREATE INDEX "submission_revisions_submission_created_idx" ON "submission_revisions" USING btree ("submission_id","created_at");--> statement-breakpoint
CREATE INDEX "articles_breaking_window_idx" ON "articles" USING btree ("breaking","breaking_starts_at","breaking_ends_at");