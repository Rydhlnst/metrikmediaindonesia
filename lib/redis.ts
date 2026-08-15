import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let redisInstance: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (process.env.NODE_ENV === "test") return null;

  if (!redisInstance) {
    try {
      redisInstance = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 2,
        connectTimeout: 2000,
        lazyConnect: true,
        retryStrategy(times) {
          if (times > 3) {
            return null; // Stop retrying after 3 attempts
          }
          return Math.min(times * 100, 1000);
        },
      });

      redisInstance.on("error", (err) => {
        // Silently log or handle in dev/build without crashing the app
        if (process.env.NODE_ENV !== "production") {
          // suppress noisy logs if local redis is off
        } else {
          console.warn("[Redis] Connection warning:", err.message);
        }
      });
    } catch (e) {
      console.warn("[Redis] Init failed, proceeding with DB fallback:", e);
      redisInstance = null;
    }
  }

  return redisInstance;
}

/**
 * Cache wrapper with Redis L2 cache support and automatic fallback
 */
export async function withRedisCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const redis = getRedisClient();

  if (redis) {
    try {
      if (redis.status === "wait") {
        await redis.connect().catch(() => {});
      }
      if (redis.status === "ready") {
        const cached = await redis.get(key);
        if (cached) {
          return JSON.parse(cached) as T;
        }
      }
    } catch {
      // ignore redis read error and fallback to db
    }
  }

  const freshData = await fetcher();

  if (redis && freshData !== undefined && freshData !== null) {
    try {
      if (redis.status === "ready") {
        await redis.set(key, JSON.stringify(freshData), "EX", ttlSeconds);
      }
    } catch {
      // ignore redis write error
    }
  }

  return freshData;
}

/**
 * Invalidate Redis keys by pattern
 */
export async function invalidateRedisPattern(pattern: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    if (redis.status === "wait") {
      await redis.connect().catch(() => {});
    }
    if (redis.status === "ready") {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  } catch (err) {
    console.warn(`[Redis] Failed to invalidate pattern ${pattern}:`, err);
  }
}
