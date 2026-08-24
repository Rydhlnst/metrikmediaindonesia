import { eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { redirects } from "@/db/schema/index";
import { invalidateRedisPattern, withRedisCache } from "@/lib/redis";

export type ActiveRedirect = { newUrl: string; statusCode: 301 | 302 } | null;

export function isSafeRedirectPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

export async function resolveRedirect(pathname: string): Promise<ActiveRedirect> {
  if (!isSafeRedirectPath(pathname)) return null;
  try {
    const record = await withRedisCache(`redirect:${pathname}`, 300, async () => {
      const db = await getDb();
      const [redirect] = await db
        .select({ newUrl: redirects.newUrl, statusCode: redirects.statusCode, isActive: redirects.isActive })
        .from(redirects)
        .where(eq(redirects.oldUrl, pathname))
        .limit(1);
      if (!redirect || !redirect.isActive || !isSafeRedirectPath(redirect.newUrl) || ![301, 302].includes(redirect.statusCode)) {
        return { value: null };
      }
      return { value: { newUrl: redirect.newUrl, statusCode: redirect.statusCode as 301 | 302 } };
    });
    return record.value;
  } catch {
    return null;
  }
}

export async function invalidateRedirectCache(pathname?: string) {
  await invalidateRedisPattern(pathname ? `redirect:${pathname}` : "redirect:*");
}
