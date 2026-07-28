import postgres from "postgres";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function check() {
  const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
  try {
    const tables = await sql.unsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
    if (tables.length === 0) {
      console.log("NO TABLES FOUND");
    } else {
      tables.forEach((t: any) => console.log(t.tablename));
    }
  } catch (e: any) {
    console.error("Error:", e.message);
  }
  await sql.end();
  process.exit(0);
}

check();
