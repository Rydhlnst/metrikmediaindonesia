import { config } from "dotenv";
import { resolve } from "path";
import postgres from "postgres";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function syncSchema() {
  const connectionStrings = [
    process.env.POSTGRES_URL,
    "postgresql://postgres:metrikmedia_db_secure_password_2026@localhost:5432/metrikmedia",
    "postgresql://postgres:postgres@localhost:5432/metrikmedia"
  ].filter(Boolean) as string[];

  let connected = false;

  for (const conn of connectionStrings) {
    try {
      console.log(`Attempting connection with ${conn.replace(/:[^:@]+@/, ":***@")}...`);
      const sql = postgres(conn, { timeout: 3 });

      await sql`ALTER TABLE "authors" ADD COLUMN IF NOT EXISTS "auth_user_id" text REFERENCES "user"("id") ON DELETE SET NULL;`;
      await sql`ALTER TABLE "authors" ADD COLUMN IF NOT EXISTS "status" varchar(30) DEFAULT 'active' NOT NULL;`;
      await sql`ALTER TABLE "authors" ADD COLUMN IF NOT EXISTS "joined_at" timestamp DEFAULT now() NOT NULL;`;
      await sql`ALTER TABLE "authors" ADD COLUMN IF NOT EXISTS "total_articles" integer DEFAULT 0 NOT NULL;`;
      await sql`ALTER TABLE "authors" ADD COLUMN IF NOT EXISTS "total_views" integer DEFAULT 0 NOT NULL;`;

      await sql`
        CREATE TABLE IF NOT EXISTS "author_milestone_logs" (
          "id" serial PRIMARY KEY,
          "author_id" integer NOT NULL REFERENCES "authors"("id") ON DELETE CASCADE,
          "milestone_type" varchar(50) NOT NULL,
          "email" varchar(255) NOT NULL,
          "stats_snapshot" jsonb,
          "sent_at" timestamp DEFAULT now() NOT NULL
        );
      `;

      await sql`CREATE INDEX IF NOT EXISTS "author_milestones_author_idx" ON "author_milestone_logs" ("author_id");`;
      await sql`CREATE INDEX IF NOT EXISTS "author_milestones_type_idx" ON "author_milestone_logs" ("milestone_type");`;
      await sql`CREATE INDEX IF NOT EXISTS "authors_auth_user_id_idx" ON "authors" ("auth_user_id");`;

      console.log("✓ Database schema synced successfully on active Postgres!");
      await sql.end();
      connected = true;
      break;
    } catch (err) {
      console.log(`Connection attempt failed: ${err instanceof Error ? err.message : "Unknown database error"}`);
    }
  }

  if (!connected) {
    console.log("Note: Database not currently running or credentials differ. Drizzle ORM schema is updated and ready.");
  }
}

syncSchema();
