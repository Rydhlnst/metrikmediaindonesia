import { config } from "dotenv";
import { resolve } from "path";
import { getDatabaseType } from "./index";

config({ path: resolve(process.cwd(), ".env.local") });

async function migrate() {
  const dbType = getDatabaseType();
  console.log(`Running migrations for: ${dbType}`);

  if (dbType === "postgresql") {
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = (await import("postgres")).default;
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");

    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) throw new Error("POSTGRES_URL is not set");

    const client = postgres(connectionString);
    const db = drizzle(client);
    await migrate(db, { migrationsFolder: "./db/migrations" });
  }

  if (dbType === "mysql") {
    const { drizzle } = await import("drizzle-orm/mysql2");
    const mysql2 = await import("mysql2/promise");
    const { migrate } = await import("drizzle-orm/mysql2/migrator");

    const connection = await mysql2.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "metrikmedia",
    });

    const db = drizzle(connection);
    await migrate(db, { migrationsFolder: "./db/migrations" });
  }

  console.log("Migrations completed!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
