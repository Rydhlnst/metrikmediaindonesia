import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { getRedisClient } from "@/lib/redis";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
    const redis = getRedisClient();
    if (!redis) {
      return NextResponse.json({ status: "degraded", database: "ok", redis: "unavailable" }, { status: 503 });
    }
    await redis.ping();
    return NextResponse.json({ status: "ok", database: "ok", redis: "ok" });
  } catch (error) {
    console.error("Health check failed", error);
    return NextResponse.json({ status: "unhealthy" }, { status: 503 });
  }
}
