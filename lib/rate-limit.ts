import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";
import { apiError } from "@/lib/api-response";

type RateLimitResult = { allowed: boolean; retryAfter: number; unavailable?: boolean };

const localWindows = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest, scope: string) {
  const requestIp = (request as NextRequest & { ip?: string }).ip;
  const trustProxyHeaders = process.env.TRUST_PROXY_HEADERS === "true";
  const forwarded = trustProxyHeaders ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : undefined;
  const proxyIp = trustProxyHeaders ? request.headers.get("x-real-ip") : undefined;
  const ip = requestIp || forwarded || proxyIp || "unknown";
  return `rate-limit:${scope}:${ip}`;
}

export async function rateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const key = getClientKey(request, scope);
  const redis = getRedisClient();

  if (redis) {
    try {
      if (redis.status === "wait") await redis.connect();
      if (redis.status === "ready") {
        const count = await redis.incr(key);
        if (count === 1) await redis.expire(key, windowSeconds);
        const ttl = await redis.ttl(key);
        return { allowed: count <= limit, retryAfter: Math.max(ttl, 1) };
      }
    } catch {
      if (process.env.NODE_ENV === "production") {
        return { allowed: false, retryAfter: 60, unavailable: true };
      }
    }
  }

  if (process.env.NODE_ENV === "production") {
    return { allowed: false, retryAfter: 60, unavailable: true };
  }

  const now = Date.now();
  const existing = localWindows.get(key);
  if (!existing || existing.resetAt <= now) {
    localWindows.set(key, { count: 1, resetAt: now + windowSeconds * 1_000 });
    return { allowed: true, retryAfter: windowSeconds };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    retryAfter: Math.max(Math.ceil((existing.resetAt - now) / 1_000), 1),
  };
}

export async function enforceRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowSeconds: number
): Promise<NextResponse | null> {
  const result = await rateLimit(request, scope, limit, windowSeconds);
  if (result.allowed) return null;
  const response = result.unavailable
    ? apiError(503, "RATE_LIMIT_UNAVAILABLE", "Request protection is temporarily unavailable. Please try again.")
    : apiError(429, "RATE_LIMITED", "Too many requests. Please try again later.");
  response.headers.set("Retry-After", String(result.retryAfter));
  return response;
}
