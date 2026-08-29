import postgres from "postgres";
import Redis from "ioredis";

const required = ["BETTER_AUTH_SECRET", "CRON_SECRET", "POSTGRES_URL", "REDIS_URL"];
const missing = required.filter((key) => !process.env[key] || /generate_|change_in_production|super_secret|replace_with|local_/i.test(process.env[key] ?? ""));
const demoMode = process.env.DEMO_MODE === "true";
const isPlaceholder = (value) => !value || /your_real|generate_|change_in_production|super_secret|replace_with|local_/i.test(value);
const hasEmail = !isPlaceholder(process.env.RESEND_API_KEY) || (
  !isPlaceholder(process.env.SMTP_HOST) &&
  !isPlaceholder(process.env.SMTP_USER) &&
  !isPlaceholder(process.env.SMTP_PASS)
);
const invalidProductionDemoMode = process.env.NODE_ENV === "production" && demoMode;
if (missing.length || invalidProductionDemoMode || (!demoMode && !hasEmail)) {
  console.error(`Invalid production configuration: ${[...missing, invalidProductionDemoMode ? "DEMO_MODE must be false" : "", !demoMode && !hasEmail ? "SMTP_* or RESEND_API_KEY" : ""].filter(Boolean).join(", ")}`);
  process.exit(1);
}

if (demoMode && !hasEmail) {
  console.warn("DEMO_MODE is enabled; email delivery will be simulated.");
}

const db = postgres(process.env.POSTGRES_URL, { max: 1, connect_timeout: 5 });
const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, connectTimeout: 5_000 });
try {
  await db`select 1`;
  await redis.ping();
  const minioEndpoint = process.env.MINIO_ENDPOINT ?? "localhost";
  const minioPort = process.env.MINIO_PORT ?? "9000";
  const minioProtocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
  const minioHealth = await fetch(`${minioProtocol}://${minioEndpoint}:${minioPort}/minio/health/live`);
  if (!minioHealth.ok) throw new Error(`MinIO health check failed with ${minioHealth.status}`);
  console.log("Production configuration, PostgreSQL, Redis, and MinIO are valid.");
} finally {
  await db.end({ timeout: 5 });
  redis.disconnect();
}
