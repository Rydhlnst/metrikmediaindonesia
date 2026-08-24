import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { redirects } from "@/db/schema/index";
import { and, desc, eq } from "drizzle-orm";
import { redirectSchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";
import { invalidateRedirectCache, isSafeRedirectPath } from "@/lib/redirects";

async function createsRedirectLoop(db: Awaited<ReturnType<typeof getDb>>, oldUrl: string, newUrl: string) {
  const visited = new Set<string>([oldUrl]);
  let current = newUrl;
  for (let depth = 0; depth < 20; depth += 1) {
    if (visited.has(current)) return true;
    visited.add(current);
    const [next] = await db.select({ newUrl: redirects.newUrl }).from(redirects).where(and(eq(redirects.oldUrl, current), eq(redirects.isActive, true))).limit(1);
    if (!next) return false;
    current = next.newUrl;
  }
  return true;
}

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();

    const items = await db
      .select()
      .from(redirects)
      .orderBy(desc(redirects.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/redirects error:", error);
    return NextResponse.json({ message: "Gagal mengambil data redirect" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = redirectSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { oldUrl, newUrl, statusCode, isActive } = parsed.data;
    if (!isSafeRedirectPath(oldUrl) || !isSafeRedirectPath(newUrl) || oldUrl === newUrl) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Only safe, non-looping internal paths are allowed." } }, { status: 422 });
    if (await createsRedirectLoop(db, oldUrl, newUrl)) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "This redirect would create a loop." } }, { status: 422 });

    const [existing] = await db
      .select()
      .from(redirects)
      .where(eq(redirects.oldUrl, oldUrl))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { message: "Redirect untuk URL asal ini sudah ada" },
        { status: 400 }
      );
    }

    const [newRedirect] = await db
      .insert(redirects)
      .values({
        oldUrl,
        newUrl,
        statusCode: statusCode || 301,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();
    await invalidateRedirectCache(oldUrl);

    return NextResponse.json(
      { message: "Redirect berhasil dibuat", data: newRedirect },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/redirects error:", error);
    return NextResponse.json({ message: "Gagal membuat redirect" }, { status: 500 });
  }
}
