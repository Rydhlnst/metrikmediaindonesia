ALTER TABLE "authors" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_email_unique" UNIQUE("email");