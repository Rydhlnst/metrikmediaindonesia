import postgres from "postgres";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function reset() {
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  for (const row of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`);
    console.log(`Dropped: ${row.tablename}`);
  }
  console.log("\nDone! Payload will recreate tables on next startup.");
  process.exit(0);
}

reset().catch((e) => {
  console.error(e);
  process.exit(1);
});
