import "dotenv/config";
import postgres from "postgres";
import Redis from "ioredis";

const required = ["BETTER_AUTH_SECRET", "CRON_SECRET", "POSTGRES_URL", "REDIS_URL", "MINIO_ENDPOINT", "MINIO_BUCKET"];
const missing = required.filter((key) => !process.env[key] || /generate_|change_in_production|super_secret|replace_with|local_/i.test(process.env[key] ?? ""));
const demoMode = process.env.DEMO_MODE === "true";
const isPlaceholder = (value?: string) => !value || /your_real|generate_|change_in_production|super_secret|replace_with|local_/i.test(value);
const hasSmtp = !isPlaceholder(process.env.SMTP_HOST) && !isPlaceholder(process.env.SMTP_USER) && !isPlaceholder(process.env.SMTP_PASS);
const hasResend = !isPlaceholder(process.env.RESEND_API_KEY);
const invalidProductionDemoMode = process.env.NODE_ENV === "production" && demoMode;

if (missing.length || invalidProductionDemoMode || (!demoMode && !hasSmtp && !hasResend)) {
  console.error(`Invalid production configuration: ${[...missing, invalidProductionDemoMode ? "DEMO_MODE must be false" : "", !demoMode && !hasSmtp && !hasResend ? "SMTP_* or RESEND_API_KEY" : ""].filter(Boolean).join(", ")}`);
  process.exit(1);
}

if (demoMode && !hasSmtp && !hasResend) {
  console.warn("DEMO_MODE is enabled; email delivery will be simulated.");
}

async function main() {
  const db = postgres(process.env.POSTGRES_URL!, { max: 1 });
  const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 1, connectTimeout: 5000 });
  try {
    await db`select 1`;
    await redis.ping();
    const minioEndpoint = process.env.MINIO_ENDPOINT!;
    const minioProtocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
    const minioHealth = await fetch(`${minioProtocol}://${minioEndpoint}:${process.env.MINIO_PORT || "9000"}/minio/health/live`);
    if (!minioHealth.ok) throw new Error(`MinIO health check failed with ${minioHealth.status}`);
    console.log("Production configuration, PostgreSQL, Redis, and MinIO are valid.");
  } finally {
    await db.end({ timeout: 5 });
    redis.disconnect();
  }
}

void main().catch((error) => {
  console.error("Production validation failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
