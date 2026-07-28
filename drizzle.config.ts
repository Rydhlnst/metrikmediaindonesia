import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const dbType = process.env.DATABASE_TYPE || "postgresql";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: dbType === "mysql" ? "mysql" : "postgresql",
  dbCredentials:
    dbType === "mysql"
      ? {
          url: `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`,
        }
      : {
          url: process.env.POSTGRES_URL!,
        },
});
