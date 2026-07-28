import { config } from "dotenv";
import { resolve } from "path";
import { getDatabaseType } from "./index";

config({ path: resolve(process.cwd(), ".env.local") });

async function seed() {
  const dbType = getDatabaseType();
  console.log(`Seeding database: ${dbType}`);

  if (dbType === "postgresql") {
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = (await import("postgres")).default;
    const schema = await import("./schema/index");

    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) throw new Error("POSTGRES_URL is not set");

    const client = postgres(connectionString);
    const db = drizzle(client);

    // Seed roles
    await db.insert(schema.roles).values([
      { name: "super_admin", description: "Akses penuh ke seluruh sistem" },
      { name: "editor", description: "Mengelola konten dan mempublikasikan artikel" },
      { name: "author", description: "Menulis dan mengirim artikel untuk review" },
      { name: "reporter", description: "Meliput dan menulis berita di lapangan" },
      { name: "viewer", description: "Melihat konten dashboard saja" },
    ]).onConflictDoNothing();

    // Seed categories
    await db.insert(schema.categories).values([
      { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
      { name: "Olahraga", slug: "olahraga", color: "#059669" },
      { name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
      { name: "Sosial & Budaya", slug: "sosial-dan-budaya", color: "#D97706" },
    ]).onConflictDoNothing();

    // Seed tags
    await db.insert(schema.tags).values([
      { name: "Breaking News", slug: "breaking-news" },
      { name: "Indonesia", slug: "indonesia" },
      { name: "Global", slug: "global" },
      { name: "Exclusive", slug: "exclusive" },
      { name: "Trending", slug: "trending" },
    ]).onConflictDoNothing();
  }

  if (dbType === "mysql") {
    const { drizzle } = await import("drizzle-orm/mysql2");
    const mysql2 = await import("mysql2/promise");
    const schema = await import("./schema/mysql");

    const connection = await mysql2.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "metrikmedia",
    });

    const db = drizzle(connection);

    await db.insert(schema.roles).values([
      { name: "super_admin", description: "Akses penuh ke seluruh sistem" },
      { name: "editor", description: "Mengelola konten dan mempublikasikan artikel" },
      { name: "author", description: "Menulis dan mengirim artikel untuk review" },
      { name: "reporter", description: "Meliput dan menulis berita di lapangan" },
      { name: "viewer", description: "Melihat konten dashboard saja" },
    ]);

    await db.insert(schema.categories).values([
      { name: "Bisnis", slug: "bisnis", color: "#2563EB" },
      { name: "Olahraga", slug: "olahraga", color: "#059669" },
      { name: "Pendidikan", slug: "pendidikan", color: "#7C3AED" },
      { name: "Sosial & Budaya", slug: "sosial-dan-budaya", color: "#D97706" },
    ]);

    await db.insert(schema.tags).values([
      { name: "Breaking News", slug: "breaking-news" },
      { name: "Indonesia", slug: "indonesia" },
      { name: "Global", slug: "global" },
      { name: "Exclusive", slug: "exclusive" },
      { name: "Trending", slug: "trending" },
    ]);
  }

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
