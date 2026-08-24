import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { redirects } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { redirectSchema } from "@/lib/validators/public";
import { zodError } from "@/lib/api-response";
import { invalidateRedirectCache, isSafeRedirectPath } from "@/lib/redirects";

const redirectUpdateSchema = redirectSchema.partial();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const redirectId = Number(id);
    if (!Number.isInteger(redirectId) || redirectId <= 0) return NextResponse.json({ message: "Invalid redirect id" }, { status: 422 });
    const parsed = redirectUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { oldUrl, newUrl, statusCode, isActive } = parsed.data;
    if ((oldUrl && !isSafeRedirectPath(oldUrl)) || (newUrl && !isSafeRedirectPath(newUrl))) return NextResponse.json({ message: "Only safe internal paths are allowed" }, { status: 422 });

    const [existing] = await db
      .select()
      .from(redirects)
      .where(eq(redirects.id, redirectId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Redirect tidak ditemukan" }, { status: 404 });
    }

    const effectiveOldUrl = oldUrl ?? existing.oldUrl;
    const effectiveNewUrl = newUrl ?? existing.newUrl;
    if (effectiveOldUrl === effectiveNewUrl) return NextResponse.json({ message: "A redirect cannot point to itself" }, { status: 422 });
    const visited = new Set<string>([effectiveOldUrl]);
    let current = effectiveNewUrl;
    for (let depth = 0; depth < 20; depth += 1) {
      if (visited.has(current)) return NextResponse.json({ message: "This redirect would create a loop" }, { status: 422 });
      visited.add(current);
      const [next] = await db.select({ newUrl: redirects.newUrl }).from(redirects).where(and(eq(redirects.oldUrl, current), eq(redirects.isActive, true), ne(redirects.id, redirectId))).limit(1);
      if (!next) break;
      current = next.newUrl;
    }

    if (oldUrl && oldUrl !== existing.oldUrl) {
      const [duplicate] = await db
        .select()
        .from(redirects)
        .where(and(eq(redirects.oldUrl, oldUrl), ne(redirects.id, redirectId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Redirect untuk URL asal ini sudah ada" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(redirects)
      .set({
        oldUrl: oldUrl ?? existing.oldUrl,
        newUrl: newUrl ?? existing.newUrl,
        statusCode: statusCode ?? existing.statusCode,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      })
      .where(eq(redirects.id, redirectId))
      .returning();

    await invalidateRedirectCache(existing.oldUrl);
    if (updated?.oldUrl && updated.oldUrl !== existing.oldUrl) await invalidateRedirectCache(updated.oldUrl);
    return NextResponse.json({ message: "Redirect berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/redirects/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui redirect" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const redirectId = Number(id);
    if (!Number.isInteger(redirectId) || redirectId <= 0) return NextResponse.json({ message: "Invalid redirect id" }, { status: 422 });

    const [existing] = await db.select({ oldUrl: redirects.oldUrl }).from(redirects).where(eq(redirects.id, redirectId)).limit(1);

    await db.delete(redirects).where(eq(redirects.id, redirectId));
    if (existing) await invalidateRedirectCache(existing.oldUrl);

    return NextResponse.json({ message: "Redirect berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/redirects/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus redirect" }, { status: 500 });
  }
}
