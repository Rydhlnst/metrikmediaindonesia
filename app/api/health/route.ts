import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { getRedisClient } from "@/lib/redis";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

function safeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[redacted database url]")
    .replace(/redis:\/\/[^\s]+/gi, "[redacted redis url]");
}

export async function GET() {
  const checks: Record<string, "ok" | "failed"> = {
    database: "failed",
    redis: "failed",
  };
  const errors: Array<{ service: string; message: string }> = [];

  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
  } catch (error) {
    const message = safeErrorMessage(error);
    errors.push({ service: "database", message });
    console.error("Health check failed [database]", message);
  }

  checks.database = errors.some((error) => error.service === "database") ? "failed" : "ok";

  try {
    const redis = getRedisClient();
    if (!redis) throw new Error("Redis client is unavailable");
    await redis.ping();
  } catch (error) {
    const message = safeErrorMessage(error);
    errors.push({ service: "redis", message });
    console.error("Health check failed [redis]", message);
  }

  checks.redis = errors.some((error) => error.service === "redis") ? "failed" : "ok";

  return NextResponse.json(
    {
      status: errors.length === 0 ? "ok" : "unhealthy",
      checks,
      ...(process.env.NODE_ENV === "production" ? {} : { errors }),
      timestamp: new Date().toISOString(),
    },
    { status: errors.length === 0 ? 200 : 503 },
  );
}
