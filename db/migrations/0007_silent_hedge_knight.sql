CREATE TABLE "article_view_rollups" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"bucket_start" timestamp NOT NULL,
	"bucket_type" varchar(10) DEFAULT 'hour' NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_view_rollups" ADD CONSTRAINT "article_view_rollups_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "article_view_rollups_article_bucket_unique" ON "article_view_rollups" USING btree ("article_id","bucket_start","bucket_type");--> statement-breakpoint
CREATE INDEX "article_view_rollups_bucket_idx" ON "article_view_rollups" USING btree ("bucket_start","bucket_type");