import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { getRedisClient } from "@/lib/redis";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

type CheckStatus = "ok" | "failed";

function safeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[redacted database url]")
    .replace(/redis:\/\/[^\s]+/gi, "[redacted redis url]");
}

export async function GET() {
  const checks: Record<string, CheckStatus> = {
    configuration: process.env.APP_STARTUP_DEGRADED === "true" ? "failed" : "ok",
    database: "failed",
    redis: "failed",
    storage: "failed",
  };
  const errors: Array<{ service: string; message: string }> = [];

  if (checks.configuration === "failed") {
    errors.push({ service: "configuration", message: "Startup validation failed; inspect the app container logs." });
  }

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

  try {
    const endpoint = process.env.MINIO_ENDPOINT;
    if (!endpoint) throw new Error("MINIO_ENDPOINT is not configured");
    const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
    const response = await fetch(`${protocol}://${endpoint}:${process.env.MINIO_PORT || "9000"}/minio/health/live`, {
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) throw new Error(`MinIO health check returned ${response.status}`);
    checks.storage = "ok";
  } catch (error) {
    const message = safeErrorMessage(error);
    errors.push({ service: "storage", message });
    console.error("Health check failed [storage]", message);
  }

  return NextResponse.json(
    {
      status: errors.length === 0 ? "ok" : "degraded",
      degraded: errors.length > 0,
      checks,
      failedChecks: errors.map((error) => error.service),
      ...(process.env.NODE_ENV === "production" ? {} : { errors }),
      timestamp: new Date().toISOString(),
    },
    { status: errors.length === 0 ? 200 : 503 },
  );
}
