CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "author_milestone_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"milestone_type" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"stats_snapshot" jsonb,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"article_id" integer,
	"link" varchar(255),
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"avatar" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "authors" ALTER COLUMN "role" SET DEFAULT 'Kontributor';--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "review_note" text;--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "auth_user_id" text;--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "status" varchar(30) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "joined_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "total_articles" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "total_views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author_milestone_logs" ADD CONSTRAINT "author_milestone_logs_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "author_milestones_author_idx" ON "author_milestone_logs" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "author_milestones_type_idx" ON "author_milestone_logs" USING btree ("milestone_type");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_is_read_idx" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_auth_user_id_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_tags_tag_id_idx" ON "article_tags" USING btree ("tag_id","article_id");--> statement-breakpoint
CREATE INDEX "articles_status_published_at_idx" ON "articles" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "articles_status_view_count_idx" ON "articles" USING btree ("status","view_count");--> statement-breakpoint
CREATE INDEX "articles_status_category_published_idx" ON "articles" USING btree ("status","category_id","published_at");--> statement-breakpoint
CREATE INDEX "articles_status_author_published_idx" ON "articles" USING btree ("status","author_id","published_at");--> statement-breakpoint
CREATE INDEX "articles_status_featured_idx" ON "articles" USING btree ("status","featured","published_at");--> statement-breakpoint
CREATE INDEX "articles_status_breaking_idx" ON "articles" USING btree ("status","breaking","published_at");--> statement-breakpoint
CREATE INDEX "authors_auth_user_id_idx" ON "authors" USING btree ("auth_user_id");