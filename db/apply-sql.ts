import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import postgres from "postgres";

config({ path: resolve(process.cwd(), ".env.local") });

async function applySql() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("POSTGRES_URL is not set");

  console.log("Resetting database schema on local Docker PostgreSQL...");
  const sql = postgres(connectionString);

  // Drop existing schema and recreate
  await sql`DROP SCHEMA public CASCADE;`;
  await sql`CREATE SCHEMA public;`;

  console.log("Applying database migration SQL...");
  const sqlContent = readFileSync(resolve(process.cwd(), "db/migrations/0000_magenta_surge.sql"), "utf-8");
  const statements = sqlContent.split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean);

  for (const statement of statements) {
    await sql.unsafe(statement);
  }

  console.log("✓ Local Docker PostgreSQL schema synced 100%!");
  await sql.end();
}

applySql().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
