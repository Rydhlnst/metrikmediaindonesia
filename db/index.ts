import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

export type DatabaseType = "postgresql" | "mysql";

export function getDatabaseType(): DatabaseType {
  return (process.env.DATABASE_TYPE as DatabaseType) || "postgresql";
}

// PostgreSQL connection
export async function createPostgresConnection() {
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const postgres = (await import("postgres")).default;

  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL is not set in environment variables");
  }

  const client = postgres(connectionString);
  return drizzle(client);
}

// MySQL connection
export async function createMysqlConnection() {
  const { drizzle } = await import("drizzle-orm/mysql2");
  const mysql2 = await import("mysql2/promise");

  const connection = await mysql2.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "metrikmedia",
  });

  return drizzle(connection);
}

// Unified connection creator
export async function createDatabaseConnection() {
  const dbType = getDatabaseType();

  if (dbType === "mysql") {
    return createMysqlConnection();
  }

  return createPostgresConnection();
}

// Singleton for server-side usage
let dbInstance: Awaited<ReturnType<typeof createDatabaseConnection>> | null = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await createDatabaseConnection();
  }
  return dbInstance;
}
