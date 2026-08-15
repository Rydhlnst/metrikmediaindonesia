import { config } from "dotenv";
import { resolve } from "path";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index";

// Load .env.local and .env
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

export type DatabaseType = "postgresql" | "mysql";

export function getDatabaseType(): DatabaseType {
  return (process.env.DATABASE_TYPE as DatabaseType) || "postgresql";
}

export type DbClient = PostgresJsDatabase<typeof schema>;

let dbInstance: DbClient | null = null;

export async function createPostgresConnection(): Promise<DbClient> {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL is not set in environment variables");
  }

  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export async function getDb(): Promise<DbClient> {
  if (!dbInstance) {
    dbInstance = await createPostgresConnection();
  }
  return dbInstance;
}
